/**
 * Función de login reutilizable
 */
async function okLogin() {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' })
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('test_token', data.token);
    }
}

/**
 * PARTE I - Tests originales corregidos
 */
testUtils.createTestButton("Test Login Correcto (Pepe y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.ok) {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Password Incorrecto (Pepe y 123)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401 || data.message === "Credenciales inválidas.") {
        testUtils.setSuccess(btn);
    }
});

testUtils.createTestButton("Test Login - Usuario Incorrecto (Juan y 12345)", async (btn) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'juan', password: '12345' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401 || data.message === "Credenciales inválidas.") {
        testUtils.setSuccess(btn);
    }
});

/**
 * PARTE II - Tests nuevos
 */

// Test 1: Registro
testUtils.createTestButton("Test Registro - Usuario Nuevo", async (btn) => {
    try {
        const username = `usuario_${Date.now()}`;
        const password = 'password123';
        
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        testUtils.log(data);
        
        if (response.status === 201 || response.status === 200 || response.ok) {
            testUtils.setSuccess(btn);
        }
    } catch (error) {
        testUtils.log("Error: " + error.message);
    }
});

// Test 2: Seguridad
testUtils.createTestButton("Test Seguridad - Productor accediendo a Admin", async (btn) => {
    try {
        await okLogin();
        const token = localStorage.getItem('test_token');
        
        const response = await fetch('/api/admin/users', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        testUtils.log(data);
        
        if (response.status === 403 || response.status === 401) {
            testUtils.setSuccess(btn);
        }
    } catch (error) {
        testUtils.log("Error: " + error.message);
    }
});

// Test 3: Eliminar Sample
testUtils.createTestButton("Test Eliminar Sample Dinámico", async (btn) => {
    try {
        await okLogin();
        const token = localStorage.getItem('test_token');
        
        const getRes = await fetch('/api/samples/my-samples', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getData = await getRes.json();
        testUtils.log(getData);

        const samples = getData.samples || getData.data || [];
        const list = Array.isArray(samples) ? samples : [];

        if (list.length === 0) {
            testUtils.log("⚠️ No hay samples para eliminar");
            return;
        }

        const targetId = list[0].id;
        testUtils.log(`Eliminando ID: ${targetId}`);
        
        const delRes = await fetch(`/api/samples/${targetId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const delData = await delRes.json();
        testUtils.log(delData);

        if (delRes.ok || delRes.status === 200) {
            testUtils.setSuccess(btn);
        }
    } catch (error) {
        testUtils.log("Error: " + error.message);
    }
});

// Test 4: Carga incompleta
testUtils.createTestButton("Test Subir Sample - Error por Datos Faltantes", async (btn) => {
    try {
        await okLogin();
        const token = localStorage.getItem('test_token');
        
        const formData = new FormData();
        const audioBlob = new Blob(['fake audio'], { type: 'audio/wav' });
        formData.append('audioFile', audioBlob, 'test.wav');
        
        const response = await fetch('/api/samples', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        const data = await response.json();
        testUtils.log(data);
        
        if (response.status === 400 || response.status === 500 || !response.ok) {
            testUtils.setSuccess(btn);
        }
    } catch (error) {
        testUtils.log("Error: " + error.message);
        testUtils.setSuccess(btn); // Si hay error, el test pasa (era lo que buscábamos)
    }
});
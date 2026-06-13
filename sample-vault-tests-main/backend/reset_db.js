const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function resetDatabase() {
    console.log(' Reiniciando base de datos...');
    
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1980', // Si tu root tiene contraseña, ponela acá. Si usás XAMPP, dejalo vacío.
        database: 'samplevaultest'
    });
    // 1. Borrar tablas existentes
    await conn.query('DROP TABLE IF EXISTS samples');
    await conn.query('DROP TABLE IF EXISTS users');
    await conn.query('DROP PROCEDURE IF EXISTS sp_find_user_by_username');

    // 2. Crear tabla de usuarios
    await conn.query(`
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('productor', 'admin') DEFAULT 'productor',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 3. Crear tabla de samples
    await conn.query(`
        CREATE TABLE samples (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            display_name VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    // 4. Crear el Stored Procedure que faltaba
    await conn.query(`
        CREATE PROCEDURE sp_find_user_by_username(IN p_username VARCHAR(255))
        BEGIN
            SELECT id, username, password, role, created_at 
            FROM users 
            WHERE username = p_username;
        END
    `);

    // 5. Crear usuario 'pepe' con la contraseña encriptada correctamente
    const password = '12345';
    const hash = await bcrypt.hash(password, 10);
    
    await conn.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['pepe', hash, 'productor']
    );

    console.log('✅ ¡Base de datos reiniciada con éxito!');
    console.log('👤 Usuario creado: pepe / 12345');
    
    await conn.end();
}

resetDatabase().catch(err => {
    console.error('❌ Error al reiniciar:', err.message);
});
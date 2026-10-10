# 🎮 Agregación en TypeScript — Personaje RPG

Proyecto de práctica para **Ingeniería de Software II** que demuestra el concepto de **AGREGACIÓN** en Programación Orientada a Objetos, aplicado a un pequeño RPG con visualización gráfica en HTML5 Canvas.

---

## 📚 ¿Qué es la agregación?

La **agregación** es una relación entre objetos del tipo **"tiene un"** (relación débil), donde:

- Un objeto **contiene** a otro, pero **ambos pueden existir por separado**.
- Si el contenedor desaparece, las partes **siguen existiendo**.
- Las partes pueden **compartirse** entre varios contenedores.
- Se puede **cambiar** la parte en tiempo de ejecución.

### Diferencia con la composición

| | **Agregación** ◇ | **Composición** ◆ |
|---|---|---|
| Relación | "tiene un" (débil) | "es parte de" (fuerte) |
| Ciclo de vida | Independientes | Dependientes |
| Ejemplo | Personaje **tiene** un Arma | Casa **tiene** Habitaciones |
| En UML | Rombo **vacío** | Rombo **lleno** |

---

## 🎯 ¿Por qué este proyecto es agregación y no composición?

En el código se cumple TODO esto:

1. **Las armas y habilidades se crean FUERA del personaje:**

   ```typescript
   const espada = new Arma("Espada de Fuego", 30, "#ef4444");
   const guerrero = new Personaje("Guerrero", 100, espada, curacion);
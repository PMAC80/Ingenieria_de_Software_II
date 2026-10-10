"use strict";
// ============================================
// ARMA
// ============================================
class Arma {
    constructor(nombre, danio, color) {
        this.nombre = nombre;
        this.danio = danio;
        this.color = color;
    }
    atacar() {
        return `⚔️ Ataque con ${this.nombre}: ${this.danio} de daño`;
    }
    getNombre() { return this.nombre; }
    getColor() { return this.color; }
}
// ============================================
// HABILIDAD
// ============================================
class Habilidad {
    constructor(nombre, poder, color) {
        this.nombre = nombre;
        this.poder = poder;
        this.color = color;
    }
    usar() {
        return `✨ ${this.nombre} invocada: ${this.poder} de poder`;
    }
    getNombre() { return this.nombre; }
    getColor() { return this.color; }
}
// ============================================
// PERSONAJE (AGREGADOR)
// ============================================
class Personaje {
    constructor(nombre, vida, arma, habilidad) {
        this.nombre = nombre;
        this.vida = vida;
        this.arma = arma;
        this.habilidad = habilidad;
    }
    atacar() {
        return `${this.nombre} ataca → ${this.arma.atacar()}`;
    }
    usarHabilidad() {
        return `${this.nombre} usa → ${this.habilidad.usar()}`;
    }
    cambiarArma(nuevaArma) {
        this.arma = nuevaArma;
        return `🔄 ${this.nombre} cambió a ${nuevaArma.getNombre()}`;
    }
    cambiarHabilidad(nuevaHabilidad) {
        this.habilidad = nuevaHabilidad;
        return `🔄 ${this.nombre} cambió a ${nuevaHabilidad.getNombre()}`;
    }
    recibirDanio(danio) {
        this.vida -= danio;
        return `💥 ${this.nombre} recibió ${danio} de daño. Vida: ${this.vida}`;
    }
    dibujar(ctx, x, y) {
        // Cuerpo
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        // Ojos
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(x - 12, y - 10, 5, 0, Math.PI * 2);
        ctx.arc(x + 12, y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        // Sonrisa
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y + 8, 14, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        // Barra de vida
        ctx.fillStyle = "#334155";
        ctx.fillRect(x - 50, y - 75, 100, 12);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(x - 50, y - 75, Math.max(0, this.vida), 12);
        // Arma (color)
        ctx.fillStyle = this.arma.getColor();
        ctx.fillRect(x + 40, y - 8, 60, 16);
        ctx.fillStyle = "#fff";
        ctx.font = "13px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(this.arma.getNombre(), x + 70, y + 30);
        // Habilidad (aura)
        ctx.strokeStyle = this.habilidad.getColor();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillText(this.habilidad.getNombre(), x, y + 75);
        // Nombre
        ctx.font = "bold 18px system-ui";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(this.nombre, x, y - 90);
    }
}
// ============================================
// OBJETOS (creados FUERA del personaje → agregación)
// ============================================
const espada = new Arma("Espada de Fuego", 30, "#ef4444");
const arco = new Arma("Arco Mágico", 20, "#22c55e");
const baston = new Arma("Bastón Arcano", 35, "#a855f7");
const curacion = new Habilidad("Curación", 25, "#22c55e");
const escudo = new Habilidad("Escudo Mágico", 15, "#3b82f6");
const fuego = new Habilidad("Bola de Fuego", 40, "#f97316");
const guerrero = new Personaje("Guerrero", 100, espada, curacion);
const arquero = new Personaje("Arquero", 80, arco, escudo);
const armas = [espada, arco, baston];
const habilidades = [curacion, escudo, fuego];
let idxArma = 0;
let idxHab = 0;
// ============================================
// UI + CANVAS
// ============================================
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const log = document.getElementById("log");
function logMsg(msg) {
    log.innerHTML = `<div>${msg}</div>` + log.innerHTML;
    log.innerHTML = log.innerHTML.split("</div>").slice(0, 9).join("</div>");
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    guerrero.dibujar(ctx, 200, 220);
    arquero.dibujar(ctx, 500, 220);
}
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        const accion = btn.dataset.accion;
        switch (accion) {
            case "cambiarArma":
                idxArma = (idxArma + 1) % armas.length;
                logMsg(guerrero.cambiarArma(armas[idxArma]));
                break;
            case "cambiarHabilidad":
                idxHab = (idxHab + 1) % habilidades.length;
                logMsg(guerrero.cambiarHabilidad(habilidades[idxHab]));
                break;
            case "atacar":
                logMsg(guerrero.atacar());
                break;
            case "usarHabilidad":
                logMsg(guerrero.usarHabilidad());
                break;
            case "recibirDanio":
                logMsg(guerrero.recibirDanio(15));
                break;
        }
        render();
    });
});
render();
logMsg("✅ Personajes creados con AGREGACIÓN. ¡Presiona los botones!");

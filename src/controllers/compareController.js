// src/controllers/compareController.js
import groq from '../config/groq.js';
import { extraerTextoDeBuffer } from '../services/textExtractor.js';

const promptInstruccionesBase = `Actúa como un sistema analítico de fact-checking. Te proporcionaré dos textos sobre un mismo tema tecnológico. Tu objetivo exclusivo es detectar contradicciones, discrepancias numéricas o de afirmaciones clave de manera objetiva.\r\n    \r\nEstructura tu respuesta estrictamente en español usando viñetas limpias:\r\n- Comienza con un mini-resumen de 1 línea sobre el conflicto general.\r\n- Usa viñetas que inicien con un guion corto (-) para cada discrepancia encontrada. Pon títulos cortos en negrita usando asteriscos dobles.`;

// 1. Controlador para comparar ARCHIVOS (Ya lo tienes hecho)
export async function compararArchivosController(req, res) {
    try {
        if (!req.files) return res.status(400).json({ error: "No se recibió ningún archivo." });
        if (!req.files['fileA'] || !req.files['fileB']) return res.status(400).json({ error: "Faltan documentos fuente." });

        const textA = await extraerTextoDeBuffer(req.files['fileA'][0]);
        const textB = await extraerTextoDeBuffer(req.files['fileB'][0]);

        const contenidoPrompt = `${promptInstruccionesBase}\n\nTEXTO FUENTE A:\n"${textA}"\n\nTEXTO FUENTE B:\n"${textB}"`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: contenidoPrompt }],
            model: "llama-3.1-8b-instant",
            temperature: 0.2
        });

        return res.json(completion);
    } catch (error) {
        console.error("Error en /api/compare-files:", error);
        return res.status(500).json({ error: "Error interno procesando tus documentos.", details: error.message });
    }
}

// 2. NUEVO: Controlador para comparar TEXTO PLANO
export async function compararTextoPlanoController(req, res) {
    try {
        const clientMessages = req.body.messages;
        // El frontend ya manda el prompt armado con el texto A y B dentro de messages[0].content
        const promptTexto = (clientMessages && clientMessages[0]) ? clientMessages[0].content : '';

        if (!promptTexto) {
            return res.status(400).json({ error: "El contenido del mensaje no puede estar vacío." });
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: promptTexto }],
            model: "llama-3.1-8b-instant",
            temperature: 0.2
        });

        return res.json(completion);
    } catch (error) {
        console.error("Error en /api/chat:", error);
        return res.status(500).json({ error: "Error interno procesando el texto.", details: error.message });
    }
}
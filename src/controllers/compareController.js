// src/controllers/compareController.js
import groq from '../config/groq.js';
import { extraerTextoDeBuffer } from '../services/textExtractor.js';

const promptInstruccionesBase = `Actúa como un sistema analítico de fact-checking. Te proporcionaré dos textos sobre un mismo tema tecnológico. Tu objetivo exclusivo es detectar contradicciones, discrepancias numéricas o de afirmaciones clave de manera objetiva.\r\n    \r\nEstructura tu respuesta estrictamente en español usando viñetas limpias:\r\n- Comienza con un mini-resumen de 1 línea sobre el conflicto general.\r\n- Usa viñetas que inicien con un guion corto (-) para cada discrepancia encontrada. Pon títulos cortos en negrita usando asteriscos dobles.`;

export async function compararArchivosController(req, res) {
    try {
        if (!req.files) return res.status(400).json({ error: "No se recibió ningún archivo." });
        const fileAObject = req.files['fileA'] ? req.files['fileA'][0] : null;
        const fileBObject = req.files['fileB'] ? req.files['fileB'][0] : null;

        if (!fileAObject || !fileBObject) return res.status(400).json({ error: "Faltan documentos fuente." });

        console.log(`📄 Procesando Archivo A: ${fileAObject.originalname}`);
        let textA = await extraerTextoDeBuffer(fileAObject);
        
        console.log(`📄 Procesando Archivo B: ${fileBObject.originalname}`);
        let textB = await extraerTextoDeBuffer(fileBObject);

        if (!textA.trim() || !textB.trim()) {
            return res.status(400).json({ error: "Uno o ambos archivos no contienen texto legible." });
        }

        // Truncado de seguridad balanceado para la API de Groq
        if (textA.length > 5000) textA = textA.substring(0, 5000);
        if (textB.length > 5000) textB = textB.substring(0, 5000);

        const contenidoPrompt = `${promptInstruccionesBase}\n\nTEXTO FUENTE A:\n"${textA}"\n\nTEXTO FUENTE B:\n"${textB}"`;

        console.log("🤖 Enviando solicitud optimizada a Groq...");
        
        // Usamos el modelo activo ultra-rápido de Groq
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: contenidoPrompt }],
            model: "llama-3.1-8b-instant", 
            temperature: 0.1,
            max_tokens: 1000
        });

        console.log("✅ Respuesta recibida con éxito de Groq.");
        return res.json(completion);

    } catch (error) {
        console.log("\n💥 ====== ERROR DETECTADO EN EL SERVIDOR ====== ");
        console.error(error);
        console.log("===============================================\n");
        
        return res.status(500).json({ 
            error: "Error de comunicación con el motor de IA.", 
            details: error.message 
        });
    }
}

// El controlador de texto plano se queda exactamente igual abajo...

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
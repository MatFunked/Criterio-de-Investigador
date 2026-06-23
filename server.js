import 'dotenv/config';
import express from 'express';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
// Inicializar Groq de manera segura en el servidor
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
app.use(express.json());
// Servir automáticamente tus carpetas de frontend de imagen_44ca28.png
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
// Servir archivos raíz
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/povs.txt', (req, res) => res.sendFile(path.join(__dirname, 'povs.txt')));
// Endpoint seguro para las peticiones de IA
// Endpoint seguro para las peticiones de IA
app.post('/api/chat', async (req, res) => {
    try {
        // 1. Extraemos de forma segura el contenido del prompt enviado por el cliente
        const clientMessages = req.body.messages;
        const promptTexto = (clientMessages && clientMessages[0]) ? clientMessages[0].content : '';

        // 2. Si por alguna razón viene vacío, respondemos un error controlado antes de llamar a Groq
        if (!promptTexto) {
            return res.status(400).json({ error: "El contenido del mensaje no puede estar vacío." });
        }

        // 3. Creamos la petición garantizando la lista de mapeos (roles y contenidos) que Groq exige
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: promptTexto
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.2
        });

        res.json(completion);
    } catch (error) {
        console.error("Error detallado en el servidor intermedio:", error);
        res.status(500).json({ 
            error: "Error interno del servidor al procesar la solicitud con Groq.",
            details: error.message 
        });
    }
});
app.listen(port, () => console.log(`Servidor activo en puerto ${port}`));
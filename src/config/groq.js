import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

// Forzamos la desactivación de la compresión Gzip en los headers 
// para evitar el error ERR_STREAM_PREMATURE_CLOSE
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    defaultHeaders: {
        'Accept-Encoding': 'identity' // Esto le dice a la API: "No me comprimas la respuesta"
    }
});

export default groq;
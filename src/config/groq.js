import dotenv from 'dotenv';
// Forzamos la carga de las variables antes de inicializar la SDK
dotenv.config();

import Groq from 'groq-sdk';

// Inicializamos Groq leyendo la variable cargada
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default groq;
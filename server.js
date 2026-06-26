// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'; 
import cors from 'cors'; 

// Importamos ambos controladores desde el archivo modular
import { 
    compararArchivosController, 
    compararTextoPlanoController 
} from './src/controllers/compareController.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json()); // Crucial para que lea el JSON del texto plano

const upload = multer({ storage: multer.memoryStorage() });

// Archivos Estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Ruta principal
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Endpoint para Documentos (.pdf, .txt, .docx)
app.post(
    '/api/compare-files', 
    upload.fields([{ name: 'fileA', maxCount: 1 }, { name: 'fileB', maxCount: 1 }]), 
    compararArchivosController
);

// Endpoint para Texto Plano (Restaurado y Modularizado)
app.post('/api/chat', compararTextoPlanoController);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
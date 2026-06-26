import { PdfReader } from 'pdfreader';
import mammoth from 'mammoth';

// Función auxiliar para leer secuencialmente el PDF usando promesas nativas
function procesarPdfAsincrono(buffer) {
    return new Promise((resolve, reject) => {
        let textoCompleto = '';
        
        new PdfReader().parseBuffer(buffer, (err, item) => {
            if (err) {
                reject(err);
            } else if (!item) {
                // Al no haber más ítems, el archivo terminó de procesarse completamente
                resolve(textoCompleto.trim());
            } else if (item.text) {
                // Acumulamos las cadenas de texto separándolas por espacios planos
                textoCompleto += item.text + ' ';
            }
        });
    });
}

export async function extraerTextoDeBuffer(fileObject) {
    const mimeType = fileObject.mimetype;
    const buffer = fileObject.buffer;

    if (mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    } 
    else if (mimeType === 'application/pdf') {
        try {
            console.log("⚡ Extrayendo texto usando pdfreader...");
            const textoExtraido = await procesarPdfAsincrono(buffer);
            return textoExtraido;
        } catch (pdfError) {
            console.error("Error específico de pdfreader:", pdfError);
            throw new Error(`Error al procesar el PDF: ${pdfError.message}`);
        }
    } 
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value; 
    } 
    else {
        throw new Error(`Formato de archivo no soportado: ${mimeType}`);
    }
}
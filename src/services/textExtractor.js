import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extraerTextoDeBuffer(fileObject) {
    const mimeType = fileObject.mimetype;
    const buffer = fileObject.buffer;

    if (mimeType === 'text/plain') {
        return buffer.toString('utf-8');
    } 
    else if (mimeType === 'application/pdf') {
        if (typeof pdfParse === 'function') {
            const data = await pdfParse(buffer);
            return data.text;
        } else if (pdfParse && typeof pdfParse.default === 'function') {
            const data = await pdfParse.default(buffer);
            return data.text;
        } else {
            throw new Error("La librería pdf-parse no se importó correctamente en el servicio.");
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
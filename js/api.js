export async function enviarAAPI(txtA, txtB) {
    const URL_ENDPOINT = "/api/chat";

    const promptInstrucciones = `Actúa como un sistema analítico de fact-checking. Te proporcionaré dos textos sobre un mismo tema tecnológico. Tu objetivo exclusivo es detectar contradicciones, discrepancias numéricas o de afirmaciones clave de manera objetiva.
    
    Estructura tu respuesta estrictamente en español usando viñetas limpias:
    - Comienza con un mini-resumen de 1 línea sobre el conflicto general.
    - Usa viñetas que inicien con un guion corto (-) para cada discrepancia encontrada. Pon títulos cortos en negrita usando asteriscos dobles.`;

    const contenidoPrompt = `${promptInstrucciones}\n\nTEXTO FUENTE A:\n"${txtA}"\n\nTEXTO FUENTE B:\n"${txtB}"`;

    const response = await fetch(URL_ENDPOINT, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            messages: [{ role: "user", content: contenidoPrompt }]
        })
    });

    if (!response.ok) {
        throw new Error(`Error en el servidor intermedio: ${response.status}`);
    }

    return await response.json();
}
// Aseguramos que tengan la extensión .js explícita para el navegador nativo
import { enviarAAPI } from './api.js';
import { formatearRespuestaIA } from './utils.js';
import { switchTab, setVisualLoading } from './ui.js';

// Escuchar los clicks en los botones de cambio de pestañas
document.getElementById('btn-tab-comparador').addEventListener('click', () => switchTab('comparador'));
document.getElementById('btn-tab-investigacion').addEventListener('click', () => switchTab('investigacion'));

// Lógica principal al hacer click en el botón de Comparar
document.getElementById('btn-analizar').addEventListener('click', async () => {
    const txtA = document.getElementById('fuenteA').value.trim();
    const txtB = document.getElementById('fuenteB').value.trim();
    const resultDiv = document.getElementById('result');

    if (!txtA || !txtB) {
        alert("Por favor, introduce información en ambas fuentes antes de proceder.");
        return;
    }

    setVisualLoading(true);

    try {
        const data = await enviarAAPI(txtA, txtB);
        
        if (data.choices && data.choices[0].message && data.choices[0].message.content) {
            const textoCrudo = data.choices[0].message.content;
            
            // Usamos nuestro formateador modular de utils.js
            const contenidoFormateado = formatearRespuestaIA(textoCrudo);

            resultDiv.innerHTML = `
                <div style="line-height: 1.6; color: #1e293b;">
                    <h3 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; font-size: 1.2rem;">
                        Reporte Técnico de Inconsistencias:
                    </h3>
                    <div style="font-size: 0.95rem;">${contenidoFormateado}</div>
                </div>
            `;
            resultDiv.style.display = "block";
        } else {
            throw new Error("El formato de respuesta de la API no es el esperado.");
        }
    } catch (error) {
        console.error("Error en flujo modular:", error);
        alert("Error al procesar: " + error.message);
    } finally {
        setVisualLoading(false);
    }
});
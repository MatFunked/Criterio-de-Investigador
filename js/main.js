// js/main.js
import { enviarAAPI, enviarArchivosAAPI } from './api.js';
import { formatearRespuestaIA } from './utils.js';
import { switchTab, setVisualLoading } from './ui.js';

// Inicializar estado local de la pestaña activa
let currentTab = 'docs';

// Listeners de navegación de pestañas
document.getElementById('btn-tab-docs').addEventListener('click', () => { currentTab = 'docs'; switchTab('docs'); });
document.getElementById('btn-tab-texto').addEventListener('click', () => { currentTab = 'texto'; switchTab('texto'); });
document.getElementById('btn-tab-investigacion').addEventListener('click', () => { currentTab = 'investigacion'; switchTab('investigacion'); });

// --- LÓGICA DE INDICADORES VISUALES Y ARRASTRE DE ARCHIVOS ---
function configurarZonaArchivo(inputId, placeholderClass) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput) return;
    
    const dropZone = fileInput.closest('.file-drop-zone');
    if (!dropZone) return;

    // Buscamos el placeholder de forma segura dentro de toda la zona de arrastre
    const placeholder = dropZone.querySelector('.' + placeholderClass);
    if (!placeholder) return;

    function marcarComoCargado(nombreArchivo) {
        placeholder.innerHTML = `📄 <strong>${nombreArchivo}</strong> <span style="color: #16a34a; margin-left: 8px;">✓ Listo</span>`;
        dropZone.style.borderColor = "#22c55e"; 
        dropZone.style.backgroundColor = "#f0fdf4"; 
    }

    function restaurarEstadoInicial() {
        placeholder.textContent = inputId === 'fileA' ? "Seleccionar o arrastrar archivo A" : "Seleccionar o arrastrar archivo B";
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.backgroundColor = "#f8fafc";
    }

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            marcarComoCargado(fileInput.files[0].name);
        }
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            if (fileInput.files.length === 0) {
                dropZone.style.borderColor = "var(--primary-color)";
                dropZone.style.backgroundColor = "#eff6ff";
            }
        }, false);
    });

    ['dragleave'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            if (fileInput.files.length === 0) {
                restaurarEstadoInicial();
            } else {
                marcarComoCargado(fileInput.files[0].name);
            }
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files;
            marcarComoCargado(files[0].name);
        }
    });
}

// Inicializamos los comportamientos visuales
configurarZonaArchivo('fileA', 'file-custom-placeholder');
configurarZonaArchivo('fileB', 'file-custom-placeholder');

// --- LÓGICA PRINCIPAL DE ENVÍO ---
document.getElementById('btn-analizar').addEventListener('click', async () => {
    const resultDiv = document.getElementById('result');
    let data;

    try {
        setVisualLoading(true);
        let data;

        if (currentTab === 'texto') {
            const txtA = document.getElementById('fuenteA').value.trim();
            const txtB = document.getElementById('fuenteB').value.trim();

            if (!txtA || !txtB) {
                alert("Por favor, introduce información en ambas fuentes de texto antes de proceder.");
                setVisualLoading(false);
                return;
            }
            data = await enviarAAPI(txtA, txtB);

        } else if (currentTab === 'docs') {
            // Capturar los archivos reales de los inputs tipo file
            const fileA = document.getElementById('fileA').files[0];
            const fileB = document.getElementById('fileB').files[0];

            if (!fileA || !fileB) {
                alert("Por favor, selecciona ambos documentos (.txt, .pdf o .docx) antes de proceder.");
                setVisualLoading(false);
                return;
            }
            // Llamamos a la función modularizada que ya tenías en api.js
            data = await enviarArchivosAAPI(fileA, fileB);
        }

        // El procesamiento del JSON de Groq se mantiene igual e intacto abajo
        if (data && data.choices && data.choices[0].message && data.choices[0].message.content) {
            const textoCrudo = data.choices[0].message.content;
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
        console.error(error);
        alert("Ocurrió un error al procesar la solicitud: " + error.message);
    } finally {
        setVisualLoading(false);
    }
});
// js/ui.js
export function switchTab(tabName) {
    const tabDocs = document.getElementById('tab-docs');
    const tabTexto = document.getElementById('tab-texto');
    const tabInvestigacion = document.getElementById('tab-investigacion');
    
    const btnDocs = document.getElementById('btn-tab-docs');
    const btnTexto = document.getElementById('btn-tab-texto');
    const btnInvestigacion = document.getElementById('btn-tab-investigacion');
    const resultDiv = document.getElementById('result');

    // Ocultar todos los bloques primero
    if(tabDocs) tabDocs.style.display = 'none';
    if(tabTexto) tabTexto.style.display = 'none';
    if(tabInvestigacion) tabInvestigacion.style.display = 'none';

    // Quitar clases activas
    if(btnDocs) btnDocs.classList.remove('active');
    if(btnTexto) btnTexto.classList.remove('active');
    if(btnInvestigacion) btnInvestigacion.classList.remove('active');

    // Mostrar la pestaña seleccionada
    if (tabName === 'docs') {
        if(tabDocs) tabDocs.style.display = 'block';
        if(btnDocs) btnDocs.classList.add('active');
    } else if (tabName === 'texto') {
        if(tabTexto) tabTexto.style.display = 'block';
        if(btnTexto) btnTexto.classList.add('active');
    } else {
        if(tabInvestigacion) tabInvestigacion.style.display = 'block';
        if(btnInvestigacion) btnInvestigacion.classList.add('active');
    }
    
    if (resultDiv) resultDiv.style.display = "none";
}

export function setVisualLoading(isLoading) {
    const btn = document.getElementById('btn-analizar');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (isLoading) {
        if(btn) btn.disabled = true;
        if(loading) loading.style.display = "block";
        if(resultDiv) resultDiv.style.display = "none";
    } else {
        if(btn) btn.disabled = false;
        if(loading) loading.style.display = "none";
    }
}
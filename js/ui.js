export function switchTab(tabName) {
    const tabComparador = document.getElementById('tab-comparador');
    const tabInvestigacion = document.getElementById('tab-investigacion');
    const btnComparador = document.getElementById('btn-tab-comparador');
    const btnInvestigacion = document.getElementById('btn-tab-investigacion');
    const resultDiv = document.getElementById('result');

    if (tabName === 'comparador') {
        tabComparador.style.display = 'block';
        tabInvestigacion.style.display = 'none';
        btnComparador.classList.add('active');
        btnInvestigacion.classList.remove('active');
    } else {
        tabComparador.style.display = 'none';
        tabInvestigacion.style.display = 'block';
        btnComparador.classList.remove('active');
        btnInvestigacion.classList.add('active');
    }
    
    // Limpiar el cuadro de respuestas anterior al cambiar de módulo
    if (resultDiv) resultDiv.style.display = "none";
}

export function setVisualLoading(isLoading) {
    const btn = document.getElementById('btn-analizar');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    if (isLoading) {
        btn.disabled = true;
        loading.style.display = "block";
        resultDiv.style.display = "none";
    } else {
        btn.disabled = false;
        loading.style.display = "none";
    }
}
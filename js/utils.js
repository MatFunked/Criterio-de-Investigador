export function formatearRespuestaIA(textoMarkdown) {
    if (!textoMarkdown) return '';

    let html = textoMarkdown;

    // 1. Escapar caracteres HTML nativos por seguridad
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 2. Formatear Negritas (**texto**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Formatear Listas con Viñetas (guiones, asteriscos, sumas con espacios opcionales al inicio)
    html = html.replace(
        /^\s*[+\-*]\s*(.*)$/gm,
        '<div style="margin-bottom: 8px; padding-left: 4px;"><span style="color:#2563eb; font-weight:bold; margin-right:8px;">&gt;</span> $1</div>'
    );

    // 4. Formatear Listas Numeradas (por si la IA responde con "1. ", "2. ", etc.)
    html = html.replace(
        /^\s*(\d+)\.\s*(.*)$/gm,
        '<div style="margin-bottom: 8px; padding-left: 4px;"><span style="color:#2563eb; font-weight:bold; margin-right:8px;">$1.</span> $2</div>'
    );

    // 5. Convertir los saltos de línea restantes a <br>
    html = html.replace(/\n/g, '<br>');

    return html;
}
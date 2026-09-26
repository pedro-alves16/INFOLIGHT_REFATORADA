export async function renderComponent(containerId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o componente: ${componentPath}`);
    }
    const html = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }
  } catch (error) {
    console.error("Erro na renderização do componente:", error);
  }
}

// Executa a injeção dos componentes na inicialização do script
document.addEventListener("DOMContentLoaded", () => {
  renderComponent("header-container", "/html/components/header.html");
  renderComponent("sidebar-container", "/html/components/sidebar.html");
});
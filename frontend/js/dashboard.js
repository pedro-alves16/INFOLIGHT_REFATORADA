import { renderComponent } from "./componentRender.js";
const ctx = document.getElementById("meuGrafico");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    datasets: [
      {
        label: "Conta de Luz (R$)",
        data: [120, 150, 130, 170, 160],
        backgroundColor: "#5db79a",
        borderRadius: 0,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#5a6d66",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grace: "10%",
        grid: {
          color: "rgba(94, 118, 108, 0.14)",
          drawBorder: false,
        },
        ticks: {
          color: "#5a6d66",
          font: {
            size: 12,
          },
        },
      },
    },
  },
});




let cashFlowChart = null;

// We accept transactions as a parameter directly from main.js
export function updateChart(currentTransactions) {
    const canvas = document.getElementById('cashFlowChart');
    if (!canvas) return; 

    const ctx = canvas.getContext('2d');
    
    
    let totalIncome = 0;
    let totalExpense = 0;

    if (currentTransactions && currentTransactions.length > 0) {
        currentTransactions.forEach(t => {
            if (t.type === "Income") totalIncome += t.amount;
            if (t.type === "Expense") totalExpense += t.amount;
        });
    }

    // Determine typography text color based on active theme class list
    const isLightTheme = document.body.classList.contains("light-theme");
    const gridColor = isLightTheme ? "#E5E7EB" : "#222936";
    const labelColor = isLightTheme ? "#4B5563" : "#9CA3AF";

   
    if (cashFlowChart) {
        cashFlowChart.destroy();
    }

   
    cashFlowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income vs Expenses'],
            datasets: [
                {
                    label: 'Income',
                    data: [totalIncome],
                    backgroundColor: 'rgba(16, 185, 129, 0.65)', 
                    borderColor: '#10B981',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.4,
                    categoryPercentage: 0.6
                },
                {
                    label: 'Expenses',
                    data: [totalExpense],
                    backgroundColor: 'rgba(239, 68, 68, 0.65)', 
                    borderColor: '#EF4444',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.4,
                    categoryPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',    
                    labels: {
                        color: labelColor,
                        font: { family: 'Inter', size: 13 }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#111827', 
                    titleColor: '#FFFFFF',
                    titleFont: { weight: 'bold', family: 'Inter' },
                    bodyColor: '#FFFFFF',
                    bodyFont: { family: 'Inter' },
                    borderColor: '#374151',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    boxWidth: 10,
                    boxHeight: 10,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.raw !== null) {
                                label += Number(context.raw).toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: labelColor, font: { family: 'Inter' } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: gridColor },
                    ticks: {
                        color: labelColor,
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return value.toLocaleString(); 
                        }
                    }
                }
            }
        }
    });
}
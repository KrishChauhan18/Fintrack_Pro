import { updateChart } from "./chart.js";

// ==========================================
// DOM SELECTORS
// ==========================================
const addBtn = document.querySelector("#add_trans button"); 
const modal = document.querySelector("#transactionModal");
const closeBtn = document.querySelector("#closeModal");
const form = document.querySelector("#transactionForm");
const themeCheckbox = document.querySelector("#themeToggleCheckbox");
const tableBody = document.querySelector("#transactionsTableBody");
const resetBtn = document.querySelector("#resetDataBtn");

const searchInput = document.querySelector("#searchInput");
const filterSelect = document.querySelector("#filterSelect");

const balanceDisplay = document.querySelector("#first-h");
const incomeDisplay = document.querySelector("#second-h");
const expenseDisplay = document.querySelector("#third-h");
const countDisplay = document.querySelector("#fourth-h");


let transactions = JSON.parse(localStorage.getItem("fintrack_data")) || [];


themeCheckbox.addEventListener("change", () => {
    const isLightMode = !themeCheckbox.checked;
    document.body.classList.toggle("light-theme", isLightMode);
    localStorage.setItem("fintrack_theme", isLightMode ? "light" : "dark");
    updateChart(transactions); // <-- Pass state here
});

function initTheme() {
    const savedTheme = localStorage.getItem("fintrack_theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeCheckbox.checked = false;
    } else {
        document.body.classList.remove("light-theme");
        themeCheckbox.checked = true;
    }
}

addBtn.addEventListener("click", () => modal.classList.add("active"));
closeBtn.addEventListener("click", () => modal.classList.remove("active"));

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
});


function updateDashboardMetrics() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "Income") totalIncome += t.amount;
        if (t.type === "Expense") totalExpense += t.amount;
    });

    const currentBalance = totalIncome - totalExpense;

    balanceDisplay.textContent = `$${currentBalance.toFixed(2)}`;
    incomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
    countDisplay.textContent = transactions.length;
}

function renderTableRows(filteredData = transactions) {
    tableBody.innerHTML = "";
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#9CA3AF;">No transactions found.</td></tr>`;
        return;
    }

    filteredData.forEach((t) => {
        const row = document.createElement("tr");
        const amtClass = t.type === "Income" ? "income-amt" : "expense-amt";
        const amtPrefix = t.type === "Income" ? "+" : "-";

        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td class="${amtClass}">${amtPrefix}$${t.amount.toFixed(2)}</td>
            <td>
                <button class="delete-btn" data-id="${t.id}">
                    <i class="ri-delete-bin-fill"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        description: document.querySelector("#description").value.trim(),
        amount: parseFloat(document.querySelector("#amount").value),
        category: document.querySelector("#category").value.trim(),
        type: document.querySelector("#type").value
    };

    transactions.unshift(newTransaction);
    localStorage.setItem("fintrack_data", JSON.stringify(transactions));

    form.reset();
    modal.classList.remove("active"); 
    applyFilters();
    updateDashboardMetrics();
    updateChart(transactions); // <-- Pass state here
});

// Delete Record Handling Logic
tableBody.addEventListener("click", (e) => {
    const targetBtn = e.target.closest(".delete-btn");
    if (!targetBtn) return;
    
    const recordId = targetBtn.dataset.id;
    transactions = transactions.filter(t => t.id !== recordId);
    localStorage.setItem("fintrack_data", JSON.stringify(transactions));
    
    applyFilters();
    updateDashboardMetrics();
    updateChart(transactions); // <-- Pass state here
});


function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = filterSelect.value;

    const filtered = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm) || 
                              t.category.toLowerCase().includes(searchTerm);
        const matchesType = (selectedType === "All") || (t.type === selectedType);
        
        return matchesSearch && matchesType;
    });

    renderTableRows(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

// Master Reset Wiping Hook
resetBtn.addEventListener("click", () => {
    if (confirm("Are you absolute certain you wish to wipe clean all financial data logs?")) {
        transactions = [];
        localStorage.removeItem("fintrack_data");
        applyFilters();
        updateDashboardMetrics();
        updateChart(transactions); // <-- Pass state here
    }
});


initTheme();
updateDashboardMetrics();
renderTableRows();
updateChart(transactions); 
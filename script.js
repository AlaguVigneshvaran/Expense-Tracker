
/* =========================================================
   BUDGET MANAGEMENT
   ========================================================= */

const addBudgetBtn = document.getElementById("addBudgetBtn");
const budgetList = document.getElementById("budgetList");


// Add Budget
if (addBudgetBtn) {

    addBudgetBtn.addEventListener("click", function () {

        const categoryName = prompt(
            "Enter budget category:\nExample: Food, Shopping, Transport"
        );

        if (!categoryName || !categoryName.trim()) {
            return;
        }

        const amount = Number(
            prompt("Enter monthly budget amount:")
        );

        if (!amount || amount <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        const newBudget = {

            id: Date.now(),

            category: categoryName.trim(),

            amount: amount,

            spent: 0

        };

        budgets.push(newBudget);

        saveData();

        displayBudgets();

        updateBudgetOverview();

        alert("Budget added successfully!");

    });

}


// Display Budgets
function displayBudgets() {

    if (!budgetList) return;


    if (budgets.length === 0) {

        budgetList.innerHTML = `
            <p class="empty-state">
                No budgets added yet.
            </p>
        `;

        return;
    }


    budgetList.innerHTML = budgets.map(budget => {

        const spent = calculateCategoryExpense(
            budget.category
        );

        const percentage =
            budget.amount > 0
                ? Math.min((spent / budget.amount) * 100, 100)
                : 0;

        const remaining =
            budget.amount - spent;


        return `

            <div class="budget-item">

                <div class="budget-info">

                    <span>
                        ${escapeHTML(budget.category)}
                    </span>

                    <span>
                        ${formatCurrency(spent)}
                        /
                        ${formatCurrency(budget.amount)}
                    </span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress"
                        style="width: ${percentage}%;">
                    </div>

                </div>


                <div class="budget-info">

                    <span>
                        ${remaining >= 0
                            ? "Remaining"
                            : "Over Budget"}
                    </span>

                    <span>
                        ${formatCurrency(
                            Math.abs(remaining)
                        )}
                    </span>

                </div>


                <button
                    class="danger-btn"
                    onclick="deleteBudget(${budget.id})">
                    Delete
                </button>

            </div>

        `;

    }).join("");

}


// Calculate category expenses
function calculateCategoryExpense(categoryName) {

    return transactions
        .filter(transaction =>
            transaction.type === "expense" &&
            transaction.category.toLowerCase() ===
            categoryName.toLowerCase()
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

}


// Delete Budget
function deleteBudget(id) {

    if (!confirm("Delete this budget?")) {
        return;
    }

    budgets = budgets.filter(
        budget => budget.id !== id
    );

    saveData();

    displayBudgets();

    updateBudgetOverview();

}


// Budget Overview
function updateBudgetOverview() {

    const totalBudget =
        budgets.reduce(
            (total, budget) =>
                total + Number(budget.amount),
            0
        );


    const totalSpent =
        budgets.reduce(
            (total, budget) =>
                total +
                calculateCategoryExpense(
                    budget.category
                ),
            0
        );


    const remaining =
        totalBudget - totalSpent;


    const totalBudgetElement =
        document.getElementById("totalBudget");

    const budgetSpentElement =
        document.getElementById("budgetSpent");

    const budgetRemainingElement =
        document.getElementById("budgetRemaining");


    if (totalBudgetElement) {

        totalBudgetElement.textContent =
            formatCurrency(totalBudget);

    }


    if (budgetSpentElement) {

        budgetSpentElement.textContent =
            formatCurrency(totalSpent);

    }


    if (budgetRemainingElement) {

        budgetRemainingElement.textContent =
            formatCurrency(remaining);

    }

}


/* =========================================================
   SAVINGS GOAL MANAGEMENT
   ========================================================= */

const addGoalBtn =
    document.getElementById("addGoalBtn");


if (addGoalBtn) {

    addGoalBtn.addEventListener("click", function () {

        const goalName =
            prompt(
                "Enter your savings goal:\nExample: New Laptop"
            );


        if (!goalName || !goalName.trim()) {
            return;
        }


        const target =
            Number(
                prompt(
                    "Enter your savings target amount:"
                )
            );


        if (!target || target <= 0) {

            alert(
                "Please enter a valid target amount."
            );

            return;
        }


        const saved =
            Number(
                prompt(
                    "How much have you already saved?"
                )
            ) || 0;


        if (saved < 0) {

            alert(
                "Saved amount cannot be negative."
            );

            return;
        }


        savingsGoal = {

            name: goalName.trim(),

            target: target,

            saved: Math.min(saved, target)

        };


        saveData();

        updateSavings();

        alert(
            "Savings goal added successfully!"
        );

    });

}







/* =========================================================
   EXPENSE TRACKER - APP.JS
   ========================================================= */


/* =========================
   1. GLOBAL DATA
   ========================= */

let transactions = JSON.parse(
    localStorage.getItem("expenseTrackerTransactions")
) || [];

let budgets = JSON.parse(
    localStorage.getItem("expenseTrackerBudgets")
) || [];

let savingsGoal = JSON.parse(
    localStorage.getItem("expenseTrackerSavingsGoal")
) || {
    name: "Emergency Fund",
    target: 100000,
    saved: 35000
};


/* =========================
   2. DOM ELEMENTS
   ========================= */

const transactionModal = document.getElementById("transactionModal");
const transactionForm = document.getElementById("transactionForm");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const closeModal = document.getElementById("closeModal");

const transactionType = document.getElementById("transactionType");
const category = document.getElementById("category");

const transactionList = document.getElementById("transactionList");
const recentTransactions = document.getElementById("recentTransactions");

const searchTransaction = document.getElementById("searchTransaction");
const filterCategory = document.getElementById("filterCategory");
const filterType = document.getElementById("filterType");
const filterDate = document.getElementById("filterDate");
const clearFilters = document.getElementById("clearFilters");

const themeBtn = document.getElementById("themeBtn");
const themeSelect = document.getElementById("theme");

const notificationBtn = document.getElementById("notificationBtn");

const exportDataBtn = document.getElementById("exportData");
const clearDataBtn = document.getElementById("clearData");


/* =========================
   3. SAVE DATA
   ========================= */

function saveData() {

    localStorage.setItem(
        "expenseTrackerTransactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "expenseTrackerBudgets",
        JSON.stringify(budgets)
    );

    localStorage.setItem(
        "expenseTrackerSavingsGoal",
        JSON.stringify(savingsGoal)
    );
}


/* =========================
   4. FORMAT CURRENCY
   ========================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);

}


/* =========================
   5. OPEN MODAL
   ========================= */

function openTransactionModal() {

    transactionModal.classList.add("show");

    transactionForm.reset();

    document.getElementById("transactionDate").value =
        new Date().toISOString().split("T")[0];

}


/* =========================
   6. CLOSE MODAL
   ========================= */

function closeTransactionModal() {

    transactionModal.classList.remove("show");

}


/* =========================
   7. ADD TRANSACTION
   ========================= */

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const type = transactionType.value;

    const amount = Number(
        document.getElementById("amount").value
    );

    const selectedCategory = category.value;

    const description =
        document.getElementById("description").value.trim();

    const date =
        document.getElementById("transactionDate").value;

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const notes =
        document.getElementById("notes").value.trim();


    if (!type || !amount || !selectedCategory || !description || !date) {

        alert("Please fill all required fields.");

        return;
    }


    const newTransaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        category: selectedCategory,

        description: description,

        date: date,

        payment: paymentMethod,

        notes: notes

    };


    transactions.push(newTransaction);

    saveData();

    updateDashboard();

    displayTransactions();

    closeTransactionModal();

    alert("Transaction added successfully!");


});


/* =========================
   8. DISPLAY TRANSACTIONS
   ========================= */

function displayTransactions() {

    let filteredTransactions = [...transactions];


    /* SEARCH */

    const searchValue =
        searchTransaction.value.toLowerCase().trim();


    if (searchValue) {

        filteredTransactions = filteredTransactions.filter(
            transaction =>
                transaction.description
                    .toLowerCase()
                    .includes(searchValue)
        );

    }


    /* CATEGORY FILTER */

    if (filterCategory.value !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                transaction =>
                    transaction.category === filterCategory.value
            );

    }


    /* TYPE FILTER */

    if (filterType.value !== "all") {

        filteredTransactions =
            filteredTransactions.filter(
                transaction =>
                    transaction.type === filterType.value
            );

    }


    /* DATE FILTER */

    if (filterDate.value) {

        filteredTransactions =
            filteredTransactions.filter(
                transaction =>
                    transaction.date === filterDate.value
            );

    }


    /* SORT NEWEST FIRST */

    filteredTransactions.sort(
        (a, b) =>
            new Date(b.date) - new Date(a.date)
    );


    /* EMPTY STATE */

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    No transactions found
                </td>
            </tr>
        `;

        return;
    }


    /* CREATE TABLE */

    transactionList.innerHTML =
        filteredTransactions.map(transaction => {

            const amount =
                transaction.type === "income"
                    ? `+${formatCurrency(transaction.amount)}`
                    : `-${formatCurrency(transaction.amount)}`;


            const categoryName =
                transaction.category.charAt(0).toUpperCase() +
                transaction.category.slice(1);


            const paymentName =
                transaction.payment
                    ? transaction.payment.toUpperCase()
                    : "-";


            return `

                <tr>

                    <td>${formatDate(transaction.date)}</td>

                    <td>
                        ${escapeHTML(transaction.description)}
                    </td>

                    <td>
                        ${categoryName}
                    </td>

                    <td>
                        ${paymentName}
                    </td>

                    <td>
                        ${transaction.type === "income"
                            ? "Income"
                            : "Expense"}
                    </td>

                    <td>
                        <strong>
                            ${amount}
                        </strong>
                    </td>

                    <td>

                        <button
                            class="secondary-btn"
                            onclick="editTransaction(${transaction.id})">
                            Edit
                        </button>

                        <button
                            class="danger-btn"
                            onclick="deleteTransaction(${transaction.id})">
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================
   9. RECENT TRANSACTIONS
   ========================= */

function displayRecentTransactions() {

    const recent =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) - new Date(a.date)
            )
            .slice(0, 5);


    if (recent.length === 0) {

        recentTransactions.innerHTML = `

            <tr class="empty-state">

                <td colspan="6">
                    No transactions available
                </td>

            </tr>

        `;

        return;
    }


    recentTransactions.innerHTML =
        recent.map(transaction => {

            const amount =
                transaction.type === "income"
                    ? `+${formatCurrency(transaction.amount)}`
                    : `-${formatCurrency(transaction.amount)}`;


            return `

                <tr>

                    <td>
                        ${formatDate(transaction.date)}
                    </td>

                    <td>
                        ${escapeHTML(transaction.description)}
                    </td>

                    <td>
                        ${capitalize(transaction.category)}
                    </td>

                    <td>
                        ${transaction.payment
                            ? transaction.payment.toUpperCase()
                            : "-"}
                    </td>

                    <td>
                        ${capitalize(transaction.type)}
                    </td>

                    <td>
                        <strong>
                            ${amount}
                        </strong>
                    </td>

                </tr>

            `;

        }).join("");

}


/* =========================
   10. DASHBOARD CALCULATIONS
   ========================= */

function updateDashboard() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome += Number(transaction.amount);

        } else {

            totalExpenses += Number(transaction.amount);

        }

    });


    const balance =
        totalIncome - totalExpenses;


    const totalSavings =
        Math.max(balance, 0);


    document.getElementById("totalBalance").textContent =
        formatCurrency(balance);


    document.getElementById("totalIncome").textContent =
        formatCurrency(totalIncome);


    document.getElementById("totalExpenses").textContent =
        formatCurrency(totalExpenses);


    document.getElementById("totalSavings").textContent =
        formatCurrency(totalSavings);


    updateSavings();


    updateCharts();


    displayRecentTransactions();

}


/* =========================
   11. SAVINGS
   ========================= */

function updateSavings() {

    const target =
        Number(savingsGoal.target) || 0;

    const saved =
        Number(savingsGoal.saved) || 0;


    const remaining =
        Math.max(target - saved, 0);


    let percentage = 0;


    if (target > 0) {

        percentage =
            Math.min((saved / target) * 100, 100);

    }


    document.getElementById("savingsTarget").textContent =
        formatCurrency(target);


    document.getElementById("savingsAmount").textContent =
        formatCurrency(saved);


    document.getElementById("savingsRemaining").textContent =
        formatCurrency(remaining);


    document.getElementById("savingsPercentage").textContent =
        Math.round(percentage) + "%";


    document.getElementById("goalName").textContent =
        savingsGoal.name;


    document.getElementById("goalTarget").textContent =
        formatCurrency(target);


    document.getElementById("goalSaved").textContent =
        formatCurrency(saved);


    document.getElementById("goalProgress").style.width =
        percentage + "%";


    const circle =
        document.querySelector(".savings-circle");


    if (circle) {

        circle.style.background = `

            radial-gradient(
                circle,
                #ffffff 58%,
                transparent 59%
            ),

            conic-gradient(
                #111827 ${percentage}%,
                #e5e7eb ${percentage}%
            )

        `;

    }

}


/* =========================
   12. CHARTS
   ========================= */

let incomeExpenseChart;
let expenseCategoryChart;
let monthlyExpenseChart;
let savingsChart;


function updateCharts() {

    if (typeof Chart === "undefined") {

        console.log("Chart.js not loaded.");

        return;

    }


    createIncomeExpenseChart();

    createExpenseCategoryChart();

    createMonthlyExpenseChart();

    createSavingsChart();

}


/* =========================
   13. INCOME VS EXPENSE
   ========================= */

function createIncomeExpenseChart() {

    const canvas =
        document.getElementById("incomeExpenseChart");


    if (!canvas) return;


    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }


    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);


    transactions.forEach(transaction => {

        const month =
            new Date(transaction.date).getMonth();


        if (transaction.type === "income") {

            monthlyIncome[month] +=
                Number(transaction.amount);

        } else {

            monthlyExpense[month] +=
                Number(transaction.amount);

        }

    });


    incomeExpenseChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Jan", "Feb", "Mar", "Apr",
                    "May", "Jun", "Jul", "Aug",
                    "Sep", "Oct", "Nov", "Dec"
                ],

                datasets: [

                    {
                        label: "Income",
                        data: monthlyIncome
                    },

                    {
                        label: "Expenses",
                        data: monthlyExpense
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "top"
                    }

                }

            }

        });

}


/* =========================
   14. EXPENSE CATEGORY CHART
   ========================= */

function createExpenseCategoryChart() {

    const canvas =
        document.getElementById("expenseCategoryChart");


    if (!canvas) return;


    if (expenseCategoryChart) {

        expenseCategoryChart.destroy();

    }


    const categories = {};


    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            const name =
                capitalize(transaction.category);


            categories[name] =
                (categories[name] || 0) +
                Number(transaction.amount);

        }

    });


    const labels =
        Object.keys(categories);


    const values =
        Object.values(categories);


    if (labels.length === 0) {

        labels.push("No Expenses");

        values.push(1);

    }


    expenseCategoryChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [

                    {
                        data: values
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "bottom"
                    }

                }

            }

        });

}


/* =========================
   15. MONTHLY EXPENSE CHART
   ========================= */

function createMonthlyExpenseChart() {

    const canvas =
        document.getElementById("monthlyExpenseChart");


    if (!canvas) return;


    if (monthlyExpenseChart) {

        monthlyExpenseChart.destroy();

    }


    const monthlyExpenses =
        Array(12).fill(0);


    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            const month =
                new Date(transaction.date).getMonth();


            monthlyExpenses[month] +=
                Number(transaction.amount);

        }

    });


    monthlyExpenseChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: [
                    "Jan", "Feb", "Mar", "Apr",
                    "May", "Jun", "Jul", "Aug",
                    "Sep", "Oct", "Nov", "Dec"
                ],

                datasets: [

                    {
                        label: "Expenses",
                        data: monthlyExpenses,

                        tension: 0.3,

                        fill: true
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

}


/* =========================
   16. SAVINGS CHART
   ========================= */

function createSavingsChart() {

    const canvas =
        document.getElementById("savingsChart");


    if (!canvas) return;


    if (savingsChart) {

        savingsChart.destroy();

    }


    let runningSavings = 0;

    const monthlySavings =
        Array(12).fill(0);


    transactions.forEach(transaction => {

        const month =
            new Date(transaction.date).getMonth();


        if (transaction.type === "income") {

            runningSavings +=
                Number(transaction.amount);

        } else {

            runningSavings -=
                Number(transaction.amount);

        }


        monthlySavings[month] =
            runningSavings;

    });


    savingsChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: [
                    "Jan", "Feb", "Mar", "Apr",
                    "May", "Jun", "Jul", "Aug",
                    "Sep", "Oct", "Nov", "Dec"
                ],

                datasets: [

                    {
                        label: "Savings",
                        data: monthlySavings,

                        tension: 0.3,

                        fill: true
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

}


/* =========================
   17. DELETE TRANSACTION
   ========================= */

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) return;


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    updateDashboard();

    displayTransactions();

}


/* =========================
   18. EDIT TRANSACTION
   ========================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    openTransactionModal();


    transactionType.value =
        transaction.type;


    document.getElementById("amount").value =
        transaction.amount;


    category.value =
        transaction.category;


    document.getElementById("description").value =
        transaction.description;


    document.getElementById("transactionDate").value =
        transaction.date;


    document.getElementById("paymentMethod").value =
        transaction.payment;


    document.getElementById("notes").value =
        transaction.notes;


    transactionForm.dataset.editingId =
        id;

}


/* =========================
   19. HANDLE EDIT / ADD
   ========================= */

transactionForm.addEventListener("submit", function () {
    const editingId =
        Number(transactionForm.dataset.editingId);


    if (!editingId) return;


    const index =
        transactions.findIndex(
            transaction =>
                transaction.id === editingId
        );


    if (index === -1) return;


    transactions[index] = {

        id: editingId,

        type: transactionType.value,

        amount:
            Number(
                document.getElementById("amount").value
            ),

        category:
            category.value,

        description:
            document.getElementById("description")
                .value.trim(),

        date:
            document.getElementById("transactionDate")
                .value,

        payment:
            document.getElementById("paymentMethod")
                .value,

        notes:
            document.getElementById("notes")
                .value.trim()

    };


    delete transactionForm.dataset.editingId;


    saveData();

    updateDashboard();

    displayTransactions();

});


/* =========================
   20. FILTER EVENTS
   ========================= */

searchTransaction.addEventListener(
    "input",
    displayTransactions
);


filterCategory.addEventListener(
    "change",
    displayTransactions
);


filterType.addEventListener(
    "change",
    displayTransactions
);


filterDate.addEventListener(
    "change",
    displayTransactions
);


clearFilters.addEventListener(
    "click",
    function () {

        searchTransaction.value = "";

        filterCategory.value = "all";

        filterType.value = "all";

        filterDate.value = "";

        displayTransactions();

    }
);


/* =========================
   21. MODAL EVENTS
   ========================= */

addExpenseBtn.addEventListener(
    "click",
    openTransactionModal
);


closeModal.addEventListener(
    "click",
    closeTransactionModal
);


transactionModal.addEventListener(
    "click",
    function (event) {

        if (event.target === transactionModal) {

            closeTransactionModal();

        }

    }
);


/* =========================
   22. DARK MODE
   ========================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");


    const darkMode =
        document.body.classList.contains("dark-mode");


    localStorage.setItem(
        "expenseTrackerDarkMode",
        darkMode
    );


    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";


    if (themeSelect) {

        themeSelect.value =
            darkMode ? "dark" : "light";

    }

}


themeBtn.addEventListener(
    "click",
    toggleDarkMode
);


if (themeSelect) {

    themeSelect.addEventListener(
        "change",
        function () {

            if (themeSelect.value === "dark") {

                document.body.classList.add(
                    "dark-mode"
                );

                themeBtn.textContent = "☀️";

                localStorage.setItem(
                    "expenseTrackerDarkMode",
                    true
                );

            } else {

                document.body.classList.remove(
                    "dark-mode"
                );

                themeBtn.textContent = "🌙";

                localStorage.setItem(
                    "expenseTrackerDarkMode",
                    false
                );

            }

        }
    );

}


/* =========================
   23. LOAD DARK MODE
   ========================= */

function loadTheme() {

    const darkMode =
        localStorage.getItem(
            "expenseTrackerDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );

        themeBtn.textContent = "☀️";

    }

}


/* =========================
   24. NOTIFICATIONS
   ========================= */

notificationBtn.addEventListener(
    "click",
    function () {

        const expenses =
            transactions
                .filter(
                    transaction =>
                        transaction.type === "expense"
                )
                .reduce(
                    (total, transaction) =>
                        total +
                        Number(transaction.amount),
                    0
                );


        if (expenses === 0) {

            alert(
                "🔔 No expenses recorded yet."
            );

        } else {

            alert(
                `🔔 You have spent ${formatCurrency(expenses)} in total.`
            );

        }

    }
);


/* =========================
   25. EXPORT DATA
   ========================= */

exportDataBtn.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert("No transaction data to export.");

            return;

        }


        const headers = [
            "Date",
            "Description",
            "Category",
            "Payment",
            "Type",
            "Amount",
            "Notes"
        ];


        const rows =
            transactions.map(transaction => [

                transaction.date,

                transaction.description,

                transaction.category,

                transaction.payment,

                transaction.type,

                transaction.amount,

                transaction.notes

            ]);


        const csvContent = [

            headers,

            ...rows

        ].map(row =>

            row.map(value =>

                `"${String(value).replace(/"/g, '""')}"`

            ).join(",")

        ).join("\n");


        const blob =
            new Blob(
                [csvContent],
                { type: "text/csv;charset=utf-8;" }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "expense-tracker-data.csv";


        link.click();


        URL.revokeObjectURL(url);

    }
);


/* =========================
   26. CLEAR ALL DATA
   ========================= */

clearDataBtn.addEventListener(
    "click",
    function () {

        const confirmation =
            confirm(
                "⚠️ This will delete ALL transactions and saved data. Continue?"
            );


        if (!confirmation) return;


        transactions = [];

        budgets = [];


        savingsGoal = {

            name: "Emergency Fund",

            target: 100000,

            saved: 0

        };


        saveData();

        updateDashboard();

        displayTransactions();


        alert(
            "All data has been cleared."
        );

    }
);


/* =========================
   27. HELPER FUNCTIONS
   ========================= */

function formatDate(date) {

    if (!date) return "-";


    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   28. INITIALIZE APPLICATION
   ========================= */

function initializeApp() {

    loadTheme();

    updateDashboard();

    displayTransactions();

    displayBudgets();

    updateBudgetOverview();

}


/* =========================
   START APPLICATION
   ========================= */

initializeApp();


let expenses = JSON.parse(localStorage.getItem("tamimExpenses")) || [];

function saveExpenses() {
  localStorage.setItem("tamimExpenses", JSON.stringify(expenses));
}

function addExpense() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;
  const date =
    document.getElementById("expenseDate").value ||
    new Date().toISOString().split("T")[0];

  if (!name) {
    alert("اكتب اسم المصروف أولاً ✍️");
    return;
  }

  if (!amount || amount <= 0) {
    alert("اكتب مبلغ صحيح 💶");
    return;
  }

  expenses.push({
    id: Date.now(),
    name,
    amount,
    category,
    date
  });

  saveExpenses();

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  renderExpenses();
}

function deleteExpense(id) {
  if (!confirm("هل تريد حذف هذا المصروف؟")) {
    return;
  }

  expenses = expenses.filter(expense => expense.id !== id);

  saveExpenses();
  renderExpenses();
}

function editExpense(id) {
  const expense = expenses.find(item => item.id === id);

  if (!expense) return;

  const newName = prompt("اسم المصروف:", expense.name);

  if (newName === null || !newName.trim()) {
    return;
  }

  const newAmount = prompt("المبلغ (€):", expense.amount);

  if (newAmount === null) {
    return;
  }

  const amount = Number(newAmount);

  if (!amount || amount <= 0) {
    alert("المبلغ غير صحيح ❌");
    return;
  }

  expense.name = newName.trim();
  expense.amount = amount;

  saveExpenses();
  renderExpenses();
}

function searchExpenses() {
  renderExpenses();
}

function renderExpenses() {
  const list = document.getElementById("expenseList");
  const searchInput = document.getElementById("searchInput");

  const search =
    searchInput?.value.toLowerCase().trim() || "";

  const filteredExpenses = expenses.filter(expense =>
    expense.name.toLowerCase().includes(search) ||
    expense.category.toLowerCase().includes(search)
  );

  if (filteredExpenses.length === 0) {
    list.innerHTML = `
      <p class="empty">
        لا توجد مصاريف 📭
      </p>
    `;
  } else {
    list.innerHTML = filteredExpenses
      .slice()
      .reverse()
      .map(expense => `
        <div class="expense-item">

          <div class="expense-info">

            <strong>
              ${escapeHTML(expense.name)}
            </strong>

            <span>
              ${escapeHTML(expense.category)}
            </span>

            <small>
              📅 ${expense.date}
            </small>

          </div>

          <div class="expense-actions">

            <strong>
              €${expense.amount.toFixed(2)}
            </strong>

            <button
              type="button"
              onclick="editExpense(${expense.id})"
            >
              ✏️
            </button>

            <button
              type="button"
              onclick="deleteExpense(${expense.id})"
            >
              🗑️
            </button>

          </div>

        </div>
      `)
      .join("");
  }

  updateStats();
}

function updateStats() {
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const now = new Date();

  const monthTotal = expenses
    .filter(expense => {
      const date = new Date(expense.date);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

  setText("total", formatEuro(total));
  setText("monthTotal", formatEuro(monthTotal));
  setText("expenseCount", expenses.length);

  updateCategoryStats();
}

function updateCategoryStats() {
  const totals = {
    "🍔 طعام": 0,
    "🚗 مواصلات": 0,
    "🛒 تسوق": 0,
    "🏠 فواتير": 0,
    "💊 صحة": 0,
    "📦 أخرى": 0
  };

  expenses.forEach(expense => {
    if (totals[expense.category] !== undefined) {
      totals[expense.category] += expense.amount;
    }
  });

  setText("foodTotal", formatEuro(totals["🍔 طعام"]));
  setText("transportTotal", formatEuro(totals["🚗 مواصلات"]));
  setText("shoppingTotal", formatEuro(totals["🛒 تسوق"]));
  setText("billsTotal", formatEuro(totals["🏠 فواتير"]));
  setText("healthTotal", formatEuro(totals["💊 صحة"]));
  setText("otherTotal", formatEuro(totals["📦 أخرى"]));
}

function clearAllExpenses() {
  if (expenses.length === 0) {
    alert("ما عندك مصاريف حتى الآن 📭");
    return;
  }

  const confirmed = confirm(
    "⚠️ هل أنت متأكد أنك تريد حذف جميع المصاريف؟"
  );

  if (!confirmed) return;

  expenses = [];

  saveExpenses();
  renderExpenses();
}

function formatEuro(amount) {
  return `€${amount.toFixed(2)}`;
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("expenseDate");

  if (dateInput) {
    dateInput.value =
      new Date().toISOString().split("T")[0];
  }

  renderExpenses();
});

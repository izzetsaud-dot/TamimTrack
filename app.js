let expenses = JSON.parse(localStorage.getItem("tamimExpenses")) || [];

function saveExpenses() {
  localStorage.setItem("tamimExpenses", JSON.stringify(expenses));
}

function addExpense() {
  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);
  const category = document.getElementById("expenseCategory").value;
  const date = document.getElementById("expenseDate").value;

  if (!name || !amount || amount <= 0 || !date) {
    alert("رجاءً أدخل بيانات المصروف كاملة");
    return;
  }

  expenses.unshift({
    id: Date.now(),
    name,
    amount,
    category,
    date
  });

  saveExpenses();
  renderExpenses();

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  renderExpenses();
}

function renderExpenses() {
  const list = document.getElementById("expenseList");
  const totalElement = document.getElementById("total");

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  totalElement.textContent = "€" + total.toFixed(2);

  list.innerHTML = "";

  if (expenses.length === 0) {
    list.innerHTML = "<p>لا توجد مصاريف حتى الآن 📭</p>";
    return;
  }

  expenses.forEach(expense => {
    const item = document.createElement("div");

    item.className = "expense-item";

    item.innerHTML = `
      <div>
        <strong>${expense.name}</strong>
        <small>${expense.category} • ${expense.date}</small>
      </div>

      <div>
        <strong>€${expense.amount.toFixed(2)}</strong>
        <button onclick="deleteExpense(${expense.id})">🗑️</button>
      </div>
    `;

    list.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("expenseDate");

  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  renderExpenses();
});

const expenses = [];

function addExpense() {
  const amount = prompt("كم المبلغ؟");

  if (!amount || isNaN(amount)) {
    alert("أدخل مبلغ صحيح");
    return;
  }

  expenses.push(Number(amount));

  const total = expenses.reduce((sum, value) => sum + value, 0);

  alert("تمت إضافة المصروف 💰\nالإجمالي: €" + total.toFixed(2));
}

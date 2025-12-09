// ------------------------------
// Estado principal
// ------------------------------
const STORAGE_KEY = "finance-mvp-state";

const defaultCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Saúde",
  "Dívidas",
  "Outros",
];

const defaultIncomeCategories = [
  "Salário",
  "Freelance",
  "Contrato",
  "Investimento",
  "Presente",
  "Reembolso",
  "Outro",
];

let state = {
  incomeMonthly: 0,
  spendingLimit: 0,
  categories: [...defaultCategories],
  incomeCategories: [...defaultIncomeCategories],
  transactions: [], // {id, type, amount, category, method, date, note, incomeSubtype, contractStartMonth, contractEndMonth, installments, interestRate, contractDuration}
  userProfile: {
    name: "",
    birthdate: "",
  },
  goals: [], // {id, name, date, targetAmount, savedAmount, frequency}
};

// ------------------------------
// Utilidades
// ------------------------------
const formatMoney = (value) =>
  "R$ " +
  Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getMonthKey = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthKeyToDate = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return null;
  return new Date(year, month - 1, 1);
};

const monthKeyCompare = (a, b) => a.localeCompare(b);

const isMonthWithinContract = (monthKey, tx) => {
  if (!tx.contractStartMonth) return false;
  if (monthKeyCompare(monthKey, tx.contractStartMonth) < 0) return false;
  if (tx.contractEndMonth && monthKeyCompare(monthKey, tx.contractEndMonth) > 0) return false;
  return true;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// Usar armazenamento adaptativo (Electron, Capacitor ou localStorage)
const getStorage = () => {
  if (typeof window !== 'undefined' && window.adaptiveStorage) {
    return window.adaptiveStorage;
  }
  return localStorage;
};

// ------------------------------
// Persistência
// ------------------------------
function loadState() {
  const storage = getStorage();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state = { ...state, ...parsed };
  } catch (e) {
    console.error("Erro ao carregar state:", e);
  }
}

function saveState() {
  const storage = getStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ------------------------------
// Navegação entre telas
// ------------------------------
const screens = {
  onboarding: document.getElementById("onboarding-screen"),
  dashboard: document.getElementById("dashboard-screen"),
  transactions: document.getElementById("transactions-screen"),
  reports: document.getElementById("reports-screen"),
  goals: document.getElementById("goals-screen"),
  settings: document.getElementById("settings-screen"),
};

const navButtons = document.querySelectorAll(".nav-btn");

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add("hidden"));
  screens[name].classList.remove("hidden");

  navButtons.forEach((btn) => {
    if (btn.dataset.screen === name) btn.classList.add("nav-btn-active");
    else btn.classList.remove("nav-btn-active");
  });
}

// ------------------------------
// DOM refs
// ------------------------------

// Onboarding
const onbIncome = document.getElementById("onb-income");
const onbLimit = document.getElementById("onb-limit");
const onbCatList = document.getElementById("onb-categories-list");
const onbSaveBtn = document.getElementById("onb-save-btn");

// Dashboard
const dashMonthSelect = document.getElementById("dash-month-select");
const dashIncome = document.getElementById("dash-income");
const dashExpense = document.getElementById("dash-expense");
const dashBalance = document.getElementById("dash-balance");
const dashSpentLabel = document.getElementById("dash-spent-label");
const dashProgressFill = document.getElementById("dash-progress-fill");
const monthProjectionInfo = document.getElementById("month-projection-info");
const monthProjectionText = document.getElementById("month-projection-text");
const addExpenseBtn = document.getElementById("add-expense-btn");
const addIncomeBtn = document.getElementById("add-income-btn");

// Transactions
const txTypeRadios = document.querySelectorAll("input[name='tx-type']");
const paymentMethodField = document.getElementById("payment-method-field");
const paymentMethodLabel = document.getElementById("payment-method-label");
const installmentFields = document.getElementById("installment-fields");
const installmentTypeRadios = document.querySelectorAll("input[name='installment-type']");
const installmentDetails = document.getElementById("installment-details");
const installmentInfo = document.getElementById("installment-info");
const txInstallments = document.getElementById("tx-installments");
const txInterestRate = document.getElementById("tx-interest-rate");
const installmentAmount = document.getElementById("installment-amount");
const installmentTotal = document.getElementById("installment-total");
const installmentInterest = document.getElementById("installment-interest");
const installmentSavings = document.getElementById("installment-savings");
const installmentSuggestion = document.getElementById("installment-suggestion");
const incomeFields = document.getElementById("income-fields");
const incomeSubtypeRadios = document.querySelectorAll("input[name='income-subtype']");
const fixedIncomeFields = document.getElementById("fixed-income-fields");
const contractDurationRadios = document.querySelectorAll("input[name='contract-duration']");
const specificPeriodFields = document.getElementById("specific-period-fields");
const contractStartMonthInput = document.getElementById("contract-start-month");
const contractEndMonthInput = document.getElementById("contract-end-month");
const txAmount = document.getElementById("tx-amount");
const txCategory = document.getElementById("tx-category");
const txMethod = document.getElementById("tx-method");
const txDate = document.getElementById("tx-date");
const txNote = document.getElementById("tx-note");
const txSaveBtn = document.getElementById("tx-save-btn");
const txMonthFilter = document.getElementById("tx-month-filter");
const txTypeFilter = document.getElementById("tx-type-filter");
const txList = document.getElementById("tx-list");

// Settings
const setName = document.getElementById("set-name");
const setBirthdate = document.getElementById("set-birthdate");
const setIncome = document.getElementById("set-income");
const setLimit = document.getElementById("set-limit");
const setSaveBtn = document.getElementById("set-save-btn");
const setCategoryList = document.getElementById("set-category-list");
const setCategoryNew = document.getElementById("set-category-new");
const setCategoryAddBtn = document.getElementById("set-category-add-btn");

// Goals/Metas
const goalName = document.getElementById("goal-name");
const goalDate = document.getElementById("goal-date");
const goalAmount = document.getElementById("goal-amount");
const goalSaved = document.getElementById("goal-saved");
const goalFrequency = document.getElementById("goal-frequency");
const goalSaveBtn = document.getElementById("goal-save-btn");
const goalsList = document.getElementById("goals-list");
const txIsGoalMovement = document.getElementById("tx-is-goal-movement");
const txGoalSelect = document.getElementById("tx-goal-select");
const goalHistoryFilter = document.getElementById("goal-history-filter");
const goalHistoryList = document.getElementById("goal-history-list");
const goalInfoDisplay = document.getElementById("goal-info-display");
const goalCurrentBalance = document.getElementById("goal-current-balance");

// Charts
let pieChart, barChart, lineChart, expenseChart, balanceChart, incomeChart;

// Reports elements
const reportsMonthSelect = document.getElementById("reports-month-select");
const expenseChartTypeSelect = document.getElementById("expense-chart-type");
const balanceChartTypeSelect = document.getElementById("balance-chart-type");
const incomeChartTypeSelect = document.getElementById("income-chart-type");
const reportsIncome = document.getElementById("reports-income");
const reportsExpense = document.getElementById("reports-expense");
const reportsBalance = document.getElementById("reports-balance");
const totalIncomeDisplay = document.getElementById("total-income-display");

// ------------------------------
// Inicialização de selects/listas
// ------------------------------
function populateCategoriesSelect() {
  txCategory.innerHTML = "";
  const categories = document.querySelector("input[name='tx-type']:checked").value === "income" 
    ? state.incomeCategories 
    : state.categories;
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    txCategory.appendChild(opt);
  });
}

function populateMonthSelects() {
  const months = generateFutureMonths(12); // Gera 12 meses futuros + passados

  function buildOptions(selectEl) {
    selectEl.innerHTML = "";
    months.forEach((m) => {
      const label = formatMonthName(m);
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = label;
      selectEl.appendChild(opt);
    });
    
    // Selecionar o mês atual por padrão
    const currentMonth = getMonthKey(todayStr());
    if (selectEl.querySelector(`option[value="${currentMonth}"]`)) {
      selectEl.value = currentMonth;
    }
  }

  buildOptions(dashMonthSelect);
  buildOptions(txMonthFilter);
  buildOptions(reportsMonthSelect);
}

// ------------------------------
// Render Onboarding
// ------------------------------
function renderOnboarding() {
  onbCatList.innerHTML = "";
  defaultCategories.forEach((c) => {
    const li = document.createElement("li");
    li.textContent = c;
    onbCatList.appendChild(li);
  });
}

// ------------------------------
// Lógica de resumo por mês
// ------------------------------
function getMonthSummary(monthKey) {
  let income = 0;
  let expense = 0;
  const byCategory = {};

  state.transactions.forEach((t) => {
    const txMonth = getMonthKey(t.date);
    const isContractIncome =
      t.type === "income" && t.incomeSubtype === "fixed" && t.contractStartMonth;
    if (t.type === "income") {
      if (isContractIncome && isMonthWithinContract(monthKey, t)) {
        income += t.amount;
      } else if (!isContractIncome && txMonth === monthKey) {
        income += t.amount;
      }
      return;
    }

    if (txMonth === monthKey) {
      expense += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }

  });

  return {
    income,
    expense,
    balance: income - expense,
    byCategory,
  };
}

// Função para calcular resumo incluindo parcelas e investimentos para um mês (atual ou futuro)
function getMonthProjection(monthKey) {
  let income = 0;
  let expense = 0;
  let installmentExpense = 0;
  const byCategory = {};
  const incomeByCategory = {};
  const projectileTransactions = [];

  const addIncome = (category, amount) => {
    income += amount;
    incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
  };

  // Transações normais no mês (inclui contratos recorrentes)
  state.transactions.forEach((t) => {
    const txMonth = getMonthKey(t.date);
    const isContractIncome =
      t.type === "income" && t.incomeSubtype === "fixed" && t.contractStartMonth;

    if (t.type === "income") {
      if (isContractIncome) {
        if (isMonthWithinContract(monthKey, t)) {
          addIncome(t.category, t.amount);
        }
      } else if (txMonth === monthKey) {
        addIncome(t.category, t.amount);
        projectileTransactions.push(t);
      }
      return;
    }

    if (txMonth === monthKey) {
      expense += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      projectileTransactions.push(t);
    }
  });

  // Adicionar parcelas futuras de parcelamentos
  state.transactions.forEach((t) => {
    if (!t.installments || t.installments <= 1 || t.type !== "expense") return;
    
    const txMonth = getMonthKey(t.date);
    const [txYear, txMonth2] = txMonth.split("-");
    const txMonthNum = parseInt(txMonth2);
    const txYearNum = parseInt(txYear);
    
    const [projYear, projMonth] = monthKey.split("-");
    const projMonthNum = parseInt(projMonth);
    const projYearNum = parseInt(projYear);
    
    // Calcular qual número de parcela cai neste mês
    const monthDiff = (projYearNum - txYearNum) * 12 + (projMonthNum - txMonthNum);
    
    if (monthDiff > 0 && monthDiff < t.installments) {
      // Esta parcela se aplica a este mês
      const monthlyRate = (t.interestRate || 0) / 100;
      let monthlyPayment;
      
      if (monthlyRate > 0) {
        const numerator = t.amount * monthlyRate * Math.pow(1 + monthlyRate, t.installments);
        const denominator = Math.pow(1 + monthlyRate, t.installments) - 1;
        monthlyPayment = numerator / denominator;
      } else {
        monthlyPayment = t.amount / t.installments;
      }
      
      installmentExpense += monthlyPayment;
      byCategory[t.category] = (byCategory[t.category] || 0) + monthlyPayment;
    }
  });

  return {
    income,
    expense,
    installmentExpense,
    balance: income - expense - installmentExpense,
    byCategory,
    incomeByCategory,
    transactions: projectileTransactions,
  };
}

// Função para gerar meses futuros
function generateFutureMonths(monthsAhead = 12) {
  const months = [];
  const today = new Date();
  
  // Incluir meses passados com dados de transações
  const monthSet = new Set();
  state.transactions.forEach((t) => {
    const key = getMonthKey(t.date);
    if (key) monthSet.add(key);
  });

  // Incluir meses cobertos por contratos de renda fixa
  state.transactions
    .filter((t) => t.type === "income" && t.incomeSubtype === "fixed" && t.contractStartMonth)
    .forEach((t) => {
      const startDate = monthKeyToDate(t.contractStartMonth);
      if (!startDate) return;
      const endDate = t.contractEndMonth
        ? monthKeyToDate(t.contractEndMonth)
        : new Date(today.getFullYear(), today.getMonth() + monthsAhead, 1);
      const cursor = new Date(startDate);
      const limit = endDate || new Date(today.getFullYear(), today.getMonth() + monthsAhead, 1);

      while (cursor <= limit) {
        const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
        monthSet.add(key);
        cursor.setMonth(cursor.getMonth() + 1);
      }
    });
  
  // Adicionar mês atual
  const currentMonth = getMonthKey(todayStr());
  monthSet.add(currentMonth);
  
  // Adicionar meses futuros (para previsibilidade)
  for (let i = 1; i <= monthsAhead; i++) {
    const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const futureMonth = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, "0")}`;
    monthSet.add(futureMonth);
  }
  
  return Array.from(monthSet).sort().reverse();
}

// Função auxiliar para formatar nome do mês
function formatMonthName(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
  let prefix = "";
  if (monthKey === currentMonth) {
    prefix = "📅 ";
  } else if (monthKey > currentMonth) {
    prefix = "🔮 ";
  }
  
  return prefix + date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

// Funções de Parcelamento
// ------------------------------
function calculateInstallmentInfo() {
  const amount = parseFloat(txAmount.value) || 0;
  const installments = parseInt(txInstallments.value) || 1;
  const interestRate = parseFloat(txInterestRate.value) || 0;

  if (amount <= 0 || installments < 1) {
    installmentInfo.style.display = "none";
    return;
  }

  // Cálculo com juros compostos
  const monthlyRate = interestRate / 100;
  let totalAmount = amount;

  if (monthlyRate > 0) {
    // Fórmula: PMT = (PV * r * (1 + r)^n) / ((1 + r)^n - 1)
    const numerator = amount * monthlyRate * Math.pow(1 + monthlyRate, installments);
    const denominator = Math.pow(1 + monthlyRate, installments) - 1;
    const monthlyPayment = numerator / denominator;
    totalAmount = monthlyPayment * installments;
  } else {
    totalAmount = amount;
  }

  const monthlyPayment = totalAmount / installments;
  const interestAmount = totalAmount - amount;
  const savings = interestAmount;

  // Calcular sugestão de poupança mensal
  const monthlyExpense = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0) / 12 || 100;

  const monthsToSave = Math.ceil(amount / monthlyExpense);
  const monthlySavingsAmount = amount / monthsToSave;

  installmentAmount.textContent = formatMoney(monthlyPayment);
  installmentTotal.textContent = formatMoney(totalAmount);
  installmentInterest.textContent = formatMoney(interestAmount);
  installmentSavings.textContent = formatMoney(savings);

  if (monthsToSave > 0) {
    installmentSuggestion.textContent = `💡 Dica: Juntar R$ ${formatMoney(monthlySavingsAmount)} por mês durante ${monthsToSave} meses para pagar à vista e economizar ${formatMoney(savings)}`;
  }

  installmentInfo.style.display = "block";
}

// ------------------------------
// Funções de Metas
// ------------------------------
function calculateGoalSuggestion(goal) {
  const today = new Date();
  const targetDate = new Date(goal.date);
  const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  const amountLeft = Math.max(0, goal.targetAmount - goal.savedAmount);

  if (daysLeft <= 0) {
    return `Meta já vencida em ${Math.abs(daysLeft)} dias!`;
  }

  let suggestion = "";
  if (goal.frequency === "daily") {
    const dailyAmount = amountLeft / daysLeft;
    suggestion = `💰 Deposite R$ ${formatMoney(dailyAmount)} por dia`;
  } else if (goal.frequency === "weekly") {
    const weeksLeft = Math.ceil(daysLeft / 7);
    const weeklyAmount = amountLeft / weeksLeft;
    suggestion = `💰 Deposite R$ ${formatMoney(weeklyAmount)} por semana (${weeksLeft} semanas)`;
  } else if (goal.frequency === "monthly") {
    const monthsLeft = Math.ceil(daysLeft / 30);
    const monthlyAmount = amountLeft / monthsLeft;
    suggestion = `💰 Deposite R$ ${formatMoney(monthlyAmount)} por mês (${monthsLeft} meses)`;
  }

  return suggestion;
}

function populateGoalSelect() {
  txGoalSelect.innerHTML = "<option value=''>-- Selecione uma meta --</option>";
  
  state.goals.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = `${goal.name} (R$ ${formatMoney(goal.savedAmount)} / R$ ${formatMoney(goal.targetAmount)})`;
    txGoalSelect.appendChild(option);
  });
}

function updateGoals() {
  goalsList.innerHTML = "";

  state.goals.forEach((goal) => {
    const today = new Date();
    const targetDate = new Date(goal.date);
    const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    const progressPercent = (goal.savedAmount / goal.targetAmount) * 100;

    const li = document.createElement("li");
    li.className = "goal-item";

    const header = document.createElement("div");
    header.className = "goal-header";
    header.innerHTML = `
      <span class="goal-title">${goal.name}</span>
      <span class="goal-days">${daysLeft > 0 ? `${daysLeft} dias` : "Vencida"}</span>
    `;

    const progress = document.createElement("div");
    progress.className = "goal-progress";
    progress.innerHTML = `
      <span>${formatMoney(goal.savedAmount)} de ${formatMoney(goal.targetAmount)}</span>
      <span style="color: #3b82f6;">${Math.round(progressPercent)}%</span>
    `;

    const progressBar = document.createElement("div");
    progressBar.className = "goal-progress-bar";
    const fill = document.createElement("div");
    fill.className = "goal-progress-fill";
    fill.style.width = Math.min(progressPercent, 100) + "%";
    progressBar.appendChild(fill);

    const suggestion = document.createElement("div");
    suggestion.className = "goal-suggestion";
    suggestion.textContent = calculateGoalSuggestion(goal);

    const actions = document.createElement("div");
    actions.className = "goal-actions";
    
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Editar";
    editBtn.onclick = () => {
      goalName.value = goal.name;
      goalDate.value = goal.date;
      goalAmount.value = goal.targetAmount;
      goalSaved.value = goal.savedAmount;
      goalFrequency.value = goal.frequency || "";
      goalSaveBtn.textContent = "💾 Atualizar meta";
      goalSaveBtn.dataset.editId = goal.id;
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Deletar";
    deleteBtn.onclick = () => {
      state.goals = state.goals.filter((g) => g.id !== goal.id);
      saveState();
      updateGoals();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(header);
    li.appendChild(progress);
    li.appendChild(progressBar);
    li.appendChild(suggestion);
    li.appendChild(actions);

    goalsList.appendChild(li);
  });
}

function updateGoalHistory() {
  const selectedGoalId = goalHistoryFilter.value;

  if (!selectedGoalId) {
    goalHistoryList.innerHTML = "<li style='color: #888;'>Selecione uma meta para ver o histórico</li>";
    return;
  }

  const goal = state.goals.find((g) => g.id === selectedGoalId);
  if (!goal || !goal.movements || goal.movements.length === 0) {
    goalHistoryList.innerHTML = "<li style='color: #888;'>Nenhum movimento registrado para esta meta</li>";
    return;
  }

  goalHistoryList.innerHTML = "";
  
  // Ordenar movimentos por data decrescente (mais recentes primeiro)
  const sortedMovements = [...goal.movements].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  sortedMovements.forEach((movement) => {
    const li = document.createElement("li");
    li.style.cssText = "padding: 10px; border-left: 3px solid #4CAF50; margin-bottom: 8px; background: rgba(76, 175, 80, 0.1); border-radius: 4px;";
    
    const typeEmoji = movement.type === "deposit" ? "📥" : "📤";
    const typeText = movement.type === "deposit" ? "Depósito" : "Saque";
    const amountColor = movement.type === "deposit" ? "green" : "red";
    const amountPrefix = movement.type === "deposit" ? "+" : "-";

    const formattedDate = new Date(movement.date).toLocaleDateString("pt-BR");

    li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${typeEmoji} ${typeText}</strong> - ${formattedDate}<br>
          <small style="color: #aaa;">${movement.description}</small>
        </div>
        <div style="color: ${amountColor}; font-weight: bold; font-size: 1.1em;">
          ${amountPrefix} R$ ${formatMoney(movement.amount)}
        </div>
      </div>
    `;
    
    goalHistoryList.appendChild(li);
  });
}

// Popolar histórico e adicionar event listener para filtro
goalHistoryFilter.addEventListener("change", updateGoalHistory);

// Inicializar histórico ao carregar
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar aplicação
  populateMonthSelects();
  updateDashboard();
  updateTransactionList();
  updateGoals();
  updateReports();
  updateHistoryFilter();
});

// Função auxiliar para atualizar filtro (será chamada junto com updateGoals)
function updateHistoryFilter() {
  const currentValue = goalHistoryFilter.value;
  goalHistoryFilter.innerHTML = "<option value=''>-- Selecione uma meta --</option>";
  
  state.goals.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = goal.name;
    goalHistoryFilter.appendChild(option);
  });
  
  if (currentValue && state.goals.find((g) => g.id === currentValue)) {
    goalHistoryFilter.value = currentValue;
    updateGoalHistory();
  }
}

// ------------------------------
// Dashboard render
// ------------------------------
function updateDashboard() {
  const monthKey = dashMonthSelect.value || getMonthKey(todayStr());
  const projection = getMonthProjection(monthKey);
  const currentMonth = getMonthKey(todayStr());

  dashIncome.textContent = formatMoney(projection.income);
  dashExpense.textContent = formatMoney(projection.expense + projection.installmentExpense);
  dashBalance.textContent = formatMoney(projection.balance);

  dashSpentLabel.textContent = `${formatMoney(
    projection.expense + projection.installmentExpense
  )} de ${formatMoney(state.spendingLimit || 0)}`;

  // Mostrar informação de projeção se houver parcelas e estamos olhando para o futuro
  if (projection.installmentExpense > 0) {
    monthProjectionInfo.style.display = "block";
    monthProjectionText.textContent = `🔮 Inclui R$ ${formatMoney(projection.installmentExpense)} em parcelas`;
  } else if (monthKey > currentMonth) {
    monthProjectionInfo.style.display = "block";
    monthProjectionText.textContent = `🔮 Previsão para mês futuro`;
  } else {
    monthProjectionInfo.style.display = "none";
  }

  const ratio =
    state.spendingLimit > 0
      ? Math.min((projection.expense + projection.installmentExpense) / state.spendingLimit, 2)
      : 0;
  dashProgressFill.style.width = Math.min(ratio * 100, 100) + "%";

  // cores feedback
  if (ratio <= 0.7) {
    dashProgressFill.style.background = "#22c55e"; // verde
  } else if (ratio <= 1) {
    dashProgressFill.style.background = "#eab308"; // amarelo
  } else {
    dashProgressFill.style.background = "#f97373"; // vermelho
  }

  // gráfico de pizza
  const labels = Object.keys(projection.byCategory);
  const values = Object.values(projection.byCategory);

  if (pieChart) pieChart.destroy();
  const ctx = document.getElementById("pie-chart").getContext("2d");
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#e5e7eb" },
        },
      },
    },
  });
}

// ------------------------------
// Transações - render da lista
// ------------------------------
function updateTransactionList() {
  const monthKey = txMonthFilter.value || getMonthKey(todayStr());
  const typeFilter = txTypeFilter.value;

  txList.innerHTML = "";

  const filtered = [];

  state.transactions.forEach((t) => {
    const txMonth = getMonthKey(t.date);
    const isContractIncome =
      t.type === "income" && t.incomeSubtype === "fixed" && t.contractStartMonth;

    if (isContractIncome && isMonthWithinContract(monthKey, t)) {
      if (typeFilter === "expense") return;
      const sameMonth = txMonth === monthKey;
      const syntheticDate = `${monthKey}-01`;
      filtered.push(
        sameMonth
          ? t
          : {
              ...t,
              date: syntheticDate,
              synthetic: true,
            }
      );
      return;
    }

    if (txMonth !== monthKey) return;
    if (typeFilter === "income" && t.type !== "income") return;
    if (typeFilter === "expense" && t.type !== "expense") return;
    filtered.push(t);
  });

  if (!filtered.length) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma transação neste período.";
    li.style.fontSize = "13px";
    li.style.color = "#9ca3af";
    txList.appendChild(li);
    return;
  }

  filtered
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((t) => {
      const li = document.createElement("li");
      li.className = "tx-item";

      const main = document.createElement("div");
      main.className = "tx-item-main";

      const title = document.createElement("span");
      title.className = "tx-item-title";
      title.textContent = t.note || t.category;
      main.appendChild(title);

      const meta = document.createElement("span");
      meta.className = "tx-item-meta";
      const dateStr = new Date(t.date).toLocaleDateString("pt-BR");
      const formatContractMonth = (m) => {
        if (!m || !m.includes("-")) return "";
        const [year, month] = m.split("-");
        return `${month}/${year}`;
      };
      let metaText = `${t.category} - ${dateStr} ${
        t.method ? "- " + t.method : ""
      }`;
      
      if (t.type === "income" && t.incomeSubtype === "fixed") {
        const startLabel = formatContractMonth(t.contractStartMonth) || dateStr;
        const endLabel = t.contractEndMonth
          ? formatContractMonth(t.contractEndMonth)
          : "indefinido";
        metaText += ` - Contrato ${startLabel}${t.contractEndMonth ? ` a ${endLabel}` : " (sem término)"}`;
      }

      // Adicionar informações de parcelamento se existirem
      if (t.installments && t.installments > 1) {
        metaText += ` • 📅 ${t.installments}x`;
        if (t.interestRate > 0) {
          metaText += ` (${t.interestRate}% a.m.)`;
        }
      }
      
      meta.textContent = metaText;
      main.appendChild(meta);

      const value = document.createElement("span");
      value.className = "tx-item-value " + t.type;
      const sign = t.type === "expense" ? "-" : "+";
      value.textContent = sign + formatMoney(t.amount).replace("R$ ", "R$ ");

      const actions = document.createElement("div");
      actions.className = "tx-item-actions";
      const delBtn = document.createElement("button");
      if (t.synthetic) {
        delBtn.textContent = "Contrato fixo";
        delBtn.disabled = true;
        delBtn.style.opacity = "0.6";
        delBtn.style.cursor = "default";
      } else {
        delBtn.textContent = "Excluir";
        delBtn.onclick = () => {
          state.transactions = state.transactions.filter((x) => x.id !== t.id);
          saveState();
          refreshAll();
        };
      }
      actions.appendChild(delBtn);

      li.appendChild(main);
      li.appendChild(value);
      li.appendChild(actions);

      txList.appendChild(li);
    });
}

// ------------------------------
// Relatórios - gráficos melhorados
// ------------------------------
function updateReports() {
  // Montar dados por mês usando projeções (inclui parcelas)
  const monthMap = new Map(); // key -> {income: 0, expense: 0, installmentExpense: 0, incomeByCategory: {}}

  const months = generateFutureMonths(12); // Gera passado + 12 meses futuros

  months.forEach((monthKey) => {
    const projection = getMonthProjection(monthKey);
    monthMap.set(monthKey, {
      income: projection.income,
      expense: projection.expense,
      installmentExpense: projection.installmentExpense,
      totalExpense: projection.expense + projection.installmentExpense,
      incomeByCategory: projection.incomeByCategory || {},
    });
  });

  // Gerar labels dos meses
  const labels = months.map((m) => formatMonthName(m).replace(/^[📅🔮] /, ""));

  // Obter mês selecionado (ou último)
  let selectedMonthKey = reportsMonthSelect.value || (months.length > 0 ? months[months.length - 1] : null);
  let selectedMonthData = monthMap.get(selectedMonthKey) || { income: 0, totalExpense: 0, incomeByCategory: {} };

  // Atualizar cards de resumo
  reportsIncome.textContent = formatMoney(selectedMonthData.income);
  reportsExpense.textContent = formatMoney(selectedMonthData.totalExpense);
  reportsBalance.textContent = formatMoney(selectedMonthData.income - selectedMonthData.totalExpense);

  // Dados para gráficos de série temporal
  const incomeValues = months.map((m) => monthMap.get(m).income);
  const expenseValues = months.map((m) => monthMap.get(m).totalExpense);
  const balanceValues = months.map((m) => monthMap.get(m).income - monthMap.get(m).totalExpense);

  // Renderizar gráficos
  updateExpenseChart(labels, expenseValues);
  updateBalanceChart(labels, balanceValues);
  updateIncomeChart(selectedMonthData.incomeByCategory);
}

// Helper: Popular select de meses para reportes (agora usa generateFutureMonths)
function populateReportsMonthSelect(months) {
  reportsMonthSelect.innerHTML = "";
  months.forEach((m) => {
    const label = formatMonthName(m);
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = label;
    reportsMonthSelect.appendChild(opt);
  });
  // Selecionar mês atual
  const currentMonth = getMonthKey(todayStr());
  if (reportsMonthSelect.querySelector(`option[value="${currentMonth}"]`)) {
    reportsMonthSelect.value = currentMonth;
  }
}

// Gráfico de Gastos (variável conforme seleção)
function updateExpenseChart(labels, expenseValues) {
  if (expenseChart) expenseChart.destroy();
  const ctx = document.getElementById("expense-chart").getContext("2d");
  const chartType = expenseChartTypeSelect.value || "bar";

  const chartConfig = {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: "Gastos",
          data: expenseValues,
          borderColor: "#ef4444",
          backgroundColor: chartType === "line" ? "transparent" : "rgba(239, 68, 68, 0.7)",
          borderWidth: 2,
          tension: 0.4,
          fill: chartType === "area",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
      },
      scales: {
        x: { ticks: { color: "#e5e7eb" } },
        y: { ticks: { color: "#e5e7eb" } },
      },
    },
  };

  expenseChart = new Chart(ctx, chartConfig);
}

// Gráfico de Saldo (variável conforme seleção)
function updateBalanceChart(labels, balanceValues) {
  if (balanceChart) balanceChart.destroy();
  const ctx = document.getElementById("balance-chart").getContext("2d");
  const chartType = balanceChartTypeSelect.value || "line";

  const chartConfig = {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: "Saldo",
          data: balanceValues,
          borderColor: "#3b82f6",
          backgroundColor: chartType === "line" ? "transparent" : (chartType === "area" ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.7)"),
          borderWidth: 2,
          tension: 0.4,
          fill: chartType === "area",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
      },
      scales: {
        x: { ticks: { color: "#e5e7eb" } },
        y: { ticks: { color: "#e5e7eb" } },
      },
    },
  };

  balanceChart = new Chart(ctx, chartConfig);
}

// Gráfico de Entradas por Categoria (variável conforme seleção)
function updateIncomeChart(incomeByCategory) {
  if (incomeChart) incomeChart.destroy();
  const ctx = document.getElementById("income-chart").getContext("2d");
  const chartType = incomeChartTypeSelect.value || "bar";

  const categories = Object.keys(incomeByCategory);
  const values = Object.values(incomeByCategory);
  const totalIncome = values.reduce((sum, v) => sum + v, 0);

  // Atualizar total
  totalIncomeDisplay.textContent = formatMoney(totalIncome);

  // Cores para categorias (usar as cores do app)
  const colors = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
    "#10b981", "#06b6d4", "#6366f1", "#f97316"
  ];

  const chartConfig = {
    type: chartType,
    data: {
      labels: categories,
      datasets: [
        {
          label: "Entradas",
          data: values,
          borderColor: "#3b82f6",
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 2,
          tension: 0.4,
          fill: chartType === "area",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#e5e7eb" } },
      },
      scales: chartType === "pie" ? {} : {
        x: { ticks: { color: "#e5e7eb" } },
        y: { ticks: { color: "#e5e7eb" } },
      },
    },
  };

  incomeChart = new Chart(ctx, chartConfig);
}

// ------------------------------
// Settings render
// ------------------------------
function updateSettings() {
  setName.value = state.userProfile.name || "";
  setBirthdate.value = state.userProfile.birthdate || "";
  setIncome.value = state.incomeMonthly || "";
  setLimit.value = state.spendingLimit || "";

  setCategoryList.innerHTML = "";
  state.categories.forEach((c, idx) => {
    const li = document.createElement("li");
    li.textContent = c + " ";
    if (!defaultCategories.includes(c) || state.categories.length > defaultCategories.length) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "x";
      delBtn.onclick = () => {
        state.categories.splice(idx, 1);
        // Remover transações dessa categoria? Não, mantemos.
        saveState();
        populateCategoriesSelect();
        updateSettings();
        refreshAll();
      };
      li.appendChild(delBtn);
    }
    setCategoryList.appendChild(li);
  });
}

// ------------------------------
// Exportar em PDF
// ------------------------------
function exportToPDF() {
  const monthKey = dashMonthSelect.value || getMonthKey(todayStr());
  const [year, month] = monthKey.split("-");
  const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );

  // Criar conteúdo HTML para o PDF
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="text-align: center; color: #1a56db;">💰 Meu Financeiro</h1>
      <h2 style="text-align: center; color: #666;">Relatório de ${monthName.toUpperCase()}</h2>
      <hr style="margin: 20px 0;">

      <h3>📊 Resumo Financeiro</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Entradas:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #16a34a;"><strong>${dashIncome.textContent}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Saídas:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #dc2626;"><strong>${dashExpense.textContent}</strong></td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Resultado:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;"><strong>${dashBalance.textContent}</strong></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Limite de gastos:</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${formatMoney(state.spendingLimit)}</td>
        </tr>
      </table>

      <h3>📋 Extrato Detalhado</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #1a56db; color: white;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Data</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Tipo</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Categoria</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Descrição</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Valor</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Adicionar transações do mês
  const monthTransactions = state.transactions.filter((t) => getMonthKey(t.date) === monthKey);
  monthTransactions.forEach((t) => {
    const dateObj = new Date(t.date);
    const dateBR = dateObj.toLocaleDateString("pt-BR");
    const typeLabel = t.type === "income" ? "Entrada" : "Saída";
    const typeColor = t.type === "income" ? "#16a34a" : "#dc2626";
    const descFull = t.note ? `${t.category} - ${t.note}` : t.category;

    htmlContent += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${dateBR}</td>
        <td style="padding: 10px; border: 1px solid #ddd; color: ${typeColor}; font-weight: bold;">${typeLabel}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${t.category}</td>
        <td style="padding: 10px; border: 1px solid #ddd; font-size: 0.9em; color: #666;">${descFull}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: ${typeColor}; font-weight: bold;">${formatMoney(t.amount)}</td>
      </tr>
    `;
  });

  htmlContent += `
        </tbody>
      </table>
      <hr style="margin: 20px 0;">
      <p style="text-align: center; color: #999; font-size: 0.9em;">
        Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}
      </p>
    </div>
  `;

  // Gerar PDF
  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  const opt = {
    margin: 10,
    filename: `relatorio-financeiro-${monthKey}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  };

  html2pdf().set(opt).from(element).save();
}

// ------------------------------
// Função principal para re-renderizar
// ------------------------------
function refreshAll() {
  populateMonthSelects();
  updateDashboard();
  updateTransactionList();
  updateReports();
  updateSettings();
  updateGoals();
  updateHistoryFilter();
}

// ------------------------------
// Função para inicializar/resetar o formulário de transações
function initializeTransactionForm() {
  // Resetar para "income" como padrão
  document.querySelector("input[name='tx-type'][value='income']").checked = true;
  populateCategoriesSelect();
  
  // Mostrar campos de entrada (income fields)
  incomeFields.style.display = "block";
  paymentMethodLabel.textContent = "Meio de entrada (opcional)";
  installmentFields.style.display = "none";
  
  // Resetar subtipo de entrada para "variable"
  document.querySelector("input[name='income-subtype'][value='variable']").checked = true;
  fixedIncomeFields.style.display = "none";
  
  // Limpar campos
  txAmount.value = "";
  txNote.value = "";
  txDate.value = todayStr();
  txMethod.value = "";
  txIsGoalMovement.checked = false;
  txGoalSelect.style.display = "none";
  goalInfoDisplay.style.display = "none";
  
  // Resetar campos de contrato
  contractStartMonthInput.value = todayStr().slice(0, 7);
  contractEndMonthInput.value = "";
  document.querySelector("input[name='contract-duration'][value='indefinite']").checked = true;
  specificPeriodFields.style.display = "none";
}

// Listeners
// ------------------------------
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const screen = btn.dataset.screen;
    showScreen(screen);
    if (screen === "dashboard") updateDashboard();
    if (screen === "transactions") {
      initializeTransactionForm();
      updateTransactionList();
    }
    if (screen === "reports") updateReports();
    if (screen === "goals") updateGoals();
    if (screen === "settings") updateSettings();
  });
});

// Onboarding salvar
onbSaveBtn.addEventListener("click", () => {
  const income = parseFloat(onbIncome.value) || 0;
  const limit = parseFloat(onbLimit.value) || 0;

  state.incomeMonthly = income;
  state.spendingLimit = limit;
  state.categories = [...defaultCategories];

  saveState();
  screens.onboarding.classList.add("hidden");
  showScreen("dashboard");
  refreshAll();
});

// Botões flutuantes
addExpenseBtn.addEventListener("click", () => {
  showScreen("transactions");
  document.querySelector("input[name='tx-type'][value='expense']").checked =
    true;
  populateCategoriesSelect();
  incomeFields.style.display = "none";
  paymentMethodLabel.textContent = "Forma de pagamento (opcional)";
});

addIncomeBtn.addEventListener("click", () => {
  showScreen("transactions");
  document.querySelector("input[name='tx-type'][value='income']").checked =
    true;
  populateCategoriesSelect();
  incomeFields.style.display = "block";
  paymentMethodLabel.textContent = "Meio de entrada (opcional)";
});

// Tipo de transação (income/expense)
txTypeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    populateCategoriesSelect();
    const isIncome = radio.value === "income";
    
    if (isIncome) {
      incomeFields.style.display = "block";
      paymentMethodLabel.textContent = "Meio de entrada (opcional)";
      installmentFields.style.display = "none";
    } else {
      incomeFields.style.display = "none";
      paymentMethodLabel.textContent = "Forma de pagamento (opcional)";
      installmentFields.style.display = "block";
    }
  });
});

// Método de pagamento - mostrar parcelamento só para cartão
txMethod.addEventListener("change", () => {
  if (txMethod.value === "cartao") {
    installmentFields.style.display = "block";
  } else {
    installmentFields.style.display = "none";
    installmentDetails.style.display = "none";
    installmentInfo.style.display = "none";
  }
});

// Parcelamento - tipo (à vista/parcelado)
installmentTypeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "installment") {
      installmentDetails.style.display = "block";
      calculateInstallmentInfo();
    } else {
      installmentDetails.style.display = "none";
      installmentInfo.style.display = "none";
    }
  });
});

// Cálculo ao alterar parcelas ou juros
txInstallments.addEventListener("change", calculateInstallmentInfo);
txInterestRate.addEventListener("change", calculateInstallmentInfo);
txAmount.addEventListener("change", calculateInstallmentInfo);

// Subtipo de entrada (variável/fixa)
incomeSubtypeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "fixed") {
      fixedIncomeFields.style.display = "block";
      if (!contractStartMonthInput.value) {
        const baseDate = txDate.value || todayStr();
        contractStartMonthInput.value = baseDate.slice(0, 7);
      }
    } else {
      fixedIncomeFields.style.display = "none";
      contractStartMonthInput.value = "";
      contractEndMonthInput.value = "";
      document.querySelector("input[name='contract-duration'][value='indefinite']").checked = true;
      specificPeriodFields.style.display = "none";
    }
  });
});

// Duração do contrato (indefinido/específico)
contractDurationRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "specific") {
      specificPeriodFields.style.display = "block";
    } else {
      specificPeriodFields.style.display = "none";
      contractEndMonthInput.value = "";
    }
  });
});

// Toggle goal select visibility
txIsGoalMovement.addEventListener("change", () => {
  if (txIsGoalMovement.checked) {
    txGoalSelect.style.display = "block";
    goalInfoDisplay.style.display = "none";
    populateGoalSelect();
  } else {
    txGoalSelect.style.display = "none";
    goalInfoDisplay.style.display = "none";
    txGoalSelect.value = "";
  }
});

// Mostrar saldo quando selecionar uma meta
txGoalSelect.addEventListener("change", () => {
  if (txGoalSelect.value) {
    const selectedGoal = state.goals.find((g) => g.id === txGoalSelect.value);
    if (selectedGoal) {
      goalCurrentBalance.textContent = `R$ ${formatMoney(selectedGoal.savedAmount)}`;
      goalInfoDisplay.style.display = "block";
    }
  } else {
    goalInfoDisplay.style.display = "none";
  }
});

// Salvar transação
txSaveBtn.addEventListener("click", () => {
  const type = Array.from(txTypeRadios).find((r) => r.checked).value;
  const amount = parseFloat(txAmount.value);
  if (!amount || amount <= 0) {
    alert("Informe um valor válido.");
    return;
  }
  const category = txCategory.value;
  const method = txMethod.value;
  const note = txNote.value.trim();

  // Campos específicos para entrada fixa
  let incomeSubtype = null;
  let contractStartMonth = null;
  let contractEndMonth = null;
  let contractDuration = null;

  if (type === "income") {
    incomeSubtype = Array.from(incomeSubtypeRadios).find((r) => r.checked).value;
    if (incomeSubtype === "fixed") {
      contractDuration = Array.from(contractDurationRadios).find((r) => r.checked).value;
      contractStartMonth = contractStartMonthInput.value;
      if (!contractStartMonth) {
        alert("Informe o mês de início do contrato.");
        return;
      }

      if (contractDuration === "specific") {
        contractEndMonth = contractEndMonthInput.value;
        if (!contractEndMonth) {
          alert("Informe o mês de término do contrato.");
          return;
        }
        if (contractEndMonth < contractStartMonth) {
          alert("O mês de término deve ser igual ou posterior ao mês de início.");
          return;
        }
      } else {
        contractEndMonth = null;
      }
    }
  }
  const date =
    type === "income" && incomeSubtype === "fixed" && contractStartMonth
      ? `${contractStartMonth}-01`
      : txDate.value || todayStr();

  // Dados de parcelamento (se houver)
  let installments = null;
  let interestRate = null;
  if (type === "expense" && txMethod.value === "cartao") {
    const installmentType = Array.from(installmentTypeRadios).find((r) => r.checked)?.value;
    if (installmentType === "installment") {
      installments = parseInt(txInstallments.value) || 1;
      interestRate = parseFloat(txInterestRate.value) || 0;
    }
  }

  // Capturar associação com meta, se houver
  let goalId = null;
  if (txIsGoalMovement.checked && txGoalSelect.value) {
    goalId = txGoalSelect.value;
  }

  const txId = Date.now();
  state.transactions.push({
    id: txId,
    type,
    amount,
    category,
    method,
    date,
    note,
    incomeSubtype,
    contractDuration,
    contractStartMonth,
    contractEndMonth,
    installments,
    interestRate,
    goalId,
  });

  // Se a transação está associada a uma meta, atualizar a meta
  if (goalId) {
    const goal = state.goals.find((g) => g.id === goalId);
    if (goal) {
      // Inicializar array de movimentos se não existir
      if (!goal.movements) {
        goal.movements = [];
      }

      // Determinar tipo de movimento (depósito ou saque)
      const movementType = type === "income" ? "deposit" : "withdrawal";
      
      // Validar saque (não permitir saque maior que saldo disponível)
      if (movementType === "withdrawal" && goal.savedAmount < amount) {
        alert(`⚠️ Saldo insuficiente! Meta tem R$ ${formatMoney(goal.savedAmount)} disponível.`);
        state.transactions.pop(); // Remover transação adicionada
        return;
      }

      // Atualizar saldo da meta
      if (movementType === "deposit") {
        goal.savedAmount += amount;
      } else {
        goal.savedAmount -= amount;
      }

      // Registrar movimento no histórico
      goal.movements.push({
        id: Date.now(),
        date,
        amount,
        type: movementType,
        description: note || category,
        transactionId: txId,
      });
    }
  }

  // Limpar formulário
  txAmount.value = "";
  txNote.value = "";
  contractStartMonthInput.value = "";
  contractEndMonthInput.value = "";
  document.querySelector("input[name='contract-duration'][value='indefinite']").checked = true;
  specificPeriodFields.style.display = "none";
  txInstallments.value = "2";
  txInterestRate.value = "0";
  document.querySelector("input[name='installment-type'][value='cash']").checked = true;
  installmentDetails.style.display = "none";
  installmentInfo.style.display = "none";
  txIsGoalMovement.checked = false;
  txGoalSelect.style.display = "none";
  txGoalSelect.value = "";
  goalInfoDisplay.style.display = "none";

  saveState();
  populateMonthSelects();
  updateDashboard();
  updateTransactionList();
  updateReports();
  updateGoals();
  updateHistoryFilter();
  updateGoalHistory();
});

// Filtros de transações
txMonthFilter.addEventListener("change", updateTransactionList);
txTypeFilter.addEventListener("change", updateTransactionList);
dashMonthSelect.addEventListener("change", updateDashboard);

// Event listeners para relatórios
reportsMonthSelect.addEventListener("change", updateReports);
expenseChartTypeSelect.addEventListener("change", updateReports);
balanceChartTypeSelect.addEventListener("change", updateReports);
incomeChartTypeSelect.addEventListener("change", updateReports);

// Exportar em PDF
const exportPdfBtn = document.getElementById("export-pdf-btn");
if (exportPdfBtn) {
  exportPdfBtn.addEventListener("click", () => {
    if (state.transactions.length === 0) {
      alert("Nenhuma transação para exportar.");
      return;
    }
    exportToPDF();
  });
}

// Settings salvar renda/limite
setSaveBtn.addEventListener("click", () => {
  state.userProfile.name = setName.value.trim();
  state.userProfile.birthdate = setBirthdate.value;
  state.incomeMonthly = parseFloat(setIncome.value) || 0;
  state.spendingLimit = parseFloat(setLimit.value) || 0;
  saveState();
  refreshAll();
  alert("Configurações salvas!");
});

// Adicionar categoria
setCategoryAddBtn.addEventListener("click", () => {
  const name = setCategoryNew.value.trim();
  if (!name) return;
  if (!state.categories.includes(name)) {
    state.categories.push(name);
    saveState();
    setCategoryNew.value = "";
    populateCategoriesSelect();
    updateSettings();
  }
});

// Salvar meta
goalSaveBtn.addEventListener("click", () => {
  const name = goalName.value.trim();
  const date = goalDate.value;
  const amount = parseFloat(goalAmount.value);
  const saved = parseFloat(goalSaved.value) || 0;
  const frequency = goalFrequency.value;

  if (!name || !date || !amount || amount <= 0) {
    alert("Preencha todos os campos obrigatórios (nome, data, valor alvo).");
    return;
  }

  const editId = goalSaveBtn.dataset.editId;
  if (editId) {
    // Editar meta existente
    const goalIndex = state.goals.findIndex((g) => g.id == editId);
    if (goalIndex >= 0) {
      const existingGoal = state.goals[goalIndex];
      state.goals[goalIndex] = {
        id: editId,
        name,
        date,
        targetAmount: amount,
        savedAmount: saved,
        frequency,
        movements: existingGoal.movements || [], // Preservar histórico de movimentos
      };
    }
    goalSaveBtn.dataset.editId = "";
    goalSaveBtn.textContent = "💾 Salvar meta";
  } else {
    // Criar nova meta
    state.goals.push({
      id: Date.now(),
      name,
      date,
      targetAmount: amount,
      savedAmount: saved,
      frequency,
      movements: [], // Inicializar array vazio de movimentos
    });
  }

  goalName.value = "";
  goalDate.value = "";
  goalAmount.value = "";
  goalSaved.value = "";
  goalFrequency.value = "";

  saveState();
  updateGoals();
  updateHistoryFilter();
});

// ------------------------------
// Boot
// ------------------------------
function init() {
  loadState();
  renderOnboarding();
  populateCategoriesSelect();
  txDate.value = todayStr();

  if (state.incomeMonthly && state.spendingLimit) {
    screens.onboarding.classList.add("hidden");
    showScreen("dashboard");
    refreshAll();
  } else {
    showScreen("onboarding");
  }
}

init();

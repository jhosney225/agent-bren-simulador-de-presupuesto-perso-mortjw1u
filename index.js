```javascript
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class BudgetSimulator {
  constructor() {
    this.income = 0;
    this.expenses = {};
    this.savings = 0;
    this.categories = {
      'alimentación': 0,
      'transporte': 0,
      'vivienda': 0,
      'entretenimiento': 0,
      'utilities': 0,
      'salud': 0,
      'educación': 0,
      'otros': 0
    };
  }

  setIncome(amount) {
    if (amount <= 0) {
      console.log('❌ El ingreso debe ser mayor a 0');
      return false;
    }
    this.income = amount;
    console.log(`✅ Ingreso mensual establecido: $${amount.toFixed(2)}`);
    return true;
  }

  addExpense(category, amount) {
    if (!this.categories.hasOwnProperty(category)) {
      console.log(`❌ Categoría no válida. Categorías disponibles: ${Object.keys(this.categories).join(', ')}`);
      return false;
    }
    if (amount <= 0) {
      console.log('❌ El gasto debe ser mayor a 0');
      return false;
    }
    this.categories[category] += amount;
    console.log(`✅ Gasto agregado: $${amount.toFixed(2)} en ${category}`);
    return true;
  }

  getTotalExpenses() {
    return Object.values(this.categories).reduce((sum, amount) => sum + amount, 0);
  }

  calculateBalance() {
    const totalExpenses = this.getTotalExpenses();
    const balance = this.income - totalExpenses;
    return balance;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE PRESUPUESTO MENSUAL');
    console.log('='.repeat(60));
    
    console.log(`\n💰 INGRESOS:`);
    console.log(`   Total: $${this.income.toFixed(2)}`);
    
    console.log(`\n📉 GASTOS POR CATEGORÍA:`);
    const totalExpenses = this.getTotalExpenses();
    
    Object.entries(this.categories).forEach(([category, amount]) => {
      if (amount > 0) {
        const percentage = ((amount / this.income) * 100).toFixed(1);
        const bar = '█'.repeat(Math.floor(percentage / 2));
        console.log(`   ${category.padEnd(15)}: $${amount.toFixed(2).padStart(10)} (${percentage}%) ${bar}`);
      }
    });
    
    console.log(`\n   TOTAL GASTOS: $${totalExpenses.toFixed(2)}`);
    
    const balance = this.calculateBalance();
    const status = balance >= 0 ? '✅ SUPERÁVIT' : '❌ DÉFICIT';
    console.log(`\n💵 BALANCE FINAL: $${balance.toFixed(2)} ${status}`);
    
    const savingsPercentage = ((balance / this.income) * 100).toFixed(1);
    console.log(`   Ahorro potencial: ${savingsPercentage}% del ingreso`);
    
    const expensePercentage = ((totalExpenses / this.income) * 100).toFixed(1);
    console.log(`   Gasto total: ${expensePercentage}% del ingreso`);
    
    console.log('\n' + '='.repeat(60) + '\n');
  }

  resetBudget() {
    this.income = 0;
    this.categories = {
      'alimentación': 0,
      'transporte': 0,
      'vivienda': 0,
      'entretenimiento': 0,
      'utilities': 0,
      'salud': 0,
      'educación': 0,
      'otros': 0
    };
    console.log('✅ Presupuesto reiniciado');
  }
}

const budget = new BudgetSimulator();

function showMenu() {
  console.log('\n' + '-'.repeat(60));
  console.log('🏠 SIMULADOR DE PRESUPUESTO PERSONAL MENSUAL');
  console.log('-'.repeat(60));
  console.log('1. Establecer ingreso mensual');
  console.log('2. Agregar gasto');
  console.log('3. Ver reporte');
  console.log('4. Mostrar categorías disponibles');
  console.log('5. Reiniciar presupuesto');
  console.log('6. Salir');
  console.log('-'.repeat(60));
}

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('\n🎯 ¡Bienvenido al Simulador de Presupuesto Personal!');
  console.log('Gestiona tus gastos mensuales de manera eficiente.\n');

  let running = true;

  while (running) {
    showMenu();
    const choice = await askQuestion('\n👉 Selecciona una opción (1-6): ');

    switch (choice.trim()) {
      case '1':
        const income = parseFloat(await askQuestion('Ingresa tu ingreso mensual: $'));
        if (!isNaN(income)) {
          budget.setIncome(income);
        } else {
          console.log('❌ Por favor ingresa un número válido');
        }
        break;

      case '2':
        if (budget.income === 0
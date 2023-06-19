// Grab elements functions
const selectElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(
    `Something went wrong! Make sure that ${selector} exists/is typed correctly.`
  );
};

const selectAllElements = (selector) => {
  const element = document.querySelectorAll(selector);
  if (element) return element;
  throw new Error(
    `Something went wrong! Make sure that ${selector} exists/is typed correctly.`
  );
};

class UI {
  constructor() {
    this.budgetFeedback = selectElement(".budget-feedback");
    this.expenseFeedback = selectElement(".expense-feedback");
    this.budgetForm = selectElement("#budget-form");
    this.budgetInput = selectElement("#budget-input");
    this.budgetAmount = selectElement("#budget-amount");
    this.expenseAmount = selectElement("#expense-amount");
    this.balance = selectElement("#balance");
    this.balanceAmount = selectElement("#balance-amount");
    this.expenseForm = selectElement("#expense-form");
    this.expenseInput = selectElement("#expense-input");
    this.amountInput = selectElement("#amount-input");
    this.expenseList = selectElement("#expense-list");
    this.itemList = [];
    this.itemID = 0;
  }

  //submit budget method
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;
      console.log(this);
      const self = this;
      setTimeout(() => {
        self.budgetFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = "";
      this.showBalance();
    }
  }

  //show balance
  showBalance() {
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent) - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "showGreen");
      this.balance.classList.add("showBlack");
    }
  }

  //submit expense form
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = `<p>values cannot be empty or negative</p>`;
      const self = this;
      setTimeout(() => {
        self.expenseFeedback.classList.remove("showItem");
      }, 3000);
    } else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";

      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount,
      };
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }

  //add expense
  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `<div class="expense-item d-flex justify-content-between align-items-baseline">

    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">$${expense.amount}</h5>
  
      <div class="expense-icons list-item">
  
        <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
          <i class="fas fa-edit"></i>
        </a>
        <a href="#" class="delete-icon" data-id="${expense.id}">
          <i class="fas fa-trash"></i>
        </a>
      </div>
    </div>`;
    this.expenseList.appendChild(div);
  }

  //total expense
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) => {
        acc += curr.amount;
        return acc;
      }, 0);
    }
    this.expenseAmount.textContent = total;
    return total;
  }

  //Edit expense
  editExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    console.log(parent);
    //remove from DOM
    this.expenseList.removeChild(parent);
    //remove from the list
    let expense = this.itemList.filter((item) => {
      return item.id === id;
    });
    //show values
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from the list
    let tempList = this.itemList.filter((item) => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }

  //delete expense
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);
    //remove from the list
    let tempList = this.itemList.filter((item) => {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

const eventListeners = () =>{
  const budgetForm = selectElement('#budget-form');
  const expenseForm = selectElement('#expense-form');
  const expenseList = selectElement('#expense-list');

  //new instance of UI Class
  const ui = new UI();

  //budget form submit 
  budgetForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    ui.submitBudgetForm();
  })

  //expense form submit
  expenseForm.addEventListener('submit', (event) =>{
    event.preventDefault();
    ui.submitExpenseForm();
  })

  //expense list submit
  expenseList.addEventListener('click', (event)=>{
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement);
    } else if (event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);
    }
  })
}

document.addEventListener('DOMContentLoaded', ()=>{
  eventListeners();
})
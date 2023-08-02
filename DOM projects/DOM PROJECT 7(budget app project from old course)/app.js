'use strict';

/* User Stories-: 1-: i want my net income displayed on top
                   2-: i want my total income and expenses(with percentage of total income) 
                   3-: and individual income and expense(with percentage of total income) after each enty.      
                   4-: i should be able to delete individual income and expense.
                      */
/* Features-: 1-: There should be different data structures to hold value of total income/expenses and individual income/expenses
             2-: There should be a button to define wether the enetered amount is a expense or income
             3-: a textbox to define the decription of income/expense  
             4-: a delete button on each income/expense 
             5-: date on the top of net income.*/

/*note-:  */

const inputType = document.querySelector('.add__type');
const description = document.querySelector('.add__description');
const amount = document.querySelector('.add__value');
const submitBtn = document.querySelector('.add__btn');

const budgetController = (function () {
  const data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  class Parent {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  const calculateTotal = function (type) {
    data.totals[type] = data.allItems[type].reduce(
      (acc, curr) => acc + Number(curr.value),
      0
    );
  };

  class Expense extends Parent {
    percentage = -1;

    calculatePercentage(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / data.totals.inc) * 100);
      } else {
        this.percentage = -1;
      }
    }

    getPercentage() {
      return this.percentage;
    }
  }

  class Income extends Parent {}

  return {
    addItem(type, description, value) {
      let newItem, id;
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1; // data.allItems[type][data.allItems[type].length - 1].id => this will give the id of the last element in the array than just add "1" to it.
      } else id = 0;

      if (type === 'inc') {
        newItem = new Income(id, description, value);
      }
      if (type === 'exp') {
        newItem = new Expense(id, description, value);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },

    calculateBudget() {
      calculateTotal('inc');
      calculateTotal('exp');

      data.budget = data.totals.inc - data.totals.exp;

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget() {
      return data;
    },
    calculatePercentages() {
      data.allItems.exp.forEach(curr =>
        curr.calculatePercentage(data.totals.inc)
      );
    },

    getPercentages() {
      const allPercentages = data.allItems.exp.map(curr =>
        curr.getPercentage()
      );
      return allPercentages;
    },
    deleteItem(id, type) {
      const index = data.allItems[type].findIndex(curr => curr.id === id);

      if (index) data.allItems[type].splice(index, 1);
    },
  };
})();

const UIController = (function () {
  // Format Numbber
  const formatNumber = function (num, type) {
    // + or - sign
    // "," after every 3 digits
    // only 2 decimal digits

    num = Math.abs(num);
    num = num.toFixed(2);

    const numSplit = num.split('.');
    const decimal = numSplit[1];
    let int = numSplit[0];
    if (int.length > 3) {
      int = `${int.slice(0, 3)},${int.slice(3)} `;
    }
    return `${type === 'inc' ? '+' : '-'} ${int}.${decimal}`;
  };

  return {
    addListItem(obj) {
      let html, element;
      if (inputType.value === 'inc') {
        element = '.income__list';
        html = `
                                        <div class="item clearfix" id="income-${
                                          obj.id
                                        }">
                                            <div class="item__description">${
                                              description.value
                                            }</div>
                                            <div class="right clearfix">
                                                <div class="item__value">+ ${(+amount.value).toFixed(
                                                  2
                                                )}</div>
                                                <div class="item__delete">
                                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                                </div>
                                            </div>
                                        </div>`;
      }
      if (inputType.value === 'exp') {
        element = '.expenses__list';
        html = `
                            <div class="item clearfix" id="expense-${obj.id}">
                                <div class="item__description">${
                                  description.value
                                }</div>
                                    <div class="right clearfix">
                                    <div class="item__value">- ${(+amount.value).toFixed(
                                      2
                                    )}</div>
                                    <div class="item__percentage">21%</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                    </div>
                                </div>
                            </div>`;
      }
      document.querySelector(element).insertAdjacentHTML('beforeend', html);
    },

    deleteListItem(SelectorId) {
      document.getElementById(SelectorId).remove();
    },

    clearInputFields() {
      description.value = amount.value = '';
      description.focus();
    },

    displayBudget(obj) {
      const type = obj.budget > 0 ? 'inc' : 'exp';

      document.querySelector('.budget__value').textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector('.budget__income--value').textContent =
        formatNumber(obj.totals.inc, 'inc');
      document.querySelector('.budget__expenses--value').textContent =
        formatNumber(obj.totals.exp, 'exp');

      // (v.v.imp.) NOTE-:  we have passed 'inc' & 'exp' directly into formatNumber method cause, type variable is set according to budget(which is net result) not according to individual income & expenses.

      if (obj.percentage > 0) {
        document.querySelector(
          '.budget__expenses--percentage'
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector('.budget__expenses--percentage').textContent =
          '---';
      }
    },

    // displayPercentage(obj) {
    //   if (inputType.value === 'exp') {
    //     if (obj.percentage > 0) {
    //       document.querySelector(
    //         '.item__percentage'
    //       ).textContent = `${obj.percentage}%`;
    //     } else {
    //       document.querySelector('.item__percentage').textContent = '----';
    //     }
    //   }
    // },

    // (v.v.imp.) NOTE-: we have passed percentages array in displayPercentage() method because if we would have added an expense in the starting and just after we add an income than in that case previous expense percentage will not get updated because we are passing the latest object(which is income).

    displayPercentage(percentages) {
      const fields = document.querySelectorAll('.item__percentage');

      fields.forEach((curr, i) => {
        if (percentages[i] > 0) {
          curr.textContent = `${percentages[i]}%`;
        } else {
          curr.textContent = '---';
        }
      });
    },

    changedType() {
      document.querySelector('.add__type').classList.toggle('red-focus');
      document.querySelector('.add__description').classList.toggle('red-focus');
      document.querySelector('.add__value').classList.toggle('red-focus');
      document.querySelector('.add__btn').classList.toggle('red');
    },

    displayDate() {
      // prettier-ignore
      const months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      const date = new Date();
      console.log(date.getMonth());
      document.querySelector('.budget__title--month').textContent = `${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    },
  };
})();

const controller = (function (budgetCtrl, UIctrl) {
  const setupEventListeners = function () {
    submitBtn.addEventListener('click', ctrlAddItem);

    amount.addEventListener('keypress', function (e) {
      if (e.code === 'Enter') {
        ctrlAddItem();
      }
    });

    inputType.addEventListener('change', UIctrl.changedType);

    document
      .querySelector('.container')
      .addEventListener('click', ctrlDeleteItem);
  };

  // update Budget
  const updateBudget = function () {
    // claculate budget
    budgetCtrl.calculateBudget();

    //return budget
    const budget = budgetCtrl.getBudget();

    // display budget
    UIctrl.displayBudget(budget);
  };

  // update percentage
  const updatePercentage = function (obj) {
    // calculate percentage
    budgetCtrl.calculatePercentages();

    // get percentages
    const allPercentages = budgetCtrl.getPercentages();

    // display percentages
    UIctrl.displayPercentage(allPercentages);
  };

  // add Item to UI
  const ctrlAddItem = function () {
    // check if data is valid
    if (!(Number.isFinite(+amount.value) && +amount.value > 0)) return;
    const newItem = budgetCtrl.addItem(
      inputType.value,
      description.value,
      amount.value
    );

    // display item
    UIctrl.addListItem(newItem);

    // clear input fields
    UIctrl.clearInputFields();

    // update Budget
    updateBudget();

    // update percentage
    updatePercentage();
  };

  const ctrlDeleteItem = function (e) {
    // console.log(e.target.closest('.item').id);

    const originalId = e.target.closest('.item').id;
    if (originalId) {
      const id = originalId.slice(-1);
      const type = originalId.slice(0, 3);

      // delete Item from UI and data structure
      UIctrl.deleteListItem(originalId);
      budgetCtrl.deleteItem(id, type);

      // update budget
      updateBudget();

      // update percentages
      updatePercentage();
    }
  };

  return {
    init() {
      UIctrl.displayDate();

      UIctrl.displayBudget({
        budget: 0,
        totals: {
          inc: 0,
          exp: 0,
        },
      });

      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();

// start from delete Item

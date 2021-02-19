class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.currentOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation = 0;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break
      case '-':
        computation = prev - current;
        break
      case '∗':
        computation = prev * current;
        break
      case '÷':
        computation = prev / current;
        break
      case '^':
          computation = (Math.pow(prev, current))
        break
      case '√':
        if (prev >= 0) {
          computation = Math.sqrt(prev)
        } else {
          computation = 'error'
        }
        break
      default:
        return;
    }
    this.readyToReset = true;
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    if (number === 'error') {
      return 'error'
    }
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 }).replace(/,/g, '')
    }
    if (decimalDigits != null) {
      let result = (parseFloat(`${integerDisplay}.${decimalDigits}`)).toFixed(8)
      return `${result}`.indexOf('.') > 0 ? result.replace(/0+$/, '') : result
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    if (this.previousOperand === 0) {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(-this.currentOperand)
    } else {
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
    }
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
let previousOperation = ''

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (calculator.previousOperand === '-' && calculator.currentOperand == false || calculator.currentOperand === undefined) {
      calculator.appendNumber(-button.innerText)
      calculator.updateDisplay();
      calculator.previousOperand = -button.innerText
      return;
    }
    if (calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay();
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (calculator.currentOperand === '-') {
      if (calculator.operation === '÷') {
        calculator.currentOperand = -1
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
      } else {
        calculator.currentOperand = 0
      }
      
    }
    if (button.innerText === '√') {
      if(calculator.previousOperand !== 0) {
        calculator.currentOperand = Math.sqrt(calculator.currentOperand)
        calculator.updateDisplay()
        return
      } else {
        calculator.updateDisplay()
        calculator.currentOperandTextElement.innerText = 'error'
        return
    }
  }
  
    
    if (calculator.previousOperand === "" &&
      calculator.currentOperand !== "" &&
      calculator.readyToReset) {
      calculator.currentOperand = "";
      calculator.readyToReset = false;
    }
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
})

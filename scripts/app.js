function formatCurrency(n) {
    return Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n)
}

const navLinks = document.querySelectorAll('.navigation__link')
const calcElems = document.querySelectorAll('.calc')

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', (e) => {
        e.preventDefault()
        for (let j = 0; j < calcElems.length; j++) {
            if (navLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                calcElems[j].classList.add('calc_active')
                navLinks[j].classList.add('navigation__link_active')
            }
            else {
                calcElems[j].classList.remove('calc_active')
                navLinks[j].classList.remove('navigation__link_active')
            }
        }
    })
}

const ausn = document.querySelector('.ausn')
const formAusn = ausn.querySelector('.calc__form')
const resTaxTotalAusn = ausn.querySelector('.result__tax_total')
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses')

calcLabelExpenses.style.display = 'none'

formAusn.addEventListener('input', () => {
    if (formAusn.type.value == 'income') {
        calcLabelExpenses.style.display = 'none'
        resTaxTotalAusn.textContent = formatCurrency(formAusn.income.value * 0.08)
    }
    if (formAusn.type.value == 'expenses') {
        calcLabelExpenses.style.display = 'block'
        resTaxTotalAusn.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2)
    }
})

const selfEmployment = document.querySelector('.self-employment')
const formSelfEmloyment = selfEmployment.querySelector('.calc__form')
const resTaxTotalSelf = selfEmployment.querySelector('.result__tax')
const calcCompensation = selfEmployment.querySelector('.calc__label_compensation')
const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation')
const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation')
const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation')
const resultTaxResual = selfEmployment.querySelector('.result__tax_resualt')

function checkCompensation() {
    const setDisplay = formSelfEmloyment.addCompensation.checked ? 'block' : 'none'
    calcCompensation.style.display = setDisplay
    resultBlockCompensation.forEach((elem) => {
        elem.style.display = setDisplay
    })
}

checkCompensation()

formSelfEmloyment.addEventListener('input', () => {
    const resA = formSelfEmloyment.a.value * 0.04
    const resB = formSelfEmloyment.b.value * 0.06
    checkCompensation()
    const tax = resA + resB
    formSelfEmloyment.compensation.value = formSelfEmloyment.compensation.value > 10000 ? 10000 : formSelfEmloyment.compensation.value
    const benefit = formSelfEmloyment.compensation.value
    const resBenefit = formSelfEmloyment.a.value * 0.01 + formSelfEmloyment.b.value * 0.02
    const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0
    const finalTax = tax - (benefit - finalBenefit)
    resTaxTotalSelf.textContent = formatCurrency(tax)
    resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit)
    resultTaxRestCompensation.textContent = formatCurrency(finalBenefit)
    resultTaxResual.textContent = formatCurrency(finalTax)
})

const osno = document.querySelector('.osno')
const formOsno = osno.querySelector('.calc__form')
const resTaxTotalOsno = osno.querySelector('.result__tax')
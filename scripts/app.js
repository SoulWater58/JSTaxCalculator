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
        resTaxTotalAusn.textContent = formAusn.income.value * 0.08
    }
    if (formAusn.type.value == 'expenses') {
        calcLabelExpenses.style.display = 'block'
        resTaxTotalAusn.textContent = (formAusn.income.value - formAusn.expenses.value) * 0.2
    }
})

const selfEmployment = document.querySelector('.self-employment')
const formSelfEmloyment = selfEmployment.querySelector('.calc__form')
const resTaxTotalSelf = selfEmployment.querySelector('.result__tax_total')

formSelfEmloyment.addEventListener('input', () => {
    if (formSelfEmloyment.a.value != 0) {
        resTaxTotalSelf.textContent = formSelfEmloyment.a.value * 0.04
    }
    if (formSelfEmloyment.b.value != 0) {
        resTaxTotalSelf.textContent = formSelfEmloyment.b.value * 0.06
    }
    if (formSelfEmloyment.a.value != 0 && formSelfEmloyment.b.value != 0) {
        resTaxTotalSelf.textContent = (formSelfEmloyment.a.value * 0.04) + (formSelfEmloyment.b.value * 0.06)
    }
})
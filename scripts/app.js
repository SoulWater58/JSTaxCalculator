function formatCurrency(n) {
    return Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n)
}

function debounceTimer(fn, msec) {
    let lastCall = 0
    let lastCallTimer = NaN

    return (...arg) => {
        const previousCall = lastCall
        lastCall = Date.now()

        if (previousCall && ((lastCall - previousCall) <= msec)) {
            clearTimeout(lastCallTimer)
        }

        lastCallTimer = setTimeout(() => {
            fn(...arg)
        }, msec)
    }
}

// навигация
{
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
}

// АУСН
{
    const ausn = document.querySelector('.ausn')
    const formAusn = ausn.querySelector('.calc__form')
    const resTaxTotalAusn = ausn.querySelector('.result__tax_total')
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses')

    calcLabelExpenses.style.display = 'none'

    formAusn.addEventListener('input', debounceTimer(() => {
        if (formAusn.type.value == 'income') {
            calcLabelExpenses.style.display = 'none'
            resTaxTotalAusn.textContent = formatCurrency(formAusn.income.value * 0.08)
        }
        if (formAusn.type.value == 'expenses') {
            calcLabelExpenses.style.display = 'block'
            resTaxTotalAusn.textContent = formatCurrency(((formAusn.income.value - formAusn.expenses.value) * 0.2)  < 0 ? 0 : ((formAusn.income.value - formAusn.expenses.value) * 0.2))
        }
    }, 500))
}

// Самозанятый
{
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

    formSelfEmloyment.addEventListener('input', debounceTimer(() => {
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
    }, 500))
}

// ОСНО
{
    const osno = document.querySelector('.osno')
    const formOsno = osno.querySelector('.calc__form')

    const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses')
    const ndflIncome = osno.querySelector('.result__block_ndfl-income')
    const profit = osno.querySelector('.result__block_profit')

    const resultTaxNds = osno.querySelector('.result__tax_nds')
    const resultTaxProperty = osno.querySelector('.result__tax_property')
    const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses')
    const resultTaxNdfIncome = osno.querySelector('.result__tax_ndfl-income')
    const resultTaxProfit = osno.querySelector('.result__tax_profit')

    function checkFromBuisness() {
        if (formOsno.formBuisness.value === 'ip') {
            ndflExpenses.style.display = ''
            ndflIncome.style.display = ''
            profit.style.display = 'none'
        }
        if (formOsno.formBuisness.value === 'ooo') {
            ndflExpenses.style.display = 'none'
            ndflIncome.style.display = 'none'
            profit.style.display = ''
        }
    }

    formOsno.addEventListener('input', debounceTimer(() => {
        checkFromBuisness()
        const income = formOsno.income.value
        const expenses = formOsno.expenses.value
        const property = formOsno.property.value

        const nds = income * 0.2
        const taxProperty = property * 0.02
        const profit = income - expenses
        const ndflExpensesTotal = profit * 0.13
        const ndflIncomeTotal = (income - nds) * 0.13
        const taxProfit = profit * 0.2
        
        resultTaxNds.textContent = formatCurrency(nds)
        resultTaxProperty.textContent = formatCurrency(taxProperty)
        resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal)
        resultTaxNdfIncome.textContent = formatCurrency(ndflIncomeTotal)
        resultTaxProfit.textContent = formatCurrency(taxProfit)

        if (ndflExpensesTotal < 0) {
            resultTaxNdflExpenses.textContent = formatCurrency(0)
        }
        if (taxProfit < 0) {
            resultTaxProfit.textContent = formatCurrency(0)
        }
    }, 500))

    // const resultBlockCompensationOsno = osno.querySelectorAll('.result__block_compensation')
    // const radBtn = formOsno.querySelectorAll('.calc__radio')
    // formOsno.addEventListener('input', () => {
    //     if (radBtn[0].checked) {
    //         resultBlockCompensationOsno[2].style.display = 'none'
    //         resultBlockCompensationOsno[0].style.display = 'block'
    //         resultBlockCompensationOsno[1].style.display = 'block'
    //     }
    //     if (radBtn[1].checked) {
    //         resultBlockCompensationOsno[0].style.display = 'none'
    //         resultBlockCompensationOsno[1].style.display = 'none'
    //         resultBlockCompensationOsno[2].style.display = 'block'
    //     }
    // })
}

// УСН
{
    const LIMIT = 300000
    const usn = document.querySelector('.usn')
    const formUsn = usn.querySelector('.calc__form')

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses')
    const calcLabelProperty = usn.querySelector('.calc__label_property')
    const resultBlockProperty = usn.querySelector('.result__block_property')
    const resultTaxTotal = usn.querySelector('.result__tax_total')
    const resultTaxProperty = usn.querySelector('.result__tax_property')

    // function checkShopProprty(typeTax) {
    //     switch(typeTax) {
    //         case 'income': {
    //             calcLabelExpenses.style.display = 'none'
    //             calcLabelProperty.style.display = 'none'
    //             resultBlockProperty.style.display = 'none'

    //             formUsn.expenses.value = ''
    //             formUsn.property.value = ''
    //             break
    //         }
    //         case 'ip-expenses': {
    //             calcLabelExpenses.style.display = ''
    //             calcLabelProperty.style.display = 'none'
    //             resultBlockProperty.style.display = 'none'
    //             formUsn.property.value = ''
    //             break
    //         }
    //         case 'ooo-expenses': {
    //             calcLabelExpenses.style.display = ''
    //             calcLabelProperty.style.display = ''
    //             resultBlockProperty.style.display = ''
    //             break
    //         }
    //     }
    // }

    const typeTax = {
        'income': () => {
            calcLabelExpenses.style.display = 'none'
            calcLabelProperty.style.display = 'none'
            resultBlockProperty.style.display = 'none'
            formUsn.expenses.value = ''
            formUsn.property.value = ''
        },
        'ip-expenses': () => {
            calcLabelExpenses.style.display = ''
            calcLabelProperty.style.display = 'none'
            resultBlockProperty.style.display = 'none'
            formUsn.property.value = ''
        },
        'ooo-expenses': () => {
            calcLabelExpenses.style.display = ''
            calcLabelProperty.style.display = ''
            resultBlockProperty.style.display = ''
        },
    }

    const percent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }

    formUsn.addEventListener('input', debounceTimer(() => {
        // checkShopProprty(formUsn.typeTax.value)
        typeTax[formUsn.typeTax.value]()
        const income = formUsn.income.value
        const expenses = formUsn.expenses.value
        const contributions = formUsn.contributions.value
        const property = formUsn.property.value

        let profit = income - contributions

        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses
        }

        const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0
        const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome)
        const tax = summ * percent[formUsn.typeTax.value]
        const taxProperty = property * 0.02

        resultTaxTotal.textContent = formatCurrency(tax)
        resultTaxProperty.textContent = formatCurrency(taxProperty)

        if (tax < 0) {
            resultTaxTotal.textContent = formatCurrency(0)
        }
    }, 500))
}

// налоговый вычет
{
    const taxReturn = document.querySelector('.tax-return')
    const formTaxReturn = taxReturn.querySelector('.calc__form')

    const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl')
    const resultTaxProfitDesired = taxReturn.querySelector('.result__tax_profit-desired') // posible
    const resultTaxProfit = taxReturn.querySelector('.result__tax_profit') // deduction

    formTaxReturn.addEventListener('input', debounceTimer(() => {
        const a = +formTaxReturn.a.value // expenses
        const b = +formTaxReturn.b.value // income
        const sumExpenses = +formTaxReturn.sumExpenses.value

        const ndfl = b * 0.13
        const desiredProfit = a < sumExpenses ? a * 0.13 : sumExpenses * 0.13
        const profit = desiredProfit < ndfl ? desiredProfit : ndfl

        resultTaxNdfl.textContent = formatCurrency(ndfl)
        resultTaxProfitDesired.textContent = formatCurrency(desiredProfit)
        resultTaxProfit.textContent = formatCurrency(profit)
    }, 500))
}
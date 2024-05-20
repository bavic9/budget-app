import React, { useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import useLoacalStorage from "../hooks/useLocalStorage"

const BudgetContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = 'Uncategorized'

export function useBudgets() {
    return useContext(BudgetContext)
}

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudget] = useLoacalStorage('budget',[])
    const [expenses, setExpenses] = useLoacalStorage('expenses',[])
    

    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.budgetId === budgetId)
    }

    function addExpenses({description, amount, budgetId}) {
        setExpenses(prevExpenses => {
            return [...prevExpenses, {id: uuidv4(), description, amount, budgetId}]
        })
    }

    function addBudget({name, max}) {
        setBudget(prevBudget => {
            if ( prevBudget.find(budget => budget.name === name)) {
                return prevBudget
            }
            return [...prevBudget, {id: uuidv4(), name, max}]
        })
    }

    function deleteBudget({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.map(expense => {
                if (expense.budgetId !== id) return expense
                return { ...expense, budgetId:UNCATEGORIZED_BUDGET_ID}
            })
        })

        setBudget(prevBudget => {
            return prevBudget.filter(budget => budget.id !== id)
        })
    }

    function deleteExpenses({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.filter(expense => expense.id !== id)
        })
    }

    return (
        <BudgetContext.Provider value={{
            budgets,
            expenses,
            getBudgetExpenses,
            addExpenses,
            addBudget,
            deleteBudget,
            deleteExpenses
        }}>
            {children}
        </BudgetContext.Provider>
    )
}

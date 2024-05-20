import { useState } from 'react'
import './App.css'
import AddBudgetModal from './components/AddBudgetModal'
import BudgetCard from './components/BudgetCard'
import { Button, Container, Stack } from 'react-bootstrap'
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from './contexts/BudgetContexts'
import AddExpensesModal from './components/AddExpensesModal'
import UncategorizeBudgetCard from './components/UncategorizeBudgetCard'
import TotalBudgetCard from './components/TotalBudgetCard'
import ViewExpensesModal from './components/ViewExpensesModal'

function App() {

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)
  const [ addExpenseModalBudgetId, setAddExpenseModalBudgetId] = useState()
  const [ viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState()



  const { budgets, getBudgetExpenses } = useBudgets()

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true)
    setAddExpenseModalBudgetId(budgetId)
  }
  

  return (
    <>
      <div className='w-full p-6 bg-slate-200'>
        {/* budget head */}
        <Stack direction='horizontal' gap='2' className='mb-4'>
          <h1 className='text-3xl font-semibold me-auto'>Budgets</h1>
          <Button
            onClick={() => setShowAddBudgetModal(true)}
            variant='primary' >Add Budgets</Button>
          <Button variant='outline-primary' onClick={openAddExpenseModal}>Add Expense</Button>
        </Stack>

        {/* budgets */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          {budgets.map(budget => {
            const amount = getBudgetExpenses(budget.id).reduce(
              (total, expense) => total + expense.amount, 0)
            return (
              <BudgetCard
                key={budget.id}
                name={budget.name}
                amount={amount}
                max={budget.max}
                onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                onViewExpensesClick={() =>
                  setViewExpensesModalBudgetId(budget.id)
                }
              />
            )
          })}
          <UncategorizeBudgetCard 
            onAddExpenseClick={openAddExpenseModal}
            onViewExpensesClick={() => 
              setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
            }
          />
          <TotalBudgetCard/>
        </div>
      </div>
      <AddBudgetModal 
        show={showAddBudgetModal} 
        handleClose={() => setShowAddBudgetModal(false)} 
      />
      <AddExpensesModal
        show={showAddExpenseModal}
        defaultBudgetId={addExpenseModalBudgetId}
        handleClose={() => setShowAddExpenseModal(false)}
      />
      <ViewExpensesModal 
        budgetId={viewExpensesModalBudgetId}
        handleClose={() => setViewExpensesModalBudgetId()}
      />
    </>
  )
}

export default App

import { Hono } from 'hono'
import { z } from 'zod'

type Expense = {
    id: number
    name: string
    amount: number
}

const fakeExpenses: Expense[] = [
    { id: 1, name: "Rent", amount: 1000 },
    { id: 2, name: "Groceries", amount: 500 },
    { id: 3, name: "Utilities", amount: 200 },
]

export const expensesRoute = new Hono()
.get('/', (c) => {
    return c.json({ expenses: fakeExpenses })
})
.post('/', async (c) => {
    const expense: Expense = await c.req.json()
    console.log(expense.amount)
    console.log(expense)
    return c.json(expense)
})

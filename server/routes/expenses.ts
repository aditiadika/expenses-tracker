import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    name: z.string(),
    amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id: true})

const fakeExpenses: Expense[] = [
    { id: 1, name: "Rent", amount: 1000 },
    { id: 2, name: "Groceries", amount: 500 },
    { id: 3, name: "Utilities", amount: 200 },
]

export const expensesRoute = new Hono()

.get('/', (c) => {
    return c.json({ expenses: fakeExpenses })
})
.post('/', zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid('json')
    fakeExpenses.push({...expense, id: fakeExpenses.length+1})
    c.status(201)
    return c.json(expense)
}).get('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpenses.find(expense => expense.id === id)
    if (!expense) {
        return c.notFound()
    }
    return c.json({expense})
}).delete('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const index = fakeExpenses.findIndex(expense => expense.id === id)
    if (!index) {
        return c.notFound()
    }

    const deleteExpense = fakeExpenses.splice(index, 1)[0]
    return c.json({
        expense: deleteExpense
    })
})

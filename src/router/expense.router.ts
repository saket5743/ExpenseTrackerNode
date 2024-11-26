import express from 'express';
import { createExpense, deleteExpense, expenseById, getAllExpense, getAllExpenseRegex, updateExpense } from '../controller/expense.controller';
const router = express.Router();

router.route('/getAllExpense').get(getAllExpense)
router.route('/createExpense').post(createExpense)
router.route('/:id').get(expenseById).put(updateExpense).delete(deleteExpense)
router.route('/').get(getAllExpenseRegex)

export default router;
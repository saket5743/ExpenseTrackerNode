import express from 'express';
import { createExpense, deleteExpense, expenseByDate, expenseById, getAllExpense, getAllExpenseRegex, updateExpense } from '../controller/expense.controller';
const router = express.Router();

router.route('/getAllExpense').get(getAllExpense)
router.route('/createExpense').post(createExpense)
router.route('/date').get(expenseByDate)
router.route('/all').get(getAllExpenseRegex)
router.route('/:id').get(expenseById).put(updateExpense).delete(deleteExpense)

export default router;
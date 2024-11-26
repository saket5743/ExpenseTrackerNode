import express from 'express';
import { createExpense, deleteExpense, expenseById, getAllExpense, updateExpense } from '../controller/expense.controller';
const router = express.Router();

router.route('/getAllExpense').get(getAllExpense)
router.route('/createExpense').post(createExpense)
router.route('/:id').get(expenseById).put(updateExpense).delete(deleteExpense)

export default router;
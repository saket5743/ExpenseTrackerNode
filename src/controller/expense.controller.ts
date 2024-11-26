import { Request, Response } from "express";
import QueryString from 'qs';
import asyncWrapper from "../utils/asyncwrapper";
import Expense from "../models/expense.models";
import ApiError from "../errors/ApiError";
import { BOOL_TRUE, CODE_200, CODE_400, EXPENSE_FOUND, EXPENSE_NOT_CRT, EXPENSE_UPDTD, EXPENSES_NOT_FOUND, SUCCESS } from "../utils/constants";
import ApiResponse from "../errors/ApiResponseCode";

// Creating Expense
export const createExpense = asyncWrapper(async (req: Request, res: Response) => {
  const { title, amount, category } = req.body;
  const expense = await Expense.create(req.body);
  if (!expense) {
    return res.json(new ApiError(EXPENSE_NOT_CRT, CODE_400));
  }
  return res.json(new ApiResponse(CODE_200, expense, SUCCESS, BOOL_TRUE))
})

// Get All Expense
export const getAllExpense = asyncWrapper(async (req: Request, res: Response) => {
  const expense = await Expense.find();
  if (!expense) {
    return res.json(new ApiError(EXPENSES_NOT_FOUND, CODE_400))
  }
  return res.json(new ApiResponse(CODE_200, expense, SUCCESS, BOOL_TRUE))
})

// Get Expenses by Id
export const expenseById = asyncWrapper(async (req: Request, res: Response) => {
  const { id: expenseId } = req.params;
  const expense = await Expense.findById({ _id: expenseId }, req.body);
  if (!expense) {
    return res.json(new ApiError(EXPENSES_NOT_FOUND, CODE_400))
  }
  return res.json(new ApiResponse(CODE_200, expense, EXPENSE_FOUND, BOOL_TRUE))
})

// Update Expenses by Id
export const updateExpense = asyncWrapper(async (req: Request, res: Response) => {
  const { id: expenseId } = req.params;
  const expense = await Expense.findByIdAndUpdate({ _id: expenseId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true
  })
  if (!expense) {
    return res.json(new ApiError(EXPENSES_NOT_FOUND, CODE_400))
  }
  return res.json(new ApiResponse(CODE_200, expense, EXPENSE_UPDTD, BOOL_TRUE))
})

// Delete Expense by Id
export const deleteExpense = asyncWrapper(async (req: Request, res: Response) => {
  const { id: expenseId } = req.params;
  const expense = await Expense.findByIdAndDelete({ _id: expenseId }, req.body);
  if (!expense) {
    return res.json(new ApiError(EXPENSES_NOT_FOUND, CODE_400))
  }
  return res.json(new ApiResponse(CODE_200, {}, EXPENSE_UPDTD, BOOL_TRUE))
})


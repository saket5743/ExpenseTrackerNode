import { Request, Response } from "express";
import QueryString from 'qs';
import asyncWrapper from "../utils/asyncwrapper";
import Expense from "../models/expense.models";
import ApiError from "../errors/ApiError";
import { BOOL_TRUE, CODE_200, CODE_400, EXPENSE_FOUND, EXPENSE_NOT_CRT, EXPENSE_UPDTD, EXPENSES_NOT_FOUND, SUCCESS } from "../utils/constants";
import ApiResponse from "../errors/ApiResponseCode";

// Creating Expense
export const createExpense = asyncWrapper(async (req: Request, res: Response) => {
  const { title, amount, category, date } = req.body;
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

// Get Expenses by date
export const expenseByDate = asyncWrapper(async (req: Request, res: Response) => {
  const { startDate, endDate, days } = req.query;
  let filter: any = {};

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    filter.date = {
      $gte: start,
      $lte: end
    };
  }

  if (days) {
    const date = new Date();
    date.setDate(date.getDate() - Number(days));
    filter.date = { $gte: date };
  }

  const expense = await Expense.find(filter);
  if (!expense || expense.length === 0) {
    return res.json(new ApiError(EXPENSES_NOT_FOUND, CODE_400));
  }

  return res.json(new ApiResponse(CODE_200, expense, SUCCESS, BOOL_TRUE));
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

// RegEx Get Expense
interface IQueryObj {
  title?: QueryString.ParsedQs;
  sort?: string;
  select?: number;
  numericFilters?: string;
  category?: QueryString.ParsedQs
}

export const getAllExpenseRegex = asyncWrapper(async (req: Request, res: Response) => {
  const { title, category, sort, select, numericFilters } = req.query;
  const queryObject: IQueryObj = {}

  if (title) {
    queryObject.title = { $regex: title, $options: "i" }
  }

  if (category) {
    queryObject.category = { $regex: category, $options: "i" }
  }

  if (numericFilters) {
    const operatorMap: {
      ">": string,
      ">=": string,
      "=": string,
      "<": string,
      "<=": string
    } = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte"
    }
    const reqEx = /\b(<=|>=|<|=|>)/g;
    let filters
    if (typeof numericFilters === "string") {
      filters = numericFilters.replace(reqEx, (match: string) => `-${operatorMap[match as keyof typeof operatorMap]}-`);
    }
    const options = ["amount"];

    filters = filters!.split(",").forEach((item: string) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        (queryObject as any)[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Expense.find(queryObject);

  if (typeof sort === "string") {
    let sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (typeof select === 'string') {
    let selectList = select.split(",").join(" ");
    result = result.select(selectList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const expense = await result;
  return res.json(new ApiResponse(CODE_200, expense, SUCCESS, BOOL_TRUE))
})
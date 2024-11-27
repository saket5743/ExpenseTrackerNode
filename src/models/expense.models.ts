import mongoose from "mongoose";

interface IExpense {
  title: string,
  amount: number,
  category: string,
  date: Date
}

const expenseSchema = new mongoose.Schema<IExpense>({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;


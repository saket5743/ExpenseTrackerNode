import mongoose from "mongoose";

interface IExpense {
  title: string,
  amount: number,
  category: string
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
  }
}, { timestamps: true })

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;


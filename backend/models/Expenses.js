import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    notes: { type: String, required: true },
}, {
    timestamps: true
})

const Expenses = mongoose.model("Expenses", expensesSchema)

export default Expenses
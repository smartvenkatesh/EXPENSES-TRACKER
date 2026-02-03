import express from "express"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Expenses from "../models/Expenses.js"


const router = express.Router()

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const exist = await User.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "This email already registerd" })
        }
        const hash = await bcrypt.hash(password, 10)

        const user = { name, email, password: hash }

        await User.create(user)
        res.status(201).json({ message: "User Registered Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log("Error", error);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "This email not registerd" })
        }
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            return res.status(400).json({ message: "invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).json({ message: "Login Successfully", token, user_id: user._id })

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log("Error:", error);
    }
})

router.post("/details", async (req, res) => {
    const { userId, amount, notes, category } = req.body
    console.log("line 54", userId);
    try {
        const expenses = await Expenses.create({ userId, amount, notes, category })
        res.status(201).json({ message: "Expenses added successfully", expenses })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        console.log("Error:", error);
    }
})

router.get("/get/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log("userId 64", userId);
    try {
        const expenses = await Expenses.find({ userId });
        console.log("line 69", expenses);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const editData = await Expenses.findOne({ _id: id })
        console.log("line 80", editData);
        res.json(editData)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

router.post("/update/:editId", async (req, res) => {
    const { editId } = req.params
    try {
        const update = await Expenses.findByIdAndUpdate(editId, req.body, { new: true })
        res.json({ message: "Expenses Updated" })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });

    }
})

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params
    try {
        await Expenses.findByIdAndDelete({ _id: id })
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})
export default router
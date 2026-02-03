import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Home() {

    const URL = "http://localhost:5000/expenses";

    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [category, setCategory] = useState("");
    const [list, setList] = useState([]);
    const [edit, setEdit] = useState("add")
    const [editId, setEditId] = useState("")

    const navigate = useNavigate()

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");


    const fetchExpenses = async () => {
        try {
            const res = await axios.get(`${URL}/get/${userId}`);
            console.log(res.data);
            setList(res.data);

        } catch (err) {
            toast.error("Failed to fetch expenses");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (edit === "add") {
                await axios.post(`${URL}/details`,
                    { userId, amount, notes, category },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                toast.success("Expense added");
            }

            if (edit === "edit") {
                await axios.post(`${URL}/update/${editId}`,
                    { userId, amount, notes, category },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("ok");
                setEditId("")
                setEdit("add")

                toast.success("Expense updated");
            }


            setAmount("");
            setNotes("");
            setCategory("");

            fetchExpenses();

        } catch (err) {
            toast.error("Add failed");
        }
    };

    const startEdit = async (id) => {
        setEdit("edit")
        const res = await axios.get(`${URL}/edit/${id}`)
        console.log("line 68", res);
        const data = res.data
        setAmount(data.amount)
        setCategory(data.category)
        setNotes(data.notes)
        setEditId(data._id)
    }

    const deleteExpense = async (id) => {
        await axios.delete(`${URL}/delete/${id}`)
        toast.success("Deleted")
        fetchExpenses()
    }

    useEffect(() => {
        fetchExpenses();
        console.log(userId);
    }, []);

    const logout = async () => {
        localStorage.removeItem("user")
        navigate("/login")
    }

    return (
        <Container className="mt-5">
            <Button className="btn-danger" onClick={logout}>Logout</Button>
            <h3 className="mb-4">Add Expense</h3>

            {/* Form */}
            <Form onSubmit={handleSubmit} className="mb-5">

                <Form.Control
                    className="mb-2"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <Form.Control
                    className="mb-2"
                    type="text"
                    placeholder="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <Form.Control
                    className="mb-3"
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                {edit === "add" ? (<Button type="submit">Add</Button>) :
                    (<Button type="submit" className="btn-success">Update</Button>)}
            </Form>

            {/* Table */}
            <h4>My Expenses</h4>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Notes</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={item._id}>
                            <td>₹ {item.amount}</td>
                            <td>{item.notes}</td>
                            <td>{item.category}</td>
                            <td><Button className="btn-warning ms-3" onClick={() => startEdit(item._id)}>Edit</Button>
                                <Button className="btn-danger ms-3"
                                    onClick={() => deleteExpense(item._id)}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <ToastContainer />
        </Container>
    );
}

export default Home;

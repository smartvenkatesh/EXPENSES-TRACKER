import axios from "axios";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Login() {

    const URL = "http://localhost:5000/expenses";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(URL + "/login", { email, password });

            // save token
            console.log(res);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user_id);


            toast.success(res.data.message);

            navigate("/home",);

        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "400px" }}>
            <h3 className="mb-4 text-center">Login</h3>

            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                    Login
                </Button>

            </Form>
            <ToastContainer />
        </Container>
    );
}

export default Login;

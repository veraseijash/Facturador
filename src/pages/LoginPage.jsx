import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../services/loginService";
import LoginIllustration from "../assets/img/login.svg";

export default function LoginPage({ onLoginSuccess }) {
    const [user_name, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await validateUser({ user_name, password });
            const userWithLoginTime = {
                ...data.user,
                loginAt: new Date().toISOString(),
            };
            localStorage.setItem("user", JSON.stringify(userWithLoginTime));
            onLoginSuccess(userWithLoginTime);
            navigate("/");
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
            console.log('error: ', err);
        }
    };

    return (
        <div className="login-background">
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <h2 className="mb-4 text-center text-white">Iniciar Sesión</h2>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="Usuario" value={user_name}
                            onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" placeholder="Contraseña" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </div>
                <div>
                    <img src={LoginIllustration} alt="Login" className="w-full h-auto" />
                </div>
            </form>
        </div>
    );
}
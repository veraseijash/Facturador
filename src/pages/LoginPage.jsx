import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { validateUser } from "../services/loginService";
import { images } from '../assets/images';

export default function LoginPage({ onLoginSuccess }) {
  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ user_name, password }) => {
      return await validateUser({ user_name, password });
    },
    onSuccess: (data) => {
      const userWithLoginTime = {
        ...data.user,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem("user", JSON.stringify(userWithLoginTime));
      onLoginSuccess(userWithLoginTime);
      navigate("/");
    },
    onError: () => {
      alert("Usuario o contraseña incorrectos");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ user_name, password });
  };

  return (
    <div className="login-background">
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <h2 className="mb-4 text-center text-white">Iniciar Sesión</h2>

          {mutation.isError && (
            <p className="text-red-500 mb-2">Usuario o contraseña incorrectos</p>
          )}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Ingresando..." : "Entrar"}
          </button>
        </div>

        <div>
          <img src={images.LoginIllustration} alt="Login" className="w-full h-auto" />
        </div>
      </form>
    </div>
  );
}

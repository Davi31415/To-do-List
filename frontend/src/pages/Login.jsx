import { useState, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ThemeContext } from "../context/ThemeContext";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const { theme, toggleTheme, currentTheme } = useContext(ThemeContext);
  const { typography, ui, background: bgColor } = currentTheme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const doLogin = async () => {
    setIsLoading(true);

    if (email.trim() == "" || password.trim() == "") {
      alert("Email e senha não podem estar vazios!");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      alert("Por favor, insira um email válido!");
      setIsLoading(false);
      return;
    }

    const resp = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await resp.json();
    if (resp.ok) {
      console.log("Login realizado com sucesso!", data);
      localStorage.setItem("token", data.token);
      window.location.href = "/home";
      setIsLoading(false);
    } else {
      console.error("Erro ao realizar login:", data);
      alert(data.message);
      setIsLoading(false);
    }
  };

  const doRegister = async () => {
    setIsLoading(true);

    if (name.trim() == "" || email.trim() == "" || password.trim() == "") {
      alert("Nome, email e senha não podem estar vazios!");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      alert("Por favor, insira um email válido!");
      setIsLoading(false);
      return;
    }

    const resp = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await resp.json();
    if (resp.ok) {
      console.log("Registro realizado com sucesso!", data);
      window.location.href = "/";
      setIsLoading(false);
    } else {
      console.error("Erro ao realizar registro:", data);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh flex flex-col transition-colors duration-500"
      style={{ background: bgColor }}
    >
      <div className="p-2 flex justify-end">
        <div className="flex flex-row items-center gap-4 w-fit">
          <i
            onClick={toggleTheme}
            className={`sun px-1.5 rounded-[5px] cursor-pointer text-[32px] hover:bg-(--icon-hover) transition-colors duration-300 ease-in-out ${
              theme === "dark" ? "bi bi-brightness-high" : "bi bi-moon"
            }`}
            style={{
              color: ui.icons,
              "--icon-hover": ui.iconsHover,
            }}
          ></i>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#212529]/20 backdrop-blur-md border border-white/10 shadow-xl">
          <h1
            className="text-4xl font-medium text-center mb-8"
            style={{ color: typography.primary }}
          >
            {isLogin ? "Bem-vindo!" : "Crie sua conta"}
          </h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  className={`w-full p-4 rounded-xl outline-none ${isLogin ? "hidden" : ""}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      emailRef.current?.focus();
                    }
                  }}
                  style={{
                    background: ui.input,
                    color: typography.secondary,
                    "--placeholder-color": typography.secondary,
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="w-full p-4 rounded-xl outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      passwordRef.current?.focus();
                    }
                  }}
                  style={{
                    background: ui.input,
                    color: typography.secondary,
                    "--placeholder-color": typography.secondary,
                  }}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  ref={passwordRef}
                  className="w-full p-4 rounded-xl outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      isLogin ? doLogin() : doRegister();
                    }
                  }}
                  style={{
                    background: ui.input,
                    color: typography.secondary,
                    "--placeholder-color": typography.secondary,
                  }}
                />
                <button
                  className="w-full p-4 mt-4 rounded-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ background: typography.highlight, color: "#000" }}
                  onClick={isLogin ? doLogin : doRegister}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : isLogin ? (
                    "Entrar"
                  ) : (
                    "Cadastrar"
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <p
            className="mt-6 text-center cursor-pointer"
            style={{ color: typography.primary }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <span
              className="font-medium hover:underline"
              style={{ color: typography.highlight }}
            >
              {isLogin ? "Cadastre-se" : "Faça Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

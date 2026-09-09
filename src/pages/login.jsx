import { useState } from "react";
import { supabase } from "../supabase";
import "./Autenticacao.css";

function Login({ setPagina }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const voltarHome = () => {
    setPagina("home");
  };

  const irParaCadastro = () => {
    setPagina("cadastro");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");

    console.log("Tentando logar com:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.log("Resposta do Supabase:", { data, error });

    if (error) {
      setMensagem("Erro ao entrar: " + error.message);
      return;
    }

    setMensagem("Login realizado com sucesso!");
    setTimeout(() => {
      setPagina("home");
    }, 1000);
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setMensagem("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) {
      setMensagem("Erro ao entrar com o Google: " + error.message);
    }
  };

  return (
    <main className="auth-page">

      <section className="auth-container">

        <div className="auth-card">

          {/* LOGO */}

          <button
            className="auth-brand"
            onClick={voltarHome}
            type="button"
          >
            Bella<span>.</span>
          </button>


          {/* TÍTULO */}

          <span className="section-label">
            SEJA BEM-VINDO DE VOLTA
          </span>

          <h1 className="heading">
            Entre na sua <span>conta</span>
          </h1>

          <p className="section-description">
            Entre para acessar seus agendamentos e serviços.
          </p>


          {/* FORMULÁRIO */}

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            {/* USUÁRIO / E-MAIL */}

            <div className="auth-group">

              <label
                className="auth-label"
                htmlFor="login"
              >
                E-mail
              </label>

              <input
                className="auth-input"
                id="login"
                name="login"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

            </div>


            {/* SENHA */}

            <div className="auth-group">

              <label
                className="auth-label"
                htmlFor="login-password"
              >
                Senha
              </label>

              <input
                className="auth-input"
                id="login-password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

            </div>

            {mensagem && (
              <p
                style={{
                  color: mensagem.includes("sucesso") ? "#4f8a61" : "#b94b65",
                  fontSize: "1.3rem",
                  marginTop: "1rem",
                  textAlign: "center"
                }}
              >
                {mensagem}
              </p>
            )}


            {/* BOTÃO */}

            <button
              className="auth-submit"
              type="submit"
            >
              Entrar
            </button>


          </form>


          {/* DIVISOR */}

          <div className="auth-divider">
            <span>ou</span>
          </div>

            {/* BOTÃO GOOGLE */}

            <button
              type="button"
              className="auth-submit"
              style={{ color: "#b94b65", backgroundColor: "#ffffff", marginTop: "1rem" }}
              onClick={handleGoogleLogin}
            >
              Entrar com o Google
            </button>

          {/* CADASTRO */}

          <p className="auth-link">

            Ainda não tem uma conta?

            <button
              type="button"
              onClick={irParaCadastro}
            >
              Criar conta
            </button>

          </p>


          {/* VOLTAR */}

          <button
            className="auth-back"
            type="button"
            onClick={voltarHome}
          >
            ← Voltar para a página inicial
          </button>

        </div>

      </section>

    </main>
  );
}

export default Login;
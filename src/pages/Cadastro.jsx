import { useState } from "react";
import { supabase } from "../supabase";
import "./Autenticacao.css";

function Cadastro({ setPagina }) {

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState("");

  const voltarHome = () => {
    setPagina("home");
  };

  const irParaLogin = () => {
    setPagina("login");
  };

    const formatarTelefone = (e) => {
    let valor = e.target.value.replace(/\D/g, "");

    // Limita a 11 números
    valor = valor.slice(0, 11);

    if (valor.length > 0) {
      valor = "(" + valor;
    }

    if (valor.length > 3) {
      valor = valor.slice(0, 3) + ") " + valor.slice(3);
    }

    if (valor.length > 10) {
      valor = valor.slice(0, 10) + "-" + valor.slice(10);
    }

    e.target.value = valor;
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem("");

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          phone: phone
        }
      }
    });

    if (error) {
      setMensagem("Erro ao cadastrar: " + error.message);
      return;
    }

    setMensagem("Cadastro realizado com sucesso! Redirecionando...");
    setTimeout(() => {
      setPagina("login");
    }, 1500);
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
            SEJA BEM-VINDO
          </span>

          <h1 className="heading">
            Crie sua <span>conta</span>
          </h1>

          <p className="section-description">
            Cadastre-se para ter acesso aos nossos serviços e agendamentos.
          </p>


          {/* FORMULÁRIO */}

          <form
            className="auth-form"
            onSubmit={handleCadastro}
          >

            {/* USUÁRIO */}

            <div className="auth-group">

              <label
                className="auth-label"
                htmlFor="username"
              >
                Usuário
              </label>

              <input
                className="auth-input"
                id="username"
                name="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />

            </div>


            {/* TELEFONE */}

            <div className="auth-group">

              <label
                className="auth-label"
                htmlFor="phone"
              >
                Telefone
              </label>

              <input
                className="auth-input"
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                onInput={formatarTelefone}
                required
              />

            </div>


            {/* E-MAIL */}

            <div className="auth-group">

              <label
                className="auth-label"
                htmlFor="email"
              >
                E-mail
              </label>

              <input
                className="auth-input"
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@gmail.com"
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
                htmlFor="password"
              >
                Senha
              </label>

              <input
                className="auth-input"
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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
              Criar minha conta
            </button>

          </form>


          {/* DIVISOR */}

          <div className="auth-divider">
            <span>ou</span>
          </div>


          {/* LOGIN */}

          <p className="auth-link">

            Já tem uma conta?

            <button
              type="button"
              onClick={irParaLogin}
            >
              Entrar
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

export default Cadastro;
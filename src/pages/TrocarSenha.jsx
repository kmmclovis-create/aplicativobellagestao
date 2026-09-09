import { useState } from "react";
import { supabase } from "../supabase";
import "./TrocarSenha.css";

function TrocarSenha({ setPagina }) {

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensagem("");

    const senhaAtual = event.target.senhaAtual.value.trim();
    const novaSenha = event.target.novaSenha.value.trim();
    const confirmarSenha = event.target.confirmarSenha.value.trim();

    // Senha atual
    if (!senhaAtual) {
      setMensagem("Por favor, informe sua senha atual.");
      setTipoMensagem("erro");
      return;
    }

    // Nova senha
    if (novaSenha.length < 6) {
      setMensagem("A nova senha deve ter pelo menos 6 caracteres.");
      setTipoMensagem("erro");
      return;
    }

    // Confirmação
    if (novaSenha !== confirmarSenha) {
      setMensagem("A confirmação não corresponde à nova senha.");
      setTipoMensagem("erro");
      return;
    }

    try {
      // 1. Obter o usuário logado para pegar o e-mail
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || !user.email) {
        setMensagem("Erro ao identificar o usuário logado.");
        setTipoMensagem("erro");
        return;
      }

      // 2. Validar a senha atual tentando fazer login com ela
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: senhaAtual,
      });

      if (signInError) {
        setMensagem("A senha atual está incorreta.");
        setTipoMensagem("erro");
        return;
      }

      // 3. Se a senha atual estiver correta, atualiza para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha
      });

      if (updateError) {
        setMensagem("Erro ao atualizar senha: " + updateError.message);
        setTipoMensagem("erro");
        return;
      }

      setMensagem("Senha atualizada com sucesso!");
      setTipoMensagem("sucesso");

      event.target.reset();

      setTimeout(() => {
        setPagina("perfil");
      }, 1500);

    } catch (erro) {
      console.error("Erro inesperado:", erro);
      setMensagem("Ocorreu um erro ao alterar a senha.");
      setTipoMensagem("erro");
    }
  };

  return (
    <main className="trocar-senha-content">

      {/* VOLTAR */}
      <button
        type="button"
        className="back-link"
        onClick={() => setPagina("perfil")}
      >
        <i className="fa-solid fa-arrow-left"></i>
        Voltar para o perfil
      </button>

      {/* CARD */}
      <form
        className="trocar-senha-card"
        onSubmit={handleSubmit}
      >

        <h1>Privacidade e Segurança</h1>

        <p className="subtitle">
          Altere a senha usada para entrar na sua conta.
        </p>

        {/* SENHA ATUAL */}
        <div className="field-group">
          <label htmlFor="senhaAtual">
            Senha atual
          </label>

          <input
            type="password"
            id="senhaAtual"
            name="senhaAtual"
            placeholder="Digite sua senha atual"
            autoComplete="current-password"
            required
          />
        </div>

        {/* NOVA SENHA */}
        <div className="field-group">
          <label htmlFor="novaSenha">
            Nova senha
          </label>

          <input
            type="password"
            id="novaSenha"
            name="novaSenha"
            placeholder="Digite sua nova senha"
            autoComplete="new-password"
            minLength="6"
            required
          />
        </div>

        {/* CONFIRMAR SENHA */}
        <div className="field-group">
          <label htmlFor="confirmarSenha">
            Confirmar nova senha
          </label>

          <input
            type="password"
            id="confirmarSenha"
            name="confirmarSenha"
            placeholder="Digite a nova senha novamente"
            autoComplete="new-password"
            minLength="6"
            required
          />
        </div>

        {mensagem && (
          <p
            style={{
              color: tipoMensagem === "sucesso" ? "#4f8a61" : "#b94b65",
              fontSize: "1.3rem",
              marginTop: "1rem",
              textAlign: "center"
            }}
          >
            {mensagem}
          </p>
        )}

        {/* BOTÕES */}
        <div className="edit-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => setPagina("perfil")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save-button"
          >
            Salvar nova senha
          </button>
        </div>

      </form>

    </main>
  );
}

export default TrocarSenha;
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Perfil.css";

function Perfil({ setPagina }) {

  const [nome, setNome] = useState("Nome do Usuário");
  const [email, setEmail] = useState("usuario@email.com");
  const [fotoPerfil, setFotoPerfil] = useState("perfil.png");

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.warn("Nenhuma sessão ativa encontrada.");
          return;
        }

        const user = session.user;

        if (user) {
          // Busca primeiro da tabela "perfis" para priorizar a foto salva no banco[cite: 9]
          const { data: perfilData } = await supabase
            .from("perfis")
            .select("nome, foto_url")
            .eq("id", user.id)
            .single();

          setNome(perfilData?.nome || user.user_metadata?.username || user.user_metadata?.nome || "Nome do Usuário");
          setEmail(user.email || "usuario@email.com");

          if (perfilData?.foto_url) {
            setFotoPerfil(perfilData.foto_url);
          } else if (user.user_metadata?.avatar_url) {
            setFotoPerfil(user.user_metadata.avatar_url);
          } else {
            const fotoSalva = localStorage.getItem("fotoPerfil");
            if (fotoSalva) setFotoPerfil(fotoSalva);
          }
        }
      } catch (erro) {
        console.warn("Erro ao buscar dados do perfil:", erro);
      }
    }

    carregarPerfil();
  }, []);

const handleSair = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert("Erro ao sair: " + error.message);
        return;
      }

      // Limpeza de dados locais e cache para segurança
      localStorage.clear();
      sessionStorage.clear();

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      setPagina("login");
    } catch (err) {
      console.error("Erro inesperado ao sair:", err);
    }
  };

  return (
    <main className="pagina-perfil">

      <section className="perfil-header">

        <div className="foto-container">
          <img
            src={fotoPerfil}
            alt="Foto de perfil"
            className="foto-perfil"
          />
        </div>

        <div className="informacoes-perfil">
          <h1>{nome}</h1>
          <p className="email-perfil">{email}</p>
          <p className="membro-desde">
            <i className="fa-regular fa-calendar"></i>
            Membro recente
          </p>
        </div>

        <button
          className="botao-editar-perfil"
          type="button"
          onClick={() => setPagina("editarPerfil")}
        >
          <i className="fa-solid fa-pen"></i>
          Editar perfil
        </button>

      </section>

      <section className="acesso-rapido">
        <div className="quick-card">

          <button
            className="card-rapido"
            type="button"
            onClick={() => setPagina("agenda")}
          >
            <div className="icone-rapido">
              <i className="fa-regular fa-calendar"></i>
            </div>
            <div>
              <h3>Agendamentos</h3>
              <p>Veja e gerencie seus agendamentos</p>
            </div>
          </button>
        </div>
      </section>

      <section className="opcoes-perfil">
        <button
          className="opcao-perfil"
          type="button"
          onClick={() => setPagina("trocarSenha")}
        >
          <div className="icone-opcao">
            <i className="fa-regular fa-bell"></i>
          </div>
          <div className="texto-opcao">
            <h3>Notificações</h3>
            <p>Gerencie lembretes de agendamentos e novidades</p>
          </div>
          <i className="fa-solid fa-chevron-right seta"></i>
        </button>

        <button
          className="opcao-perfil"
          type="button"
          onClick={() => setPagina("trocarSenha")}
        >
          <div className="icone-opcao">
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="texto-opcao">
            <h3>Privacidade e segurança</h3>
            <p>Gerencie suas informações e segurança da conta</p>
          </div>
          <i className="fa-solid fa-chevron-right seta"></i>
        </button>

        <button className="opcao-perfil" type="button">
          <div className="icone-opcao">
            <i className="fa-regular fa-credit-card"></i>
          </div>
          <div className="texto-opcao">
            <h3>Formas de pagamento</h3>
            <p>Cartões cadastrados e histórico de pagamentos</p>
          </div>
          <i className="fa-solid fa-chevron-right seta"></i>
        </button>

        <button className="opcao-perfil" type="button">
          <div className="icone-opcao">
            <i className="fa-regular fa-circle-question"></i>
          </div>
          <div className="texto-opcao">
            <h3>Ajuda e suporte</h3>
            <p>Perguntas frequentes e atendimento</p>
          </div>
          <i className="fa-solid fa-chevron-right seta"></i>
        </button>
      </section>

      <section className="conta">
        <h2>Conta</h2>
        <div className="opcoes-conta">
          <button 
            className="item-conta sair" 
            type="button"
            onClick={handleSair}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Sair da conta</span>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </section>

    </main>
  );
}

export default Perfil;

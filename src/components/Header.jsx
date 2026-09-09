import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./Header.css";
import MenuMobile from "./MenuMobile";

import homeIcon from "../assets/icones/home.png";
import procedimentosIcon from "../assets/icones/procedimentos.png";
import lojaIcon from "../assets/icones/loja.png";
import sobreIcon from "../assets/icones/sobre_nos.png";
import contatoIcon from "../assets/icones/contato.png";
import carrinhoIcon from "../assets/icones/carrinho.png";
import perfilVazioIcon from "../assets/icones/perfil_vaziu.png";

function Header({ setPagina }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(perfilVazioIcon);

  // =====================================================
  // CARREGAR FOTO DO USUÁRIO LOGADO NO HEADER
  // =====================================================

  useEffect(() => {
    async function carregarFotoHeader() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: perfil } = await supabase
          .from("perfis")
          .select("foto_url")
          .eq("id", session.user.id)
          .single();

        if (perfil?.foto_url) {
          setFotoPerfil(perfil.foto_url);
        } else if (session.user.user_metadata?.avatar_url) {
          setFotoPerfil(session.user.user_metadata.avatar_url);
        }
      }
    }

    carregarFotoHeader();

    // Ouve alterações de login/logout em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: perfil } = await supabase
          .from("perfis")
          .select("foto_url")
          .eq("id", session.user.id)
          .single();

        if (perfil?.foto_url) {
          setFotoPerfil(perfil.foto_url);
        } else if (session.user.user_metadata?.avatar_url) {
          setFotoPerfil(session.user.user_metadata.avatar_url);
        }
      } else {
        setFotoPerfil(perfilVazioIcon);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // IR PARA UMA SEÇÃO DA HOME
  // =====================================================

  const irParaSecao = (secao) => {
    setPagina("home");

    setTimeout(() => {
      const elemento = document.getElementById(secao);

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  // =====================================================
  // VERIFICAR SESSÃO AO CLICAR NO PERFIL
  // =====================================================

  const lidarComCliquePerfil = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      setPagina("perfil");
    } else {
      setPagina("login");
    }
  };

  return (
    <header className="topo">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <a
        href="#"
        className="logo"
        onClick={(e) => {
          e.preventDefault();
          setPagina("home");
        }}
      >
        <span className="logo-texto">Bella</span>
        <span className="logo-ponto">.</span>
      </a>


      {/* =====================================================
          MENU PRINCIPAL
      ===================================================== */}

      <nav className="menu">

        {/* HOME */}

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPagina("home");
          }}
        >
          <img src={homeIcon} alt="" />
          <span>Home</span>
        </a>


        {/* PROCEDIMENTOS */}

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPagina("procedimentos");
          }}
        >
          <img src={procedimentosIcon} alt="" />
          <span>Procedimentos</span>
        </a>


     

        {/* LOJA */}

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPagina("produtos");
          }}
        >
          <img src={lojaIcon} alt="" />
          <span>Loja</span>
        </a>


        {/* SOBRE */}

        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            irParaSecao("about");
          }}
        >
          <img src={sobreIcon} alt="" />
          <span>Sobre Nós</span>
        </a>


        {/* CONTATO */}

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            irParaSecao("contact");
          }}
        >
          <img src={contatoIcon} alt="" />
          <span>Contato</span>
        </a>

      </nav>


      {/* =====================================================
          ÍCONES DO LADO DIREITO
      ===================================================== */}

      <div className="header-icons">

        <a
          href="#"
          title="Carrinho"
          onClick={(e) => {
            e.preventDefault();
            setPagina("carrinho");
          }}
        >
          <img src={carrinhoIcon} alt="Carrinho" />
        </a>

        <a
          href="#"
          title="Perfil"
          onClick={lidarComCliquePerfil}
        >
          <img 
            src={fotoPerfil} 
            alt="Perfil" 
            style={{ 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              objectFit: "cover" 
            }} 
          />
        </a>

      </div>


      {/* =====================================================
          BOTÃO MENU MOBILE
      ===================================================== */}

      <button
        className="botao-menu"
        type="button"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        {menuAberto ? "✕" : "☰"}
      </button>


      {/* =====================================================
          MENU MOBILE
      ===================================================== */}

      {menuAberto && (
        <MenuMobile
          setPagina={setPagina}
          fecharMenu={() => setMenuAberto(false)}
        />
      )}

    </header>
  );
}

export default Header;
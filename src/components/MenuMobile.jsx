import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./MenuMobile.css";

import homeIcon from "../assets/icones/home.png";
import procedimentosIcon from "../assets/icones/procedimentos.png";
import lojaIcon from "../assets/icones/loja.png";
import sobreIcon from "../assets/icones/sobre_nos.png";
import contatoIcon from "../assets/icones/contato.png";
import carrinhoIcon from "../assets/icones/carrinho.png";
import perfilVazioIcon from "../assets/icones/perfil_vaziu.png";


function MenuMobile({ setPagina, fecharMenu }) {
  const [fotoPerfil, setFotoPerfil] = useState(perfilVazioIcon);

  // =====================================================
  // CARREGAR FOTO DO USUÁRIO LOGADO NO MENU MOBILE
  // =====================================================

  useEffect(() => {
    async function carregarFotoMenu() {
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

    carregarFotoMenu();

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
  // NAVEGAÇÃO NORMAL
  // =====================================================

  const navegar = (pagina) => {
    setPagina(pagina);
    fecharMenu();
  };


  // =====================================================
  // NAVEGAR PARA UMA SEÇÃO DA HOME
  // =====================================================

  const irParaSecao = (secao) => {
    setPagina("home");
    fecharMenu();

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


  return (
    <nav className="menu-mobile">

      {/* HOME */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navegar("home");
        }}
      >
        <span className="menu-icon-img">
          <img src={homeIcon} alt="Home" />
        </span>
        <span>Home</span>
      </a>


      {/* PROCEDIMENTOS */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navegar("procedimentos");
        }}
      >
        <span className="menu-icon-img">
          <img src={procedimentosIcon} alt="Procedimentos" />
        </span>
        <span>Procedimentos</span>
      </a>


  

      {/* LOJA */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          navegar("produtos");
        }}
      >
        <span className="menu-icon-img">
          <img src={lojaIcon} alt="Loja" />
        </span>
        <span>Loja</span>
      </a>


      {/* SOBRE NÓS */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          irParaSecao("about");
        }}
      >
        <span className="menu-icon-img">
          <img src={sobreIcon} alt="Sobre Nós" />
        </span>
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
        <span className="menu-icon-img">
          <img src={contatoIcon} alt="Contato" />
        </span>
        <span>Contato</span>
      </a>


      {/* PERFIL */}
   

    </nav>
  );
}

export default MenuMobile;
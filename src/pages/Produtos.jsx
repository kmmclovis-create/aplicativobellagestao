import { useState } from "react";
import "./Produtos.css";

import comboPantene from "../assets/imagens/combopantene.webp";
import comboSiage from "../assets/imagens/Combosiage.webp";
import comboGlowShine from "../assets/imagens/comboglowshine.webp";
import kitPrincipia from "../assets/imagens/Kitprincipia.webp";
import serumNivea from "../assets/imagens/serumnivea.webp";
import acidoSoftBeauty from "../assets/imagens/acidosoftbeauty.webp";

function Produtos() {

  const [pesquisa, setPesquisa] = useState("");

  const produtos = [
    {
      id: 1,
      nome: "Kit Pantene Colageno 1 Sh 510ml + 1 Cond 510ml + Masc 550ml",
      categoria: "Cabelos",
      descricao:
        "Kit de produtos Pantene para cuidados capilares, incluindo shampoo, condicionador e máscara.",
      preco: 131.00,
      imagem: comboPantene,
      destaque: true
    },

    {
      id: 2,
      nome: "Combo Siàge Nutri Acid.Complex",
      categoria: "Cabelos",
      descricao:
        "Kit de produtos Siàge para cuidados capilares, incluindo shampoo, condicionador e máscara.",
      preco: 201.70,
      imagem: comboSiage,
      destaque: false
    },

    {
      id: 3,
      nome: "Kit Glow Shine Completo",
      categoria: "Cabelos",
      descricao:
        "Kit de produtos Glow Shine para cuidados capilares, incluindo shampoo, condicionador, máscara e fluido ativador.",
      preco: 196.24,
      imagem: comboGlowShine,
      destaque: false
    },

    {
      id: 4,
      nome: "Kit Essencial Rn-0,3",
      categoria: "Skincare",
      descricao:
        "Kit de produtos para cuidados faciais, incluindo creme, sérum e protetor solar.",
      preco: 188.80,
      imagem: kitPrincipia,
      destaque: false
    },

    {
      id: 5,
      nome: "Serum Facial Nivea Luminous 630 Skin Glow 15Ml",
      categoria: "Skincare",
      descricao:
        "Serum facial da Nivea para cuidados com a pele, proporcionando luminosidade e hidratação.",
      preco: 54.38,
      imagem: serumNivea,
      destaque: false
    },

    {
      id: 6,
      nome: "Kit Skin Care Ácido Hyalurônico + Vitamina C Soft Beauty",
      categoria: "Skincare",
      descricao:
        "Kit de produtos Soft Beauty para cuidados faciais, incluindo ácido hialurônico e vitamina C.",
      preco: 109.99,
      imagem: acidoSoftBeauty,
      destaque: false
    }
  ];


  // ==============================
  // PESQUISA
  // ==============================

  const produtosFiltrados = produtos.filter((produto) => {

    const termo = pesquisa.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      produto.descricao.toLowerCase().includes(termo) ||
      produto.preco.toString().includes(termo)
    );

  });


  // ==============================
  // ADICIONAR AO CARRINHO
  // ==============================

  function adicionarCarrinho(produto) {

    try {

      const carrinhoSalvo =
        sessionStorage.getItem("carrinho");

      const carrinho =
        carrinhoSalvo
          ? JSON.parse(carrinhoSalvo)
          : [];

      const indiceExistente =
        carrinho.findIndex(
          (item) =>
            item.id === produto.id
        );

      if (indiceExistente !== -1) {

        carrinho[indiceExistente] = {

          ...carrinho[indiceExistente],

          quantidade:
            (Number(
              carrinho[indiceExistente].quantidade
            ) || 1) + 1

        };

      } else {

        carrinho.push({

          id: produto.id,

          nome: produto.nome,

          categoria: produto.categoria,

          descricao: produto.descricao,

          preco: produto.preco,

          imagem: produto.imagem,

          quantidade: 1

        });

      }

      sessionStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
      );

      window.dispatchEvent(
        new Event("carrinhoAtualizado")
      );

      alert(
        `${produto.nome}\n\nfoi adicionado ao carrinho!`
      );

    } catch (erro) {

      console.error(
        "Erro ao adicionar produto ao carrinho:",
        erro
      );

      alert(
        "Não foi possível adicionar o produto ao carrinho."
      );

    }

  }


  // ==============================
  // FORMATAÇÃO DO PREÇO
  // ==============================

  function formatarPreco(preco) {

    return preco.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

  }


  return (

    <main className="produtos-page">


      {/* =========================================
          HERO
      ========================================= */}

      <section className="produtos-hero">

        <div className="produtos-intro">

          <span className="produtos-label">
            BELLA
          </span>


          <h1>
            Nossa{" "}
            <span>Loja</span>
          </h1>


          <p>
            Encontre produtos selecionados para
            cuidar da sua beleza e bem-estar.
          </p>

        </div>


        {/* =====================================
            PESQUISA
        ===================================== */}

        <div className="produtos-search">

          <span className="search-icon">
            🔍
          </span>


          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={pesquisa}
            onChange={(e) =>
              setPesquisa(e.target.value)
            }
          />


          {pesquisa && (

            <button
              type="button"
              className="clear-search"
              onClick={() => setPesquisa("")}
            >
              ×
            </button>

          )}

        </div>

      </section>



      {/* =========================================
          PRODUTOS
      ========================================= */}

      <section className="produtos-section">


        <h2 className="produtos-titulo">

          Produtos em destaque

        </h2>


        {produtosFiltrados.length > 0 ? (

          <div className="produtos-grid">

            {produtosFiltrados.map((produto) => (

              <article
                className="produto-card"
                key={produto.id}
              >


                {/* IMAGEM */}

                <div className="produto-imagem">

                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                  />


                  {produto.destaque && (

                    <span className="produto-tag">
                      Destaque
                    </span>

                  )}

                </div>



                {/* CONTEÚDO */}

                <div className="produto-conteudo">


                  <span className="produto-categoria">
                    {produto.categoria}
                  </span>


                  <h3>
                    {produto.nome}
                  </h3>


                  <p>
                    {produto.descricao}
                  </p>


                  <div className="produto-bottom">


                    <strong>
                      {formatarPreco(produto.preco)}
                    </strong>


                    <button
                      type="button"
                      className="btn-comprar"
                      onClick={() =>
                        adicionarCarrinho(produto)
                      }
                    >

                      🛒

                      Comprar

                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        ) : (

          /* =====================================
             SEM RESULTADOS
          ===================================== */

          <div className="sem-produtos">

            <div className="sem-produtos-icon">
              🔍
            </div>


            <h3>
              Nenhum produto encontrado
            </h3>


            <p>
              Tente pesquisar por outro nome,
              categoria ou descrição.
            </p>

          </div>

        )}

      </section>

    </main>

  );

}

export default Produtos;
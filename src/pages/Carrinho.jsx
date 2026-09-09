import { useEffect, useState } from "react";
import "./Carrinho.css";

function Carrinho({ setPagina }) {

  // =========================================================
  // CARREGAR CARRINHO INICIALMENTE
  // =========================================================

  const [carrinho, setCarrinho] = useState(() => {

    try {

      const carrinhoSalvo =
        JSON.parse(
          sessionStorage.getItem("carrinho")
        ) || [];

      return carrinhoSalvo;

    } catch (erro) {

      console.warn(
        "Erro ao carregar carrinho:",
        erro
      );

      return [];

    }

  });


  // =========================================================
  // INFORMAÇÕES DOS PRODUTOS
  // =========================================================

  const produtosInfo = {

    "Shampoo Profissional": {
      categoria: "Cabelos",
      descricao:
        "Shampoo para limpeza e cuidado dos fios.",
      imagem: "src/assets/shampoo.jpg",
    },

    "Máscara Capilar": {
      categoria: "Cabelos",
      descricao:
        "Tratamento para hidratação e nutrição dos cabelos.",
      imagem: "src/assets/mascara.jpg",
    },

    "Óleo Capilar": {
      categoria: "Cabelos",
      descricao:
        "Óleo para proporcionar brilho, maciez e proteção.",
      imagem: "src/assets/oleo.jpg",
    },

    "Creme Facial": {
      categoria: "Skincare",
      descricao:
        "Creme para hidratação e cuidado diário da pele.",
      imagem: "src/assets/creme.jpg",
    },

    "Protetor Solar": {
      categoria: "Skincare",
      descricao:
        "Proteção diária para manter sua pele bem cuidada.",
      imagem: "src/assets/protetor.jpg",
    },

    "Sérum Facial": {
      categoria: "Skincare",
      descricao:
        "Fórmula para complementar os cuidados com a pele.",
      imagem: "src/assets/serum.jpg",
    },

  };


  // =========================================================
  // SALVAR CARRINHO
  // =========================================================

  useEffect(() => {

    sessionStorage.setItem(
      "carrinho",
      JSON.stringify(carrinho)
    );

  }, [carrinho]);


  // =========================================================
  // ESCUTAR ALTERAÇÕES FEITAS NA LOJA
  // =========================================================

  useEffect(() => {

    const atualizarCarrinho = () => {

      try {

        const carrinhoSalvo =
          JSON.parse(
            sessionStorage.getItem("carrinho")
          ) || [];

        setCarrinho(carrinhoSalvo);

      } catch (erro) {

        console.warn(
          "Erro ao atualizar carrinho:",
          erro
        );

      }

    };


    window.addEventListener(
      "carrinhoAtualizado",
      atualizarCarrinho
    );


    return () => {

      window.removeEventListener(
        "carrinhoAtualizado",
        atualizarCarrinho
      );

    };

  }, []);


  // =========================================================
  // FORMATAR PREÇO
  // =========================================================

  const formatarPreco = (valor) => {

    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

  };


  // =========================================================
  // ALTERAR QUANTIDADE
  // =========================================================

  const alterarQuantidade = (
    indice,
    alteracao
  ) => {

    setCarrinho((carrinhoAtual) =>

      carrinhoAtual.map(
        (produto, index) => {

          if (index !== indice) {
            return produto;
          }


          const quantidadeAtual =
            Number(produto.quantidade) || 1;


          return {

            ...produto,

            quantidade:
              Math.max(
                1,
                quantidadeAtual + alteracao
              ),

          };

        }
      )

    );

  };


  // =========================================================
  // ALTERAR QUANTIDADE PELO INPUT
  // =========================================================

  const alterarInputQuantidade = (
    indice,
    valor
  ) => {

    const quantidade =
      Math.max(
        1,
        Number(valor) || 1
      );


    setCarrinho((carrinhoAtual) =>

      carrinhoAtual.map(
        (produto, index) => {

          if (index !== indice) {
            return produto;
          }


          return {

            ...produto,

            quantidade,

          };

        }
      )

    );

  };


  // =========================================================
  // REMOVER PRODUTO
  // =========================================================

  const removerProduto = (indice) => {

    setCarrinho((carrinhoAtual) =>

      carrinhoAtual.filter(
        (_, index) =>
          index !== indice
      )

    );

  };


  // =========================================================
  // CALCULAR QUANTIDADE TOTAL
  // =========================================================

  const quantidadeTotal =
    carrinho.reduce(

      (total, produto) =>

        total +
        (
          Number(
            produto.quantidade
          ) || 1
        ),

      0

    );


  // =========================================================
  // CALCULAR VALOR TOTAL
  // =========================================================

  const valorTotal =
    carrinho.reduce(

      (total, produto) => {

        const quantidade =
          Number(
            produto.quantidade
          ) || 1;


        const preco =
          Number(
            produto.preco
          ) || 0;


        return (
          total +
          preco * quantidade
        );

      },

      0

    );


  // =========================================================
  // FINALIZAR PEDIDO
  // =========================================================

  const finalizarPedido = () => {

    if (
      carrinho.length === 0
    ) {
      return;
    }


    alert(
      "Pedido pronto para ser finalizado!\n\n"
    );

  };


  // =========================================================
  // IR PARA A LOJA
  // =========================================================

  const voltarParaLoja = () => {

    if (setPagina) {

      setPagina("produtos");

    }

  };


  // =========================================================
  // TELA
  // =========================================================

  return (

    <div className="carrinho-page-wrapper">


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="carrinho-hero">

        <div className="carrinho-intro">

          <span className="section-label bella-logo">

            Bella
            <span className="bella-ponto">
              .
            </span>

          </span>


          <h1>

            Meu <span>Carrinho</span>

          </h1>


          <p>

            Confira seus produtos antes
            de finalizar o pedido.

          </p>

        </div>

      </section>



      {/* =====================================================
          ÁREA DO CARRINHO
      ===================================================== */}

      <main className="carrinho-content">

        <div className="carrinho-container">


          {/* =================================================
              PRODUTOS
          ================================================= */}

          <section
            className="cart-items"
            aria-label="Itens do carrinho"
          >

            <div className="cart-title">

              <div>

                <span className="section-label">
                  SUA SELEÇÃO
                </span>


                <h2>
                  Itens no Carrinho
                </h2>

              </div>


              <span className="cart-total-items">

                {quantidadeTotal === 1
                  ? "1 item"
                  : `${quantidadeTotal} itens`}

              </span>

            </div>


            {/* =================================================
                LISTA DE PRODUTOS
            ================================================= */}

            {carrinho.length > 0 && (

              <div className="cart-list">

                {carrinho.map(
                  (produto, indice) => {

                    const quantidade =
                      Math.max(
                        1,
                        Number(
                          produto.quantidade
                        ) || 1
                      );


                    const preco =
                      Number(
                        produto.preco
                      ) || 0;


                    const subtotal =
                      preco * quantidade;


                    const info =
                      produtosInfo[
                        produto.nome
                      ] || {

                        categoria: "Produto",

                        descricao:
                          "Produto selecionado na loja.",

                        imagem: "",

                      };


                    return (

                      <article
                        className="cart-item"
                        key={`${produto.nome}-${indice}`}
                      >


                        {/* IMAGEM */}

                        <img
                          src={
                            produto.imagem ||
                            info.imagem
                          }
                          alt={produto.nome}
                        />


                        {/* INFORMAÇÕES */}

                        <div className="item-info">

                          <span className="item-category">

                            {info.categoria}

                          </span>


                          <h3>

                            {produto.nome}

                          </h3>


                          <p>

                            {info.descricao}

                          </p>

                        </div>


                        {/* PREÇO */}

                        <strong className="item-price">

                          {formatarPreco(
                            subtotal
                          )}

                        </strong>


                        {/* QUANTIDADE */}

                        <div className="quantity-wrap">

                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() =>
                              alterarQuantidade(
                                indice,
                                -1
                              )
                            }
                          >

                            −

                          </button>


                          <input
                            type="number"
                            className="quantity"
                            min="1"
                            value={quantidade}
                            onChange={(e) =>
                              alterarInputQuantidade(
                                indice,
                                e.target.value
                              )
                            }
                          />


                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() =>
                              alterarQuantidade(
                                indice,
                                1
                              )
                            }
                          >

                            +

                          </button>

                        </div>


                        {/* REMOVER */}

                        <button
                          type="button"
                          className="remove-item"
                          onClick={() =>
                            removerProduto(
                              indice
                            )
                          }
                          title="Remover produto"
                        >

                          ×

                        </button>


                      </article>

                    );

                  }

                )}

              </div>

            )}


            {/* =================================================
                CARRINHO VAZIO
            ================================================= */}

            {carrinho.length === 0 && (

              <div className="empty-cart">

                <div className="empty-cart-icon">
                  🛒
                </div>


                <h3>
                  Seu carrinho está vazio
                </h3>


                <p>

                  Adicione produtos da nossa
                  loja para vê-los aqui.

                </p>


                <button
                  type="button"
                  className="btn-voltar-loja"
                  onClick={voltarParaLoja}
                >

                  <span>
                    ▣
                  </span>

                  Ir para a loja

                </button>

              </div>

            )}

          </section>



          {/* =================================================
              RESUMO
          ================================================= */}

          <aside className="summary">

            <span className="section-label">
              RESUMO
            </span>


            <h3>
              Resumo do pedido
            </h3>


            <div className="summary-line">

              <span>
                Total dos produtos
              </span>


              <span>
                {formatarPreco(
                  valorTotal
                )}
              </span>

            </div>


            <div className="summary-line">

              <span>
                Frete
              </span>


              <span className="free-shipping">
                Grátis
              </span>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>
                Total
              </span>


              <strong>

                {formatarPreco(
                  valorTotal
                )}

              </strong>

            </div>


            <button
              className="checkout"
              type="button"
              disabled={
                carrinho.length === 0
              }
              onClick={finalizarPedido}
            >

              ✓

              Fazer Pedido

            </button>


            <button
              type="button"
              className="continue-shopping"
              onClick={voltarParaLoja}
            >

              ←

              Continuar comprando

            </button>


          </aside>


        </div>

      </main>

    </div>

  );

}

export default Carrinho;
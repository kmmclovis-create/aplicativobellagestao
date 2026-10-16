import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./Produtos.css";

function Produtos() {

  const [pesquisa, setPesquisa] = useState("");
  const [produtos, setProdutos] = useState([]);

  // Carregar produtos do Supabase ao montar o componente
  useEffect(() => {
    async function carregarProdutos() {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao carregar produtos do Supabase:", error.message);
      } else if (data) {
        setProdutos(data);
      }
    }

    carregarProdutos();
  }, []);


  // ==============================
  // PESQUISA
  // ==============================

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = pesquisa.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      (produto.nome && produto.nome.toLowerCase().includes(termo)) ||
      (produto.categoria && produto.categoria.toLowerCase().includes(termo)) ||
      (produto.descricao && produto.descricao.toLowerCase().includes(termo)) ||
      (produto.preco && produto.preco.toString().includes(termo))
    );
  });


  // ==============================
  // ADICIONAR AO CARRINHO (SUPABASE / SESSIONSTORAGE)
  // ==============================

  async function adicionarCarrinho(produto) {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Se estiver logado, grava na tabela carrinho_itens do Supabase
        const { data: itemExistente, error: erroBusca } = await supabase
          .from("carrinho_itens")
          .select("id, quantidade")
          .eq("perfil_id", user.id)
          .eq("produto_id", produto.id)
          .maybeSingle();

        if (erroBusca) {
          console.error("Erro ao verificar item no carrinho:", erroBusca.message);
        }

        if (itemExistente) {
          // Atualiza a quantidade se já existir
          const { error: erroUpdate } = await supabase
            .from("carrinho_itens")
            .update({ quantidade: itemExistente.quantidade + 1 })
            .eq("id", itemExistente.id);

          if (erroUpdate) throw erroUpdate;
        } else {
          // Insere um novo registo se não existir
          const { error: erroInsert } = await supabase
            .from("carrinho_itens")
            .insert([{
              perfil_id: user.id,
              produto_id: produto.id,
              quantidade: 1,
              selecionado: true
            }]);

          if (erroInsert) throw erroInsert;
        }
      } else {
        // Se for visitante, utiliza o sessionStorage
        const carrinhoSalvo = sessionStorage.getItem("carrinho");
        const carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

        const indiceExistente = carrinho.findIndex(
          (item) => item.id === produto.id
        );

        if (indiceExistente !== -1) {
          carrinho[indiceExistente] = {
            ...carrinho[indiceExistente],
            quantidade:
              (Number(carrinho[indiceExistente].quantidade) || 1) + 1
          };
        } else {
          carrinho.push({
            id: produto.id,
            nome: produto.nome,
            categoria: produto.categoria,
            descricao: produto.descricao,
            preco: Number(produto.preco),
            imagem: produto.imagem_url,
            quantidade: 1,
            selecionado: true
          });
        }

        sessionStorage.setItem(
          "carrinho",
          JSON.stringify(carrinho)
        );
      }

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
    return Number(preco).toLocaleString(
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
                    src={produto.imagem_url || ""}
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

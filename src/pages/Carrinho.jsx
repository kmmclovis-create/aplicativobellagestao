import { useEffect, useState } from "react";
import { supabase } from "../supabase"; // Ajuste o caminho conforme a localização do seu ficheiro supabase.js
import "./Carrinho.css";

function Carrinho({ setPagina }) {

  const [carrinho, setCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // =========================================================
  // CARREGAR CARRINHO (SUPABASE OU SESSIONSTORAGE)
  // =========================================================
  useEffect(() => {
    async function carregarCarrinho() {
      setCarregando(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Utilizador não logado: lê do sessionStorage
          const salvo = JSON.parse(sessionStorage.getItem("carrinho")) || [];
          setCarrinho(salvo);
        } else {
          // Utilizador logado: busca da tabela carrinho_itens com join na tabela produtos
          const { data, error } = await supabase
            .from("carrinho_itens")
            .select(`
              id,
              quantidade,
              selecionado,
              produto_id,
              produtos (
                nome,
                preco,
                descricao,
                categoria,
                imagem_url
              )
            `)
            .eq("perfil_id", user.id);

          if (error) {
            console.error("Erro ao carregar carrinho do Supabase:", error.message);
            setCarrinho([]);
          } else if (data) {
            const formatados = data.map((item) => ({
              idCarrinho: item.id,
              id: item.produto_id,
              nome: item.produtos.nome,
              preco: Number(item.produtos.preco),
              descricao: item.produtos.descricao,
              categoria: item.produtos.categoria,
              imagem: item.produtos.imagem_url,
              quantidade: item.quantidade,
              selecionado: item.selecionado !== false
            }));
            setCarrinho(formatados);
          }
        }
      } catch (erro) {
        console.error("Erro ao obter carrinho:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarCarrinho();
  }, []);


  // =========================================================
  // FORMATAR PREÇO
  // =========================================================
  const formatarPreco = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };


  // =========================================================
  // ALTERAR QUANTIDADE (BD OU SESSIONSTORAGE)
  // =========================================================
  const alterarQuantidade = async (indice, alteracao) => {
    const itemAlvo = carrinho[indice];
    const novaQtd = Math.max(1, (Number(itemAlvo.quantidade) || 1) + alteracao);

    const novoCarrinho = [...carrinho];
    novoCarrinho[indice].quantidade = novaQtd;
    setCarrinho(novoCarrinho);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    } else if (itemAlvo.idCarrinho) {
      await supabase
        .from("carrinho_itens")
        .update({ quantidade: novaQtd })
        .eq("id", itemAlvo.idCarrinho);
    }
  };


  // =========================================================
  // ALTERAR QUANTIDADE PELO INPUT
  // =========================================================
  const alterarInputQuantidade = async (indice, valor) => {
    const novaQtd = Math.max(1, Number(valor) || 1);

    const novoCarrinho = [...carrinho];
    novoCarrinho[indice].quantidade = novaQtd;
    setCarrinho(novoCarrinho);

    const { data: { user } } = await supabase.auth.getUser();
    const itemAlvo = carrinho[indice];

    if (!user) {
      sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    } else if (itemAlvo.idCarrinho) {
      await supabase
        .from("carrinho_itens")
        .update({ quantidade: novaQtd })
        .eq("id", itemAlvo.idCarrinho);
    }
  };


  // =========================================================
  // REMOVER PRODUTO (BD OU SESSIONSTORAGE)
  // =========================================================
  const removerProduto = async (indice) => {
    const itemAlvo = carrinho[indice];
    const novoCarrinho = carrinho.filter((_, index) => index !== indice);
    setCarrinho(novoCarrinho);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
    } else if (itemAlvo.idCarrinho) {
      await supabase
        .from("carrinho_itens")
        .delete()
        .eq("id", itemAlvo.idCarrinho);
    }
  };


  // =========================================================
  // CÁLCULOS (QUANTIDADE E VALOR TOTAL DOS SELECIONADOS)
  // =========================================================
  const quantidadeTotal = carrinho.reduce(
    (total, produto) => total + (Number(produto.quantidade) || 1),
    0
  );

  const valorTotal = carrinho.reduce((total, produto) => {
    if (produto.selecionado === false) return total;
    const quantidade = Number(produto.quantidade) || 1;
    const preco = Number(produto.preco) || 0;
    return total + preco * quantidade;
  }, 0);


 // =========================================================
  // FINALIZAR PEDIDO (DIRECIONA PARA O PAGAMENTO)
  // =========================================================
  const finalizarPedido = () => {
    const itensSelecionados = carrinho.filter(p => p.selecionado !== false);
    
    if (itensSelecionados.length === 0) {
      alert("Selecione pelo menos um item para continuar.");
      return;
    }

    // Guarda os itens selecionados no sessionStorage para a página de pagamento ler
    sessionStorage.setItem("itensSelecionados", JSON.stringify(itensSelecionados));
    
    // Altera a página ativa no componente principal (App.jsx) para o componente de pagamento
    if (setPagina) {
      setPagina("pagamento");
    }
  };


  // =========================================================
  // IR PARA A LOJA
  // =========================================================
  const voltarParaLoja = () => {
    if (setPagina) {
      setPagina("produtos");
    }
  };


  if (carregando) {
    return (
      <div className="carrinho-page-wrapper" style={{ textAlign: "center", padding: "10rem" }}>
        <p>A carregar o seu carrinho...</p>
      </div>
    );
  }


  // =========================================================
  // TELA
  // =========================================================
  return (
    <div className="carrinho-page-wrapper">

      {/* HERO */}
      <section className="carrinho-hero">
        <div className="carrinho-intro">
          <span className="section-label bella-logo">
            Bella
            <span className="bella-ponto">.</span>
          </span>
          <h1>Meu <span>Carrinho</span></h1>
          <p>Confira seus produtos antes de finalizar o pedido.</p>
        </div>
      </section>

      {/* ÁREA DO CARRINHO */}
      <main className="carrinho-content">
        <div className="carrinho-container">

          {/* PRODUTOS */}
          <section className="cart-items" aria-label="Itens do carrinho">
            <div className="cart-title">
              <div>
                <span className="section-label">SUA SELEÇÃO</span>
                <h2>Itens no Carrinho</h2>
              </div>
              <span className="cart-total-items">
                {quantidadeTotal === 1 ? "1 item" : `${quantidadeTotal} itens`}
              </span>
            </div>

            {/* LISTA DE PRODUTOS */}
            {carrinho.length > 0 && (
              <div className="cart-list">
                {carrinho.map((produto, indice) => {
                  const quantidade = Math.max(1, Number(produto.quantidade) || 1);
                  const preco = Number(produto.preco) || 0;
                  const subtotal = preco * quantidade;

                  return (
                    <article className="cart-item" key={produto.id || indice}>
                      {/* IMAGEM */}
                      <img
                        src={produto.imagem || ""}
                        alt={produto.nome}
                      />

                      {/* INFORMAÇÕES */}
                      <div className="item-info">
                        <span className="item-category">
                          {produto.categoria || "Produto"}
                        </span>
                        <h3>{produto.nome}</h3>
                        <p>{produto.descricao || ""}</p>
                      </div>

                      {/* PREÇO */}
                      <strong className="item-price">
                        {formatarPreco(subtotal)}
                      </strong>

                      {/* QUANTIDADE */}
                      <div className="quantity-wrap">
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => alterarQuantidade(indice, -1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="quantity"
                          min="1"
                          value={quantidade}
                          onChange={(e) => alterarInputQuantidade(indice, e.target.value)}
                        />
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => alterarQuantidade(indice, 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* REMOVER */}
                      <button
                        type="button"
                        className="remove-item"
                        onClick={() => removerProduto(indice)}
                        title="Remover produto"
                      >
                        ×
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {/* CARRINHO VAZIO */}
            {carrinho.length === 0 && (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos da nossa loja para vê-los aqui.</p>
                <button
                  type="button"
                  className="btn-voltar-loja"
                  onClick={voltarParaLoja}
                >
                  <span>▣</span>
                  Ir para a loja
                </button>
              </div>
            )}
          </section>

          {/* RESUMO */}
          <aside className="summary">
            <span className="section-label">RESUMO</span>
            <h3>Resumo do pedido</h3>

            <div className="summary-line">
              <span>Total dos produtos</span>
              <span>{formatarPreco(valorTotal)}</span>
            </div>

            <div className="summary-line">
              <span>Frete</span>
              <span className="free-shipping">Grátis</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatarPreco(valorTotal)}</strong>
            </div>

            <button
              className="checkout"
              type="button"
              disabled={carrinho.length === 0}
              onClick={finalizarPedido}
            >
              ✓ Fazer Pedido
            </button>

            <button
              type="button"
              className="continue-shopping"
              onClick={voltarParaLoja}
            >
              ← Continuar comprando
            </button>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default Carrinho;

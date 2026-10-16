
import { useState } from "react";
import "./Pagamento.css";

const moeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function Pagamento({ setPagina }) {
  // Recupera os produtos escolhidos no carrinho.
  const [produtos] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("itensSelecionados") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Guarda a forma de pagamento selecionada.
  const [metodo, setMetodo] = useState("pix");

  // Guarda o nome para identificar o pedido.
  const [nome, setNome] = useState("");

  // Guarda os dados do cartão somente no estado desta página.
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    titular: "",
    validade: "",
    cvv: "",
  });

  // Mensagem exibida após tentar confirmar.
  const [mensagem, setMensagem] = useState("");

  // Calcula o valor total dos produtos selecionados.
  const total = produtos.reduce(
    (soma, produto) =>
      soma +
      (Number(produto.preco) || 0) *
        Math.max(1, Number(produto.quantidade) || 1),
    0
  );

  // Atualiza o campo do cartão que foi alterado.
  const atualizarCartao = (campo, valor) => {
    setDadosCartao((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  };

  // Registra a preferência de pagamento.
  // Não realiza cobranças nem salva os dados do cartão.
  const confirmar = (evento) => {
    evento.preventDefault();

    if (produtos.length === 0) {
      setMensagem(
        "Não há produtos selecionados. Volte ao carrinho para escolher os itens."
      );
      return;
    }

    if (!nome.trim()) {
      setMensagem("Informe seu nome para identificar o pedido.");
      return;
    }

    // Verifica o formato dos campos caso a pessoa escolha cartão.
    if (metodo === "cartao") {
      const numero = dadosCartao.numero.replace(/\D/g, "");

      if (
        numero.length !== 16 ||
        !dadosCartao.titular.trim() ||
        !/^\d{2}\/\d{2}$/.test(dadosCartao.validade) ||
        !/^\d{3,4}$/.test(dadosCartao.cvv)
      ) {
        setMensagem(
          "Confira os dados preenchidos no formulário do cartão."
        );
        return;
      }
    }

    // Salva somente os dados necessários para o resumo demonstrativo.
    // Os dados do cartão não são incluídos neste objeto.
    const pedido = {
      nome: nome.trim(),
      metodo,
      produtos,
      total,
      data: new Date().toISOString(),
      status: "Pagamento não processado",
    };

    sessionStorage.setItem(
      "ultimoPedidoBella",
      JSON.stringify(pedido)
    );

    setMensagem(
      "Sua preferência foi registrada. Nenhum pagamento foi processado. " +
        "Entre em contato com o atendimento da Bella Gestão para combinar os próximos passos."
    );
  };

  // Opções de pagamento reutilizam o mesmo aviso.
  const avisoPagamento =
    "O aplicativo não processa pagamentos online. Sua escolha será registrada apenas como preferência; o atendimento combinará os próximos passos.";

  return (
    <div className="pagamento-page">
      {/* Cabeçalho da página */}
      <header className="payment-header">
        <button
          type="button"
          className="payment-logo"
          onClick={() => setPagina("home")}
        >
          Bella<span>.</span>
        </button>

        <span className="header-note">
          ♡ <span>Finalização do pedido</span>
        </span>
      </header>

      <main className="payment-main">
        {/* Título */}
        <div className="payment-heading">
          <span className="payment-eyebrow">BELLA GESTÃO</span>

          <h1>
            Forma de <em>pagamento</em>
          </h1>

          <p>
            Escolha como prefere combinar o pagamento do seu pedido.
          </p>
        </div>

        <div className="payment-layout">
          {/* Área principal */}
          <section className="payment-card">
            <div className="payment-card-heading">
              <span className="payment-step">1</span>

              <div>
                <h2>Escolha a forma de pagamento</h2>
                <p>
                  Selecione uma opção para continuar.
                </p>
              </div>
            </div>

            {/* Opções de pagamento */}
            <div className="payment-methods">
              {/* Cartão */}
              <button
                type="button"
                className={`payment-method ${
                  metodo === "cartao" ? "active" : ""
                }`}
                onClick={() => {
                  setMetodo("cartao");
                  setMensagem("");
                }}
              >
                <span className="method-icon">▰</span>

                <span className="method-label">
                  <strong>Cartão</strong>
                  <small>Crédito ou débito presencial</small>
                </span>

                <span
                  className="payment-info"
                  tabIndex={0}
                  aria-label={avisoPagamento}
                  onClick={(e) => e.stopPropagation()}
                >
                  i
                  <span className="payment-tooltip" role="tooltip">
                    {avisoPagamento}
                  </span>
                </span>

                <span className="method-radio" />
              </button>

              {/* Pix */}
              <button
                type="button"
                className={`payment-method ${
                  metodo === "pix" ? "active" : ""
                }`}
                onClick={() => {
                  setMetodo("pix");
                  setMensagem("");
                }}
              >
                <span className="method-icon pix-icon">◇</span>

                <span className="method-label">
                  <strong>Pix</strong>
                  <small>Combinar com o atendimento</small>
                </span>

                <span
                  className="payment-info"
                  tabIndex={0}
                  aria-label={avisoPagamento}
                  onClick={(e) => e.stopPropagation()}
                >
                  i
                  <span className="payment-tooltip" role="tooltip">
                    {avisoPagamento}
                  </span>
                </span>

                <span className="method-radio" />
              </button>

              {/* Dinheiro */}
              <button
                type="button"
                className={`payment-method ${
                  metodo === "dinheiro" ? "active" : ""
                }`}
                onClick={() => {
                  setMetodo("dinheiro");
                  setMensagem("");
                }}
              >
                <span className="method-icon">＄</span>

                <span className="method-label">
                  <strong>Dinheiro</strong>
                  <small>Pagamento presencial</small>
                </span>

                <span
                  className="payment-info"
                  tabIndex={0}
                  aria-label={avisoPagamento}
                  onClick={(e) => e.stopPropagation()}
                >
                  i
                  <span className="payment-tooltip" role="tooltip">
                    {avisoPagamento}
                  </span>
                </span>

                <span className="method-radio" />
              </button>
            </div>

            {/* Os campos só aparecem ao selecionar Cartão */}
            {metodo === "cartao" && (
              <div className="card-details">
                <h3>Dados do cartão</h3>

                <p className="card-details-description">
                  Preencha os campos para fins demonstrativos.
                  Nenhuma cobrança será realizada.
                </p>

                <div className="card-field">
                  <label htmlFor="numero-cartao">
                    Número do cartão
                  </label>

                  <input
                    id="numero-cartao"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={dadosCartao.numero}
                    onChange={(e) => {
                      const numero = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(\d{4})(?=\d)/g, "$1 ");

                      atualizarCartao("numero", numero);
                    }}
                  />
                </div>

                <div className="card-field">
                  <label htmlFor="titular-cartao">
                    Nome impresso no cartão
                  </label>

                  <input
                    id="titular-cartao"
                    type="text"
                    autoComplete="off"
                    placeholder="Nome do titular"
                    value={dadosCartao.titular}
                    onChange={(e) =>
                      atualizarCartao("titular", e.target.value)
                    }
                  />
                </div>

                <div className="card-fields-row">
                  <div className="card-field">
                    <label htmlFor="validade-cartao">
                      Validade
                    </label>

                    <input
                      id="validade-cartao"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={dadosCartao.validade}
                      onChange={(e) => {
                        const numeros = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);

                        const validade =
                          numeros.length > 2
                            ? `${numeros.slice(0, 2)}/${numeros.slice(2)}`
                            : numeros;

                        atualizarCartao("validade", validade);
                      }}
                    />
                  </div>

                  <div className="card-field">
                    <label htmlFor="cvv-cartao">CVV</label>

                    <input
                      id="cvv-cartao"
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="***"
                      maxLength={4}
                      value={dadosCartao.cvv}
                      onChange={(e) =>
                        atualizarCartao(
                          "cvv",
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Identificação e confirmação */}
            <form className="payment-form" onSubmit={confirmar}>
              <label htmlFor="nome-pagamento">
                Nome para identificar o pedido
              </label>

              <input
                id="nome-pagamento"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                autoComplete="name"
              />

              <button
                className="payment-confirm"
                type="submit"
                disabled={produtos.length === 0}
              >
                Confirmar preferência de pagamento →
              </button>

              {/* Mantém as mensagens na página */}
              {mensagem && (
                <p className="payment-feedback" role="status">
                  {mensagem}
                </p>
              )}
            </form>

            <button
              type="button"
              className="payment-back"
              onClick={() => setPagina("carrinho")}
            >
              ← Voltar ao carrinho
            </button>
          </section>

          {/* Resumo do pedido */}
          <aside className="order-summary">
            <span className="payment-eyebrow">RESUMO</span>
            <h2>Seu pedido</h2>

            <div className="order-items">
              {produtos.length > 0 ? (
                produtos.map((produto, indice) => {
                  const quantidade = Math.max(
                    1,
                    Number(produto.quantidade) || 1
                  );

                  const preco = Number(produto.preco) || 0;

                  return (
                    <div
                      className="order-item"
                      key={`${produto.nome}-${indice}`}
                    >
                      <div>
                        <strong>{produto.nome}</strong>
                        <small>
                          {quantidade} × {moeda(preco)}
                        </small>
                      </div>

                      <strong>{moeda(preco * quantidade)}</strong>
                    </div>
                  );
                })
              ) : (
                <p className="no-order">
                  Nenhum produto selecionado.
                </p>
              )}
            </div>

            <div className="order-line">
              <span>Subtotal</span>
              <span>{moeda(total)}</span>
            </div>

            <div className="order-line">
              <span>Frete</span>
              <strong>Grátis</strong>
            </div>

            <div className="order-total">
              <span>Total</span>
              <strong>{moeda(total)}</strong>
            </div>

            <p className="order-footnote">
              O pedido será confirmado pelo atendimento.
              Nenhuma cobrança será feita nesta tela.
            </p>
          </aside>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="payment-footer">
        <span>Bella Gestão</span>
        <span>Beleza, cuidado e praticidade.</span>
      </footer>
    </div>
  );
}

export default Pagamento;

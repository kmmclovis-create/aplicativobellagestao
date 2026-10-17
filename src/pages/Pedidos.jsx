import { useState } from "react";
import "./Pedidos.css";

import comboGlowShine from "../assets/imagens/comboglowshine.webp";
import serumNivea from "../assets/imagens/serumnivea.webp";
import comboSiage from "../assets/imagens/Combosiage.webp";

function Pedidos({ setPagina }) {
  const [aba, setAba] = useState("andamento");
  const [aberto1, setAberto1] = useState(true);
  const [aberto2, setAberto2] = useState(false);

  return (
    <main className="pedidos-page">

      <button
        className="voltar-perfil"
        onClick={() => setPagina("perfil")}
      >
        <i className="fa-solid fa-chevron-left"></i>
        Voltar ao perfil
      </button>

      <section className="pedidos-titulo">

        <div className="titulo-icone">
          <i className="fa-solid fa-truck-fast"></i>
        </div>

        <div>
          <h1>Meus Produtos</h1>
          <p>
            Acompanhe o percurso dos produtos que você comprou,
            do pedido até a sua casa.
          </p>
        </div>

      </section>

      <div className="abas">

        <button
          className={aba === "andamento" ? "ativa" : ""}
          onClick={() => setAba("andamento")}
        >
          A caminho
        </button>

        <button
          className={aba === "entregues" ? "ativa" : ""}
          onClick={() => setAba("entregues")}
        >
          Entregues
        </button>

      </div>

      {aba === "andamento" && (

        <article className={`pedido-card ${!aberto1 ? "fechado" : ""}`}>

          <div
            className="pedido-topo"
            onClick={() => setAberto1(!aberto1)}
          >

            <div>

              <span className="pedido-numero">
                Pedido #483920
              </span>

              <h2>2 produtos</h2>

              <p>Comprado em 12 de outubro de 2026</p>

            </div>

            <div className="pedido-status">

              <span className="status transito">
                Em trânsito
              </span>

              <i className={`fa-solid ${aberto1 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>

            </div>

          </div>

          {aberto1 && (

            <div className="pedido-corpo">

              <div className="produto-item">

                <img src={comboGlowShine} alt="" />

                <div>

                  <h3>Kit Glow Shine Completo</h3>

                  <span>Quantidade: 1</span>

                </div>

                <strong>R$196,24</strong>

              </div>

              <div className="produto-item">

                <img src={serumNivea} alt="" />

                <div>

                  <h3>Sérum Nivea Luminous 630</h3>

                  <span>Quantidade: 2</span>

                </div>

                <strong>R$108,76</strong>

              </div>

              <div className="rastreio">

                <div className="rastreio-topo">

                  <h3>
                    <i className="fa-solid fa-route"></i>
                    Percurso do pedido
                  </h3>

                  <span>Previsão: 19/10</span>

                </div>

                <div className="barra">
                  <span></span>
                </div>

                <div className="linha-tempo">

                  <div className="etapa concluida">
                    <i className="fa-solid fa-receipt"></i>
                    <div>
                      <h4>Pedido realizado</h4>
                      <p>12/10</p>
                    </div>
                  </div>

                  <div className="etapa concluida">
                    <i className="fa-solid fa-circle-check"></i>
                    <div>
                      <h4>Pagamento aprovado</h4>
                      <p>12/10</p>
                    </div>
                  </div>

                  <div className="etapa concluida">
                    <i className="fa-solid fa-box"></i>
                    <div>
                      <h4>Preparando pedido</h4>
                      <p>13/10</p>
                    </div>
                  </div>

                  <div className="etapa concluida">
                    <i className="fa-solid fa-dolly"></i>
                    <div>
                      <h4>Pedido enviado</h4>
                      <p>14/10</p>
                    </div>
                  </div>

                  <div className="etapa atual">
                    <i className="fa-solid fa-truck-fast"></i>
                    <div>
                      <h4>Em trânsito</h4>
                      <p>16/10</p>
                    </div>
                  </div>

                  <div className="etapa">
                    <i className="fa-solid fa-location-dot"></i>
                    <div>
                      <h4>Saiu para entrega</h4>
                    </div>
                  </div>

                  <div className="etapa">
                    <i className="fa-solid fa-house-circle-check"></i>
                    <div>
                      <h4>Entregue</h4>
                    </div>
                  </div>

                </div>

              </div>

              <div className="pedido-total">
                Total <strong>R$305,00</strong>
              </div>

            </div>

          )}

        </article>

      )}

      {aba === "entregues" && (

        <article className={`pedido-card ${!aberto2 ? "fechado" : ""}`}>

          <div
            className="pedido-topo"
            onClick={() => setAberto2(!aberto2)}
          >

            <div>

              <span className="pedido-numero">
                Pedido #471205
              </span>

              <h2>1 produto</h2>

              <p>Comprado em 3 de outubro de 2026</p>

            </div>

            <div className="pedido-status">

              <span className="status entregue">
                Entregue
              </span>

              <i className={`fa-solid ${aberto2 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>

            </div>

          </div>

          {aberto2 && (

            <div className="pedido-corpo">

              <div className="produto-item">

                <img src={comboSiage} alt="" />

                <div>

                  <h3>Combo Siàge Nutri Acid.Complex</h3>

                  <span>Quantidade: 1</span>

                </div>

                <strong>R$201,70</strong>

              </div>

              <div className="pedido-total">
                Total <strong>R$201,70</strong>
              </div>

            </div>

          )}

        </article>

      )}

    </main>
  );
}

export default Pedidos;
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Pedidos.css";

function Pedidos({ setPagina }) {
  const [aba, setAba] = useState("andamento");
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pedidosAbertos, setPedidosAbertos] = useState({});

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setCarregando(false);
          return;
        }

        const { data, error } = await supabase
          .from('pedidos')
          .select(`
            id,
            valor_total,
            forma_pagamento,
            criado_em,
            itens_pedido (
              quantidade,
              preco_unitario,
              produtos (
                nome,
                imagem_url
              )
            )
          `)
          .eq('perfil_id', user.id)
          .order('criado_em', { ascending: false });

        if (error) throw error;

        setPedidos(data || []);
        
        // Abre o primeiro pedido por padrão, se houver
        if (data && data.length > 0) {
          setPedidosAbertos({ [data[0].id]: true });
        }
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setCarregando(false);
      }
    }

    carregarPedidos();
  }, []);

  const formatarPreco = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Mesma lógica temporal de rastreio utilizada no site
  function calcularStatusEntrega(criadoEm) {
    const dataCriacao = new Date(criadoEm);
    const agora = new Date();
    const diffDias = Math.floor((agora - dataCriacao) / (1000 * 60 * 60 * 24));

    if (diffDias >= 6) {
      return { etapa: 7, progresso: 100, statusTexto: "Entregue", statusClasse: "entregue", entregue: true };
    } else if (diffDias === 5) {
      return { etapa: 6, progresso: 85, statusTexto: "Saiu para entrega", statusClasse: "transito", entregue: false };
    } else if (diffDias === 4) {
      return { etapa: 5, progresso: 68, statusTexto: "Em trânsito", statusClasse: "transito", entregue: false };
    } else if (diffDias === 3) {
      return { etapa: 4, progresso: 50, statusTexto: "Em trânsito", statusClasse: "transito", entregue: false };
    } else if (diffDias === 2) {
      return { etapa: 3, progresso: 33, statusTexto: "Preparando", statusClasse: "transito", entregue: false };
    } else if (diffDias === 1) {
      return { etapa: 2, progresso: 20, statusTexto: "Pagamento aprovado", statusClasse: "transito", entregue: false };
    } else {
      return { etapa: 1, progresso: 10, statusTexto: "Pedido realizado", statusClasse: "transito", entregue: false };
    }
  }

  const togglePedido = (id) => {
    setPedidosAbertos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const pedidosProcessados = pedidos.map(pedido => ({
    ...pedido,
    infoEntrega: calcularStatusEntrega(pedido.criado_em)
  }));

  const pedidosAndamento = pedidosProcessados.filter(p => !p.infoEntrega.entregue);
  const pedidosEntregues = pedidosProcessados.filter(p => p.infoEntrega.entregue);

  const listaAtual = aba === "andamento" ? pedidosAndamento : pedidosEntregues;

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

      {carregando ? (
        <p style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>A carregar pedidos...</p>
      ) : listaAtual.length === 0 ? (
        <div className="empty-orders" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6rem 2rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "2rem" }}>
          <div className="empty-icon" style={{ width: "7rem", height: "7rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", borderRadius: "50%", background: "var(--light)", color: "var(--pink)", fontSize: "2.8rem" }}>
            <i className="fa-solid fa-box-open"></i>
          </div>
          <h2 style={{ marginBottom: ".8rem", color: "var(--dark)", fontSize: "2rem" }}>
            {aba === "andamento" ? "Nenhum pedido a caminho" : "Nenhum pedido entregue"}
          </h2>
          <p style={{ maxWidth: "35rem", marginBottom: "2rem", color: "var(--gray)", fontSize: "1.4rem" }}>
            {aba === "andamento" ? "Não tem nenhum pedido em trânsito no momento." : "Ainda não tem pedidos concluídos no histórico."}
          </p>
          <button
            onClick={() => setPagina("produtos")}
            style={{ display: "flex", alignItems: "center", gap: ".8rem", padding: "1.2rem 1.8rem", borderRadius: "1rem", background: "var(--pink)", color: "#fff", fontSize: "1.4rem", border: "none", cursor: "pointer" }}
          >
            <i className="fa-solid fa-store"></i> Ir para a loja
          </button>
        </div>
      ) : (
        listaAtual.map(pedido => {
          const numeroPedido = `#${pedido.id.toString().slice(0, 6)}`.toUpperCase();
          const dataFormatada = formatarData(pedido.criado_em);
          const totalItens = pedido.itens_pedido.reduce((acc, item) => acc + item.quantidade, 0);
          const aberto = !!pedidosAbertos[pedido.id];
          const info = pedido.infoEntrega;

          const etapasTimeline = [
            { icone: "fa-receipt", titulo: "Pedido realizado", desc: "Recebemos o seu pedido." },
            { icone: "fa-circle-check", titulo: "Pagamento aprovado", desc: "Pagamento confirmado com sucesso." },
            { icone: "fa-box", titulo: "Preparando pedido", desc: "Seus produtos estão sendo separados." },
            { icone: "fa-dolly", titulo: "Pedido enviado", desc: "Entregue à transportadora." },
            { icone: "fa-truck-fast", titulo: "Em trânsito", desc: "A caminho da sua cidade." },
            { icone: "fa-location-dot", titulo: "Saiu para entrega", desc: "O entregador está a caminho." },
            { icone: "fa-house-circle-check", titulo: "Entregue", desc: "Pedido entregue com sucesso!" }
          ];

          return (
            <article key={pedido.id} className={`pedido-card ${!aberto ? "fechado" : ""}`} style={{ marginBottom: "2rem" }}>
              <div
                className="pedido-topo"
                onClick={() => togglePedido(pedido.id)}
              >
                <div>
                  <span className="pedido-numero">{numeroPedido}</span>
                  <h2>{totalItens} {totalItens === 1 ? 'produto' : 'produtos'}</h2>
                  <p>Comprado em {dataFormatada}</p>
                </div>
                <div className="pedido-status">
                  <span className={`status ${info.statusClasse}`}>
                    {info.statusTexto}
                  </span>
                  <i className={`fa-solid ${aberto ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                </div>
              </div>

              {aberto && (
                <div className="pedido-corpo">
                  {pedido.itens_pedido.map((item, idx) => {
                    const p = item.produtos || {};
                    return (
                      <div className="produto-item" key={idx}>
                        <img src={p.imagem_url || "perfil.png"} alt={p.nome || "Produto"} />
                        <div>
                          <h3>{p.nome || "Produto"}</h3>
                          <span>Quantidade: {item.quantidade}</span>
                        </div>
                        <strong>{formatarPreco(item.preco_unitario * item.quantidade)}</strong>
                      </div>
                    );
                  })}

                  <div className="rastreio">
                    <div className="rastreio-topo">
                      <h3>
                        <i className="fa-solid fa-route"></i>
                        Percurso do pedido
                      </h3>
                      <span>{info.entregue ? 'Entregue com sucesso' : 'Previsão em breve'}</span>
                    </div>

                    <div className="barra">
                      <span style={{ width: `${info.progresso}%` }}></span>
                    </div>

                    <div className="linha-tempo">
                      {etapasTimeline.map((etapa, idx) => {
                        const passoNum = idx + 1;
                        let classeEtapa = "";
                        if (passoNum < info.etapa) classeEtapa = "concluida";
                        else if (passoNum === info.etapa) classeEtapa = "atual";

                        return (
                          <div className={`etapa ${classeEtapa}`} key={idx}>
                            <i className={`fa-solid ${etapa.icone}`}></i>
                            <div>
                              <h4>{etapa.titulo}</h4>
                              <p>{etapa.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pedido-total">
                    Total <strong>{formatarPreco(pedido.valor_total)}</strong>
                  </div>
                </div>
              )}
            </article>
          );
        })
      )}

    </main>
  );
}

export default Pedidos;

import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Agendamento.css";

function Agendamento({ setPagina }) {

  // =========================================================
  // DADOS DO PROCEDIMENTO ESCOLHIDO
  // =========================================================

  const [agendamentoDetalhes, setAgendamentoDetalhes] =
    useState(null);


  // =========================================================
  // ESTADOS
  // =========================================================

  const [dataSelecionada, setDataSelecionada] =
    useState(null);

  const [horarioSelecionado, setHorarioSelecionado] =
    useState(null);

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [mensagem, setMensagem] =
    useState("");

  const [erroEmail, setErroEmail] =
    useState("");

  const [erroTelefone, setErroTelefone] =
    useState("");

  // Estado para controlar o mês e ano exibidos no calendário
  const [dataVisualizacao, setDataVisualizacao] = useState(new Date());

  const anoAtual = dataVisualizacao.getFullYear();
  const mesAtual = dataVisualizacao.getMonth();


  // =========================================================
  // CARREGAR PROCEDIMENTO E DADOS DO CLIENTE
  // =========================================================

  useEffect(() => {
    const dadosSalvos = sessionStorage.getItem("agendamentoDetalhes");
    if (dadosSalvos) {
      try {
        setAgendamentoDetalhes(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error("Erro ao ler detalhes do agendamento:", e);
      }
    }

    async function carregarDadosCliente() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");

        const { data: perfil } = await supabase
          .from("perfis")
          .select("nome, telefone")
          .eq("id", user.id)
          .single();

        if (perfil) {
          setNome(perfil.nome || user.user_metadata?.username || "");
          setTelefone(perfil.telefone || "");
        } else {
          setNome(user.user_metadata?.username || "");
        }
      }
    }

    carregarDadosCliente();
  }, []);


  // =========================================================
  // HORÁRIOS DISPONÍVEIS E MAPEAMENTO INTELIGENTE
  // =========================================================

  const horarios = {
    "Limpeza de pele": {
      3: ["08:00", "09:30", "14:00"],
      4: ["09:00", "10:00", "15:00"],
      5: ["08:30", "13:00", "16:00"],
      6: ["09:00", "10:30", "14:30"],
      7: ["08:00", "11:00", "15:00"],
      10: ["09:00", "13:00", "15:30"],
      11: ["08:30", "10:00", "14:00"],
      12: ["09:00", "11:00", "16:00"],
      13: ["08:00", "13:30", "15:00"],
      14: ["10:00", "14:00", "16:00"],
      17: ["08:30", "10:30", "14:30"],
      18: ["09:00", "13:00", "15:00"],
      19: ["08:00", "11:00", "16:00"],
      20: ["09:30", "13:30", "15:30"],
      21: ["08:00", "10:00", "14:00"],
      24: ["09:00", "11:00", "15:00"],
      25: ["08:30", "13:00", "16:00"],
      26: ["09:00", "10:30", "14:30"],
      27: ["08:00", "13:30", "15:30"],
      28: ["10:00", "14:00", "16:00"],
      31: ["08:30", "11:00", "15:00"],
    },
    "Design de sobrancelhas": {
      3: ["08:30", "10:00", "14:30"],
      4: ["09:30", "13:30", "15:30"],
      5: ["08:00", "11:00", "14:00"],
      6: ["09:00", "10:30", "16:00"],
      7: ["08:30", "13:00", "15:30"],
      10: ["08:00", "10:00", "14:00"],
      11: ["09:30", "13:30", "16:00"],
      12: ["08:30", "11:00", "15:00"],
      13: ["09:00", "14:00", "16:00"],
      14: ["08:00", "10:30", "15:30"],
      17: ["09:30", "13:00", "14:30"],
      18: ["08:00", "11:00", "16:00"],
      19: ["09:00", "13:30", "15:00"],
      20: ["08:30", "10:00", "14:30"],
      21: ["09:30", "13:00", "16:00"],
      24: ["08:00", "10:30", "15:00"],
      25: ["09:00", "13:30", "16:00"],
      26: ["08:30", "11:00", "14:30"],
      27: ["09:30", "14:00", "15:30"],
      28: ["08:00", "10:00", "16:00"],
      31: ["09:00", "13:00", "15:00"],
    },
    "Depilação": {
      3: ["09:00", "10:30", "15:00"],
      4: ["08:00", "11:00", "14:00"],
      5: ["09:30", "13:30", "16:00"],
      6: ["08:30", "10:00", "15:30"],
      7: ["09:00", "13:00", "14:30"],
      10: ["08:30", "11:00", "15:00"],
      11: ["09:00", "13:30", "16:00"],
      12: ["08:00", "10:30", "14:30"],
      13: ["09:30", "13:00", "15:30"],
      14: ["08:30", "11:00", "16:00"],
      17: ["09:00", "13:30", "15:00"],
      18: ["08:00", "10:30", "14:00"],
      19: ["09:30", "13:00", "16:00"],
      20: ["08:30", "11:00", "15:30"],
      21: ["09:00", "14:00", "16:00"],
      24: ["08:00", "10:30", "15:00"],
      25: ["09:30", "13:00", "16:00"],
      26: ["08:30", "11:00", "14:30"],
      27: ["09:00", "13:30", "15:30"],
      28: ["08:00", "10:00", "16:00"],
      31: ["09:30", "14:00", "15:00"],
    },
    "Metal Detox": {
      3: ["08:00", "13:00", "15:00"],
      4: ["10:00", "14:00"],
      5: ["09:00", "14:30"],
      6: ["08:30", "13:30"],
      7: ["10:00", "15:00"],
      10: ["09:00", "14:00"],
      11: ["08:30", "13:00"],
      12: ["10:00", "15:30"],
      13: ["09:30", "14:30"],
      14: ["08:00", "13:30"],
      17: ["09:00", "14:00"],
      18: ["10:00", "15:00"],
      19: ["08:30", "13:30"],
      20: ["09:30", "14:30"],
      21: ["08:00", "15:00"],
      24: ["09:00", "13:00"],
      25: ["10:00", "14:30"],
      26: ["08:30", "15:00"],
      27: ["09:30", "13:30"],
      28: ["08:00", "14:00"],
      31: ["10:00", "15:30"],
    },
    "Reconstrução": {
      3: ["09:00", "14:00"],
      4: ["08:30", "13:30", "16:00"],
      5: ["10:00", "15:00"],
      6: ["09:00", "14:30"],
      7: ["08:00", "13:00", "16:00"],
      10: ["09:30", "14:00"],
      11: ["08:00", "13:30", "15:30"],
      12: ["10:00", "14:30"],
      13: ["09:00", "15:00"],
      14: ["08:30", "13:00", "16:00"],
      17: ["09:30", "14:00"],
      18: ["08:00", "13:30", "15:00"],
      19: ["10:00", "14:30"],
      20: ["09:00", "13:00", "16:00"],
      21: ["08:30", "15:00"],
      24: ["09:00", "14:00"],
      25: ["08:30", "13:30", "16:00"],
      26: ["10:00", "15:00"],
      27: ["09:00", "14:30"],
      28: ["08:00", "13:00", "16:00"],
      31: ["09:30", "14:00"],
    },
    "Reparação": {
      3: ["10:00", "14:30"],
      4: ["09:00", "13:00", "15:30"],
      5: ["08:30", "14:00"],
      6: ["09:30", "13:30", "16:00"],
      7: ["08:00", "14:30"],
      10: ["09:00", "13:30", "15:00"],
      11: ["08:30", "14:00"],
      12: ["10:00", "13:00", "16:00"],
      13: ["09:00", "14:30"],
      14: ["08:30", "13:30", "15:30"],
      17: ["10:00", "14:00"],
      18: ["09:00", "13:00", "16:00"],
      19: ["08:30", "14:30"],
      20: ["09:30", "13:30", "15:00"],
      21: ["08:00", "14:00"],
      24: ["09:00", "13:00", "15:30"],
      25: ["08:30", "14:30"],
      26: ["10:00", "13:30", "16:00"],
      27: ["09:00", "14:00"],
      28: ["08:30", "13:00", "15:30"],
      31: ["09:30", "14:30"],
    },
  };

  // Funções para mudar o mês
  const avancarMes = () => {
    setDataVisualizacao(new Date(anoAtual, mesAtual + 1, 1));
    setDataSelecionada(null);
    setHorarioSelecionado(null);
  };

  const voltarMes = () => {
    setDataVisualizacao(new Date(anoAtual, mesAtual - 1, 1));
    setDataSelecionada(null);
    setHorarioSelecionado(null);
  };

  const quantidadeDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const dias = Array.from({ length: quantidadeDias }, (_, index) => index + 1);

  const primeiroDiaDaSemana = new Date(anoAtual, mesAtual, 1).getDay();
  const espacosVazios = Array.from({ length: primeiroDiaDaSemana }, (_, index) => index);

  const nomeMes = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    new Date(anoAtual, mesAtual, 1)
  );
  const nomeMesFormatado = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);


  // =========================================================
  // VERIFICAR SE O DIA JÁ PASSOU
  // =========================================================

  function diaJaPassou(dia) {
    const hojeReal = new Date();
    hojeReal.setHours(0, 0, 0, 0);

    const dataCalendario = new Date(anoAtual, mesAtual, dia);
    dataCalendario.setHours(0, 0, 0, 0);

    return dataCalendario < hojeReal;
  }


  // =========================================================
  // MAPEAR PROCEDIMENTO PARA AS CHAVES DE HORÁRIOS
  // =========================================================

  function obterChaveHorarios() {
    if (!agendamentoDetalhes) return null;
    const texto = (agendamentoDetalhes.variante || agendamentoDetalhes.procedimento || "").toLowerCase();

    if (texto.includes("sobrancelh")) return "Design de sobrancelhas";
    if (texto.includes("depila")) return "Depilação";
    if (texto.includes("limpeza") || texto.includes("facial") || texto.includes("peeling") || texto.includes("dermaplaning") || texto.includes("microagulhamento")) return "Limpeza de pele";
    if (texto.includes("metal") || texto.includes("detox")) return "Metal Detox";
    if (texto.includes("reconstrução") || texto.includes("reconstrucao")) return "Reconstrução";
    if (texto.includes("reparação") || texto.includes("reparacao")) return "Reparação";

    return "Limpeza de pele";
  }


  // =========================================================
  // VERIFICAR SE O DIA TEM HORÁRIO
  // =========================================================

  function diaTemHorario(dia) {
    if (!agendamentoDetalhes) return false;

    const chave = obterChaveHorarios();
    const lista = horarios[chave]?.[dia];
    if (lista) {
      return lista.length > 0;
    }

    const diaSemana = new Date(anoAtual, mesAtual, dia).getDay();
    return diaSemana !== 0; // Libera dias úteis por padrão
  }


  const chaveHorario = obterChaveHorarios();
  const horariosDisponiveis =
    chaveHorario && dataSelecionada
      ? horarios[chaveHorario]?.[dataSelecionada] || ["09:00", "10:30", "14:00", "15:30", "17:00"]
      : [];


  // =========================================================
  // VALIDAÇÕES E CONFIRMAÇÃO
  // =========================================================

  function validarEmail(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) {
      setErroEmail("Digite seu e-mail.");
      return false;
    }
    if (!regex.test(valor)) {
      setErroEmail("Digite um e-mail válido.");
      return false;
    }
    setErroEmail("");
    return true;
  }

  function handleEmailChange(e) {
    let valor = e.target.value.replace(/\s/g, "");
    setEmail(valor);
    if (!valor) {
      setErroEmail("");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErroEmail(regex.test(valor) ? "" : "Digite um e-mail válido.");
  }

  function handleTelefoneChange(e) {
    let valor = e.target.value.replace(/\D/g, "").substring(0, 11);
    if (valor.length <= 2) {
      valor = valor.replace(/(\d{0,2})/, "($1");
    } else if (valor.length <= 7) {
      valor = valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
    setTelefone(valor);
    const numeros = valor.replace(/\D/g, "");
    setErroTelefone(numeros.length > 0 && numeros.length < 11 ? "Digite um telefone válido." : "");
  }

  function validarTelefone() {
    const numeros = telefone.replace(/\D/g, "");
    if (!numeros || numeros.length !== 11) {
      setErroTelefone("Digite um telefone válido.");
      return false;
    }
    setErroTelefone("");
    return true;
  }

  async function confirmarAgendamento() {
    setMensagem("");

    if (!agendamentoDetalhes) {
      setMensagem("Nenhum procedimento foi selecionado.");
      return;
    }

    if (!nome.trim() || !validarEmail(email) || !validarTelefone()) {
      return;
    }

    if (!dataSelecionada) {
      setMensagem("Selecione uma data.");
      return;
    }

    if (diaJaPassou(dataSelecionada)) {
      setMensagem("Não é possível agendar para uma data que já passou.");
      return;
    }

    if (!horarioSelecionado) {
      setMensagem("Selecione um horário.");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMensagem("Usuário não autenticado.");
      return;
    }

    const dataFormatada = `${anoAtual}-${String(
      mesAtual + 1
    ).padStart(2, "0")}-${String(
      dataSelecionada
    ).padStart(2, "0")}`;

    // Monta o nome do procedimento incluindo a variante/opção escolhida
    const nomeProcedimentoCompleto = agendamentoDetalhes.variante
      ? `${agendamentoDetalhes.procedimento} - ${agendamentoDetalhes.variante}`
      : agendamentoDetalhes.procedimento;

    const novoAgendamento = {
      perfil_id: user.id,
      nome_cliente: nome.trim(),
      email: email.trim(),
      procedimento: nomeProcedimentoCompleto,
      data: dataFormatada,
      horario: horarioSelecionado
    };

    const { error } = await supabase
      .from('agendamentos')
      .insert([novoAgendamento]);

    if (error) {
      console.error("Erro ao salvar no Supabase:", error.message);
      setMensagem("Erro ao realizar agendamento: " + error.message);
      return;
    }

    setMensagem("Agendamento realizado com sucesso!");
    sessionStorage.removeItem("agendamentoDetalhes");

    setTimeout(() => {
      if (setPagina) {
        setPagina("agenda");
      }
    }, 1000);
  }
  return (
    <main className="pagina-agendamento">
      <div className="titulo-agendamento">
        <h1>Novo Agendamento</h1>
      </div>

      <div className="conteudo-agendamento">
        <aside className="coluna-informacoes">
          <section className="informacoes">
            <h2>Informações</h2>

            <div className="campo">
              <label>Nome Cliente:</label>
              <input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="campo">
              <label>Email:</label>
              <input
                type="email"
                placeholder="ex: exemplo@gmail.com"
                value={email}
                onChange={handleEmailChange}
                maxLength={100}
              />
              {erroEmail && <small style={{ color: "#b94b65", display: "block", marginTop: "5px" }}>{erroEmail}</small>}
            </div>

            <div className="campo">
              <label>Telefone:</label>
              <input
                type="tel"
                placeholder="ex: (11) 99999-9999"
                value={telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
              />
              {erroTelefone && <small style={{ color: "#b94b65", display: "block", marginTop: "5px" }}>{erroTelefone}</small>}
            </div>
          </section>

          <section className="detalhes-agendamento">
            <h2>Detalhes</h2>
            <p><strong>Procedimento:</strong> {agendamentoDetalhes?.procedimento || "—"}</p>
            {agendamentoDetalhes?.variante && <p><strong>Opção:</strong> {agendamentoDetalhes.variante}</p>}
            <p><strong>Data:</strong> {dataSelecionada ? `${String(dataSelecionada).padStart(2, "0")}/${String(mesAtual + 1).padStart(2, "0")}/${anoAtual}` : "—"}</p>
            <p><strong>Horário:</strong> {horarioSelecionado || "—"}</p>
            <p><strong>Duração:</strong> {agendamentoDetalhes?.duracao || "—"}</p>
            <p><strong>Valor:</strong> {agendamentoDetalhes?.valor || "—"}</p>
            <p><strong>Profissional:</strong> {agendamentoDetalhes?.profissional || "—"}</p>
          </section>
        </aside>

        <section className="area-agendamento">
          <h2>Selecione uma Data</h2>

          <div className="calendario">
            {/* Cabeçalho do mês com botões de navegação */}
            <div className="mes" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button type="button" onClick={voltarMes} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#a95f70" }}>◀</button>
              <span>{nomeMesFormatado} {anoAtual}</span>
              <button type="button" onClick={avancarMes} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#a95f70" }}>▶</button>
            </div>

            <div className="dias-semana">
              <span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            <div className="dias">
              {espacosVazios.map((espaco) => (
                <span key={`vazio-${espaco}`}></span>
              ))}

              {dias.map((dia) => {
                const disponivel = diaTemHorario(dia);
                const passado = diaJaPassou(dia);

                return (
                  <button
                    key={dia}
                    type="button"
                    className={`
                      dia
                      ${dataSelecionada === dia ? "selecionado" : ""}
                      ${passado || (!disponivel && agendamentoDetalhes) ? "indisponivel" : ""}
                    `}
                    disabled={passado || (agendamentoDetalhes && !disponivel)}
                    onClick={() => {
                      if (passado) return;
                      setDataSelecionada(dia);
                      setHorarioSelecionado(null);
                      setMensagem("");
                    }}
                  >
                    {dia}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="area-horarios">
            <h2>Horários Disponíveis</h2>
            {!agendamentoDetalhes ? (
              <p className="aviso-horario">Nenhum procedimento selecionado.</p>
            ) : !dataSelecionada ? (
              <p className="aviso-horario">Selecione uma data para ver os horários.</p>
            ) : horariosDisponiveis.length === 0 ? (
              <p className="aviso-horario">Não há horários disponíveis para esta data.</p>
            ) : (
              <div className="horarios">
                {horariosDisponiveis.map((horario) => (
                  <button
                    key={horario}
                    type="button"
                    className={horarioSelecionado === horario ? "horario selecionado" : "horario"}
                    onClick={() => {
                      setHorarioSelecionado(horario);
                      setMensagem("");
                    }}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            )}
          </div>

          {mensagem && (
            <p className="mensagem-agendamento" style={{ color: mensagem.includes("sucesso") ? "#4f8a61" : "#b94b65" }}>
              {mensagem}
            </p>
          )}

          <button type="button" className="botao-confirmar" onClick={confirmarAgendamento}>
            Confirmar Agendamento
          </button>
        </section>
      </div>
    </main>
  );
}

export default Agendamento;
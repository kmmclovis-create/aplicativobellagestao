import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Agenda.css";

function Agenda({ setPagina }) {

  const [abaAtual, setAbaAtual] = useState("proximos");
  const [agendamentos, setAgendamentos] = useState([]);

  const MESES = [
    "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"
  ];

  const DIAS_SEMANA = [
    "DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"
  ];


  // =========================================================
  // CARREGAR AGENDAMENTOS DO SUPABASE
  // =========================================================

  useEffect(() => {
    async function carregarAgendamentos() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('agendamentos').select('*');
        
        if (user) {
          query = query.eq('perfil_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Erro ao carregar do Supabase:", error.message);
          setAgendamentos([]);
        } else {
          setAgendamentos(data || []);
        }

      } catch (erro) {
        console.warn(
          "Erro ao ler agendamentos:",
          erro
        );
        setAgendamentos([]);
      }
    }

    carregarAgendamentos();
  }, []);


  // =========================================================
  // FORMATAR DATA
  // =========================================================

  const formatarData = (dataISO) => {

    if (!dataISO) {

      return {
        mes: "",
        dia: "",
        diaSemana: "",
        dataFormatada: "",
        dataObj: null
      };

    }


    const [ano, mes, dia] = dataISO
      .split("-")
      .map(Number);


    const dataObj = new Date(
      ano,
      mes - 1,
      dia
    );


    return {

      mes: MESES[dataObj.getMonth()],

      dia: String(
        dataObj.getDate()
      ).padStart(2, "0"),

      diaSemana:
        DIAS_SEMANA[dataObj.getDay()],

      dataFormatada:
        `${String(dia).padStart(2, "0")}/${
          String(mes).padStart(2, "0")
        }/${ano}`,

      dataObj

    };

  };


  // =========================================================
  // CANCELAR AGENDAMENTO (SUPABASE)
  // =========================================================

  const cancelarAgendamento = async (id) => {

    const confirmou = window.confirm(
      "Deseja realmente cancelar este agendamento?"
    );

    if (!confirmou) {
      return;
    }

    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erro ao cancelar agendamento: " + error.message);
      return;
    }

    const listaAtualizada =
      agendamentos.filter(
        (item) =>
          String(item.id) !== String(id)
      );

    setAgendamentos(
      listaAtualizada
    );

  };


  // =========================================================
  // VER DETALHES
  // =========================================================

  const verDetalhes = (agendamento) => {

    const {
      dataFormatada
    } = formatarData(
      agendamento.data
    );


    window.alert(

      `Procedimento: ${agendamento.procedimento}\n` +

      `Data: ${dataFormatada}\n` +

      `Horário: ${agendamento.horario}\n` +

      `Duração: ${agendamento.duracao || "A confirmar"}\n` +

      `Valor: ${agendamento.valor || "Não informado"}\n` +

      `Profissional: ${agendamento.profissional || "Não informado"}\n\n` +

      `Cliente: ${agendamento.nome_cliente || agendamento.nome}\n` +

      `Email: ${agendamento.email}\n` +

      `Telefone: ${agendamento.phone || "Não informado"}`

    );

  };


  // =========================================================
  // DATA E HORA ATUAIS
  // =========================================================

  const agora = new Date();


  // =========================================================
  // FILTRAR AGENDAMENTOS
  // =========================================================

  const agendamentosOrdenados =
    [...agendamentos].sort(
      (a, b) => {

        const dataHoraA =
          `${a.data} ${a.horario || "00:00"}`;

        const dataHoraB =
          `${b.data} ${b.horario || "00:00"}`;


        return dataHoraA.localeCompare(
          dataHoraB
        );

      }
    );


  const agendamentosVisiveis =
    agendamentosOrdenados.filter(
      (agendamento) => {

        if (!agendamento.data) {
          return false;
        }


        // ===================================================
        // CRIAR DATA/HORA DO AGENDAMENTO
        // ===================================================

        const [ano, mes, dia] =
          agendamento.data
            .split("-")
            .map(Number);


        let hora = 0;
        let minuto = 0;


        if (agendamento.horario) {

          const partesHorario =
            agendamento.horario
              .split(":")
              .map(Number);


          hora =
            partesHorario[0] || 0;

          minuto =
            partesHorario[1] || 0;

        }


        const dataHoraAgendamento =
          new Date(
            ano,
            mes - 1,
            dia,
            hora,
            minuto,
            0,
            0
          );


        // ===================================================
        // PRÓXIMOS
        // ===================================================

        if (abaAtual === "proximos") {

          return (
            dataHoraAgendamento >= agora
          );

        }


        // ===================================================
        // ANTERIORES
        // ===================================================

        return (
          dataHoraAgendamento < agora
        );

      }
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <main className="agenda-content">


      {/* ==================================================
          TÍTULO
      ================================================== */}

      <section className="agenda-title">

        <span className="title-decoration">

          <i className="fa-regular fa-calendar"></i>

        </span>


        <div>

          <h1>
            Meus Agendamentos
          </h1>


          <p>
            Confira seus próximos procedimentos
            e acompanhe seus horários.
          </p>

        </div>

      </section>


      {/* ==================================================
          ABAS
      ================================================== */}

      <div className="agenda-tabs">

        <button

          className={
            `tab ${
              abaAtual === "proximos"
                ? "active"
                : ""
            }`
          }

          onClick={() =>
            setAbaAtual("proximos")
          }

        >

          Próximos

        </button>


        <button

          className={
            `tab ${
              abaAtual === "anteriores"
                ? "active"
                : ""
            }`
          }

          onClick={() =>
            setAbaAtual("anteriores")
          }

        >

          Anteriores

        </button>

      </div>


      {/* ==================================================
          LISTA
      ================================================== */}

      {agendamentosVisiveis.length > 0 ? (

        <section className="appointments">

          {agendamentosVisiveis.map(
            (agendamento) => {

              const {
                mes,
                dia,
                diaSemana
              } = formatarData(
                agendamento.data
              );


              const statusClasse =
                agendamento.status === "pending"
                  ? "pending"
                  : "confirmed";


              const statusTexto =
                agendamento.status === "pending"
                  ? "Pendente"
                  : "Confirmado";


              return (

                <article

                  className="appointment-card"

                  key={
                    agendamento.id
                  }

                >


                  {/* ==================================================
                      DATA
                  ================================================== */}

                  <div className="appointment-date">

                    <span className="month">

                      {mes}

                    </span>


                    <strong>

                      {dia}

                    </strong>


                    <span className="day">

                      {diaSemana}

                    </span>

                  </div>


                  {/* ==================================================
                      INFORMAÇÕES
                  ================================================== */}

                  <div className="appointment-info">

                    <div className="appointment-top">

                      <div>

                        <span className="appointment-category">

                          {agendamento.categoria ||
                            "Procedimento"}

                        </span>


                        <h2>

                          {agendamento.procedimento}

                        </h2>

                      </div>


                      <span
                        className={`status ${statusClasse}`}
                      >

                        {statusTexto}

                      </span>

                    </div>


                    {/* ==================================================
                        DETALHES
                    ================================================== */}

                    <div className="appointment-details">

                      <span>

                        <i className="fa-regular fa-clock"></i>

                        {agendamento.horario}

                      </span>


                      <span>

                        <i className="fa-regular fa-hourglass"></i>

                        {agendamento.duracao || "A confirmar"}

                      </span>


                      <span>

                        <i className="fa-regular fa-user"></i>

                        {agendamento.profissional || "Não informado"}

                      </span>

                    </div>


                    {/* ==================================================
                        AÇÕES
                    ================================================== */}

                    <div className="appointment-actions">

                      <button

                        className="details-button"

                        type="button"

                        onClick={() =>
                          verDetalhes(
                            agendamento
                          )
                        }

                      >

                        <i className="fa-regular fa-eye"></i>

                        Ver detalhes

                      </button>


                      <button

                        className="cancel-button"

                        type="button"

                        onClick={() =>
                          cancelarAgendamento(
                            agendamento.id
                          )
                        }

                      >

                        Cancelar

                      </button>

                    </div>

                  </div>

                </article>

              );

            }

          )}

        </section>

      ) : (

        /* ==================================================
           ESTADO VAZIO
        ================================================== */

        <section className="empty-agenda">

          <div className="empty-icon">

            <i className="fa-regular fa-calendar-xmark"></i>

          </div>


          <h2>

            Nenhum agendamento encontrado

          </h2>


          <p>

            Quando você marcar um procedimento,
            ele aparecerá aqui.

          </p>


          <button

            className="schedule-button"

            onClick={() =>
              setPagina("procedimentos")
            }

          >

            <i className="fa-solid fa-plus"></i>

            Agendar procedimento

          </button>

        </section>

      )}

    </main>

  );

}

export default Agenda;
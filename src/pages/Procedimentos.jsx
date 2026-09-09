import { useMemo, useState } from "react";
import "./Procedimentos.css";

import Header from "../components/Header";

import sobrancelhas from "../assets/imagens/sobrancelhas.jpg";
import depilacao from "../assets/imagens/depilacao.avif";
import limpezaDePele from "../assets/imagens/limpeza-de-pele.png";

import corte from "../assets/imagens/corte.jpg";
import finalizacao from "../assets/imagens/finalizacao.jpg";
import hidratacao from "../assets/imagens/hidratação.jpg";
import coloracao from "../assets/imagens/coloracao.jpg";
import mechas from "../assets/imagens/mechas.jpg";
import alisamento from "../assets/imagens/alisamento.webp";

import makeSocial from "../assets/imagens/makesocial.jpg";
import makeInfantil from "../assets/imagens/makeinfantil.jpg";
import makeNoiva from "../assets/imagens/makenoiva.jpg";

function Procedimentos({ setPagina }) {

  const [pesquisa, setPesquisa] = useState("");
  const [selecionados, setSelecionados] = useState({});

  const categorias = [

    {
      nome: "Estética",

      procedimentos: [

        {
          id: "sobrancelhas",

          nome: "Sobrancelhas",

          imagem: sobrancelhas,

          descricao:
            "Cuidados especializados para realçar o formato natural das sobrancelhas, proporcionando um olhar mais harmonioso.",

          opcoes: [
            {
              nome: "Design de sobrancelhas",
              valor: "R$ 35,00",
              duracao: "40 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Sobrancelha com buço",
              valor: "R$ 45,00",
              duracao: "40 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Sobrancelha com henna",
              valor: "R$ 55,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Micropigmentação",
              valor: "R$ 400,00",
              duracao: "1 hora e 30 minutos",
              retoque: "Sim (Pós 30 dias)",
              profissional: "Mailza N. Rufatto"
            }
          ]
        },


        {
          id: "depilacao",

          nome: "Depilação Feminina",

          imagem: depilacao,

          descricao:
            "Procedimentos realizados com cuidado para proporcionar uma pele lisa, macia e bem cuidada.",

          opcoes: [
            {
              nome: "Virilha completa frente e trás",
              valor: "R$ 70,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Virilha só frente",
              valor: "R$ 60,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Virilha lateral ou cavada",
              valor: "R$ 50,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Pernas inteiras",
              valor: "R$ 60,00",
              duracao: "30 minutos",
              retoque: "A confirmar",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Meia pernas",
              valor: "R$ 45,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Braço",
              valor: "R$ 45,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Axilas ou buço",
              valor: "R$ 20,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Rosto (depilação facial)",
              valor: "R$ 50,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Barriga",
              valor: "R$ 25,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Bumbum",
              valor: "R$ 25,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Costas",
              valor: "R$ 25,00",
              duracao: "30 minutos",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            }
          ]
        },


        {
          id: "estetica-facial",

          nome: "Estética Facial",

          imagem: limpezaDePele,

          descricao:
            "Tratamentos especializados para cuidar da pele e proporcionar uma aparência mais saudável, limpa e radiante.",

          opcoes: [
            {
              nome: "Limpeza de pele",
              valor: "R$ 140,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Limpeza com Derma ou Peeling",
              valor: "R$ 190,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Dermaplaning",
              valor: "R$ 100,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Microagulhamento",
              valor: "R$ 160,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            },
            {
              nome: "Peeling de diamante",
              valor: "R$ 100,00",
              duracao: "1 hora",
              retoque: "Não",
              profissional: "Mailza N. Rufatto"
            }
          ]
        }

      ]
    },


    {
      nome: "Cabelo",

      procedimentos: [

        {
          id: "corte",

          nome: "Corte",

          imagem: corte,

          descricao:
            "Corte personalizado pensado para valorizar seu estilo e a beleza natural dos seus cabelos.",

          opcoes: [
            {
              nome: "Corte",
              valor: "R$ 105,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Corte bordado",
              valor: "R$ 154,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "finalizacao",

          nome: "Finalização",

          imagem: finalizacao,

          descricao:
            "Técnicas para finalizar os fios, proporcionando definição, movimento e um acabamento bonito.",

          opcoes: [
            {
              nome: "Lavagem",
              valor: "R$ 40,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Escova",
              valor: "R$ 85,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Adicional Babyliss/Chapinha",
              valor: "R$ 20,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "tratamentos",

          nome: "Tratamentos",

          imagem: hidratacao,

          descricao:
            "Cuidados especiais para recuperar, fortalecer e manter os cabelos saudáveis e bonitos.",

          opcoes: [
            {
              nome: "Hidratação Wella",
              valor: "R$ 149,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Nutrição Wella",
              valor: "R$ 169,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Reconstrução Wella",
              valor: "R$ 189,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Metal Detox L'Oréal",
              valor: "R$ 189,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Reconstrução L'Oréal",
              valor: "R$ 189,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Adicional Metal Detox",
              valor: "R$ 99,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "coloracao",

          nome: "Coloração",

          imagem: coloracao,

          descricao:
            "Transforme a cor dos seus cabelos com técnicas pensadas para um resultado bonito e personalizado.",

          opcoes: [
            {
              nome: "Retoque de raiz",
              valor: "R$ 169,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Tonalização",
              valor: "A partir de R$ 120,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Esfumado de raiz",
              valor: "R$ 120,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Coloração",
              valor: "A partir de R$ 250,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "mechas",

          nome: "Mechas",

          imagem: mechas,

          descricao:
            "Ilumine seus cabelos com mechas personalizadas para valorizar seu visual.",

          opcoes: [
            {
              nome: "Mechas",
              valor: "A partir de R$ 599,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Moreno iluminado",
              valor: "A partir de R$ 450,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Mechas contorno/Color Block",
              valor: "R$ 300,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "alisamentos",

          nome: "Alisamentos",

          imagem: alisamento,

          descricao:
            "Procedimentos para transformar a textura dos fios e proporcionar um acabamento alinhado.",

          opcoes: [
            {
              nome: "Progressiva",
              valor: "A partir de R$ 299,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Selagem",
              valor: "A partir de R$ 290,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Botox",
              valor: "A partir de R$ 220,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        }

      ]
    },


    {
      nome: "Maquiagem",

      procedimentos: [

        {
          id: "maquiagem-social",

          nome: "Maquiagem Social",

          imagem: makeSocial,

          descricao:
            "Produção personalizada para eventos e ocasiões especiais, valorizando seus traços e seu estilo.",

          opcoes: [
            {
              nome: "Maquiagem Social",
              valor: "R$ 230,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Penteado Social",
              valor: "R$ 230,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Pacote Social",
              valor: "R$ 440,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "maquiagem-infantil",

          nome: "Maquiagem Infantil",

          imagem: makeInfantil,

          descricao:
            "Maquiagem delicada e adequada para crianças em ocasiões especiais e eventos.",

          opcoes: [
            {
              nome: "Maquiagem Infantil",
              valor: "R$ 180,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Penteado Infantil",
              valor: "R$ 180,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            },
            {
              nome: "Pacote Infantil",
              valor: "R$ 340,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        },


        {
          id: "noivas",

          nome: "Noivas",

          imagem: makeNoiva,

          descricao:
            "Produção especial para noivas, pensada para tornar seu grande dia ainda mais inesquecível.",

          opcoes: [
            {
              nome: "Pacote Noiva",
              valor: "R$ 1.250,00",
              duracao: "A confirmar",
              retoque: "A confirmar",
              profissional: "Beatriz Bastos"
            }
          ]
        }

      ]
    }

  ];

  const categoriasFiltradas = useMemo(() => {

    const texto = pesquisa.trim().toLowerCase();

    if (!texto) {
      return categorias;
    }

    return categorias
      .map((categoria) => {

        const procedimentosFiltrados =
          categoria.procedimentos.filter((procedimento) => {

            const nome =
              procedimento.nome.toLowerCase();

            const descricao =
              procedimento.descricao.toLowerCase();

            const opcoes =
              procedimento.opcoes
                .map((opcao) =>
                  `${opcao.nome} ${opcao.valor}`
                )
                .join(" ")
                .toLowerCase();

            return (
              nome.includes(texto) ||
              descricao.includes(texto) ||
              opcoes.includes(texto)
            );

          });

        return {
          ...categoria,
          procedimentos: procedimentosFiltrados
        };

      })
      .filter(
        (categoria) =>
          categoria.procedimentos.length > 0
      );

  }, [pesquisa]);

  const selecionarOpcao = (id, index) => {

    setSelecionados((anterior) => ({
      ...anterior,
      [id]: Number(index)
    }));

  };

  const agendar = (procedimento, categoria) => {

    const indice =
      selecionados[procedimento.id] ?? 0;

    const opcao =
      procedimento.opcoes[indice];

    const dados = {

      procedimento: procedimento.nome,

      categoria: categoria.nome,

      variante: opcao.nome,

      valor: opcao.valor,

      duracao: opcao.duracao,

      retoque: opcao.retoque,

      profissional: opcao.profissional

    };

    sessionStorage.setItem(
      "agendamentoDetalhes",
      JSON.stringify(dados)
    );

    if (setPagina) {

      setPagina("agendamento");

    }

  };

  return (
    <>

      <main className="procedimentos-page">

        <section className="procedimentos-hero">

          <div className="procedimentos-intro">

            <span className="section-label">
              CUIDE DE VOCÊ
            </span>

            <h1>
              Nossos <span>Procedimentos</span>
            </h1>

            <p>
              Encontre o procedimento ideal para você
              e escolha o cuidado que melhor atende
              às suas necessidades.
            </p>

          </div>

          <div className="search-container">

            <span className="search-icon">
              🔍
            </span>

            <input
              className="input"
              type="search"
              placeholder="Pesquisar procedimento..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />

            {pesquisa && (
              <button
                className="clear-btn"
                type="button"
                onClick={() => setPesquisa("")}
                aria-label="Limpar pesquisa"
              >
                ×
              </button>
            )}

          </div>

        </section>

        {categoriasFiltradas.map((categoria) => (

          <section
            className="categoria"
            key={categoria.nome}
          >

            <h2 className="titulo-categoria">
              {categoria.nome}
            </h2>

            <div className="container-procedimentos">

              {categoria.procedimentos.map((procedimento) => {

                const indice =
                  selecionados[procedimento.id] ?? 0;

                const opcaoSelecionada =
                  procedimento.opcoes[indice];

                return (
                  <div
                    className="procedimento"
                    key={procedimento.id}
                  >

                    <div className="imagem-procedimento">

                      <img
                        src={procedimento.imagem}
                        alt={procedimento.nome}
                      />

                    </div>

                    <div className="conteudo-procedimento">

                      <h3>
                        {procedimento.nome}
                      </h3>

                      <p>
                        {procedimento.descricao}
                      </p>

                      <div className="opcoes-valor">

                        <label>
                          Opções:
                        </label>

                        <select
                          className="variant-select"
                          value={indice}
                          onChange={(e) =>
                            selecionarOpcao(
                              procedimento.id,
                              e.target.value
                            )
                          }
                        >

                          {procedimento.opcoes.map(
                            (opcao, index) => (

                              <option
                                key={index}
                                value={index}
                              >
                                {opcao.nome} — {opcao.valor}
                              </option>

                            )
                          )}

                        </select>

                      </div>

                      <div className="preco-atual">
                        {opcaoSelecionada.valor}
                      </div>

                      <button
                        type="button"
                        className="btn-agendar"
                        onClick={() =>
                          agendar(
                            procedimento,
                            categoria
                          )
                        }
                      >
                        Agende já
                      </button>

                    </div>

                  </div>
                );

              })}

            </div>

          </section>

        ))}

        {categoriasFiltradas.length === 0 && (

          <div className="nenhum-produto">

            <div className="icone-sem-resultado">
              🔍
            </div>

            <h3>
              Nenhum procedimento encontrado
            </h3>

            <p>
              Tente pesquisar por outro nome,
              categoria ou descrição.
            </p>

          </div>

        )}

      </main>
    </>
  );

}

export default Procedimentos;
import "./CardProcedimento.css";

function CardProcedimento({ imagem, nome, descricao }) {
  return (
    <div className="card-procedimento">
      <img src={imagem} alt={nome} />

      <div className="card-conteudo">
        <h3>{nome}</h3>

        <p>{descricao}</p>

        <button>Agendar</button>
      </div>
    </div>
  );
}

export default CardProcedimento;
import React, { useState, useEffect } from "react";
import "./TodoList.css";
import Icone from "./assets/icon4.png";
function TodoList() {
  const listaStorage = localStorage.getItem("Lista");

  const [lista, setLista] = useState(
    listaStorage ? JSON.parse(listaStorage) : []
  );
  const [novoItem, setNovoItem] = useState("");
  const [indiceModificando, setIndiceModificando] = useState(null);

  useEffect(() => {
    localStorage.setItem("Lista", JSON.stringify(lista));
  }, [lista]);

  function adicionaItem(form) {
    form.preventDefault();
    if (!novoItem) {
      return;
    }
    if (indiceModificando !== null) {
      const listaAux = [...lista];
      listaAux[indiceModificando].text = novoItem; 
      setLista(listaAux);
      setIndiceModificando(null); 
    } else {
      setLista([...lista, { text: novoItem, isCompleted: false }]);
    }
    setNovoItem("");
    document.getElementById("input-entrada").focus();
  }
  function clicou(index) {
    const listaAux = [...lista];
    listaAux[index].isCompleted = !listaAux[index].isCompleted;
    setLista(listaAux);
  }

  function deleta(index) {
    const listaAux = [...lista];
    listaAux.splice(index, 1);
    setLista(listaAux);
  }

  function deletaTudo() {
    setLista([]);
  }

  function iniciarModificacao(index) {
    setNovoItem(lista[index].text); 
    setIndiceModificando(index); 
    document.getElementById("input-entrada").focus();
  }

  return (
    <div>
      <h1>Lista de tarefas</h1>
      <form onSubmit={adicionaItem}>
        <input
          id="input-entrada"
          type="text"
          value={novoItem}
          onChange={(e) => {
            setNovoItem(e.target.value);
          }}
          placeholder="Adicione uma Tarefa"
        />

        <button className="add" type="submit">
          Add
        </button>
      </form>
      <div className="listaTarefas">
        <div style={{ textAlign: "center" }}>
          {lista.length < 1 ? (
            <img className="icone-central" src={Icone} />
          ) : (
            lista.map((item, index) => (
              <div
                key={index}
                className={item.isCompleted ? "item completo" : "item"}
              >
                <span
                  onClick={() => {
                    clicou(index);
                  }}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => {
                    iniciarModificacao(index);
                  }}
                  className="edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    deleta(index);
                  }}
                  className="del"
                >
                  Deletar
                </button>
              </div>
            ))
          )}
          {lista.length > 0 && (
            <button
              onClick={() => {
                deletaTudo();
              }}
              className="deletAll"
            >
              Deletar todas
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";
import Icone from "./assets/icon4.png";

function TodoList() {
  const [lista, setLista] = useState([]);
  const [novoItem, setNovoItem] = useState("");
  const [indiceModificando, setIndiceModificando] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setLista(response.data);
      } catch (error) {
        console.error("Erro ao buscar lista de tarefas:", error);
      }
    }
    fetchData();
  }, []);

  async function adicionaItem(form) {
    form.preventDefault();
    if (!novoItem) {
      return;
    }
    if (indiceModificando !== null) {
      try {
        await axios.put(`https://jsonplaceholder.typicode.com/todos/${lista[indiceModificando].id}`, { title: novoItem });
        const listaAux = [...lista];
        listaAux[indiceModificando].title = novoItem;
        setLista(listaAux);
        setIndiceModificando(null);
      } catch (error) {
        console.error("Erro ao modificar tarefa:", error);
      }
    } else {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', { title: novoItem, completed: false });
        setLista([...lista, response.data]);
        setNovoItem("");
      } catch (error) {
        console.error("Erro ao adicionar nova tarefa:", error);
      }
    }
    setNovoItem("");
    document.getElementById("input-entrada").focus();
  }

  async function clicou(index) {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${lista[index].id}`, { completed: !lista[index].completed });
      const listaAux = [...lista];
      listaAux[index].completed = !listaAux[index].completed;
      setLista(listaAux);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  }

  async function deleta(index) {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${lista[index].id}`);  
      const listaAux = [...lista];
      listaAux.splice(index, 1);
      setLista(listaAux);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  }

  async function deletaTudo() {
    try {
      await Promise.all(lista.map(async (item) => {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${item.id}`);
      }));
      setLista([]);
    } catch (error) {
      console.error("Erro ao deletar todas as tarefas:", error);
    }
  }
  

  function iniciarModificacao(index) {
    setNovoItem(lista[index].title);
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
            <img className="icone-central" src={Icone} alt="Ícone de Lista Vazia" />
          ) : (
            lista.map((item, index) => (
              <div
                key={index}
                className={item.completed ? "item completo" : "item"}
              >
                <span
                  onClick={() => {
                    clicou(index);
                  }}
                >
                  {item.title}
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
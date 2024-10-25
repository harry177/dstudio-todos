import { useEffect, useState } from "react";
import useStore from "../../store";
import "./todo-form.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, editTodo } from "../../api/requests";
import { useAuthToken } from "../../hooks/useAuthToken";
import { ITodo } from "../../types";
import { v4 as uuidv4 } from "uuid";

export const TodoForm = () => {
  const { popup, togglePopup, editingTodo, setEditingTodo } = useStore();
  const [todoTitle, setTodoTitle] = useState("");
  const [todoText, setTodoText] = useState("");
  const [todoDueDate, setTodoDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const { getAuthToken } = useAuthToken();
  const token = getAuthToken();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingTodo) {
      setTodoTitle(editingTodo.title);
      setTodoText(editingTodo.description);
      setTodoDueDate(editingTodo.dueDate.split("T")[0]);
      setIsCompleted(editingTodo.isCompleted);
    } else {
      setTodoTitle("");
      setTodoText("");
      setTodoDueDate("");
      setIsCompleted(false);
    }
  }, [editingTodo]);

  const onClose = () => {
    togglePopup();
    setEditingTodo(null);
  };

  const { mutate: addTodo } = useMutation<ITodo, Error, ITodo>({
    mutationFn: async (todo: ITodo) => {
      if (!token) {
        throw new Error("Token is missing");
      }
      return createTodo(token, todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", token] });
      onClose();
    },
  });

  const { mutate: updateTodo } = useMutation<void, Error, ITodo>({
    mutationFn: async (todo: ITodo) => {
      if (!token) {
        throw new Error("Token is missing");
      }
      return editTodo(token, todo.id, todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", token] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const todo: ITodo = {
      id: editingTodo ? editingTodo.id : uuidv4(),
      title: todoTitle,
      description: todoText,
      isCompleted: isCompleted,
      dueDate: todoDueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTodo) {
      updateTodo(todo);
    } else {
      addTodo(todo);
    }
  };

  return (
    <>
      <div className={`overlay ${popup ? "visible" : ""}`} onClick={onClose} />
      <div className={`popup-container ${popup ? "visible" : ""}`}>
        <input
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
        <textarea
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
        />
        <input
          type="date"
          value={todoDueDate}
          onChange={(event) => setTodoDueDate(event.target.value)}
        />
        {editingTodo && (
          <label>
            Is completed:
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => setIsCompleted((prev) => !prev)}
            />
          </label>
        )}
        <button onClick={handleSubmit}>
          {editingTodo ? "Update" : "Create"}
        </button>
      </div>
    </>
  );
};

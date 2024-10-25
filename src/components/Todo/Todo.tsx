import { ITodo } from "../../types";
import "./todo.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "../../store";
import { deleteTodo } from "../../api/requests";

export const Todo = ({
  id,
  title,
  description,
  dueDate,
  isCompleted,
}: ITodo) => {
  const { token, togglePopup, setEditingTodo } = useStore();

  const queryClient = useQueryClient();

  const { mutate } = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Token is missing");
      }
      return deleteTodo(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", token] });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleDelete = () => {
    if (token) {
      mutate(id);
    }
  };

  const handleEdit = () => {
    togglePopup();
    setEditingTodo({ id, title, description, dueDate, isCompleted });
  };

  return (
    <article className="todo">
      <div className="todo__container">
        <h3 className="todo__title">{title}</h3>
        <p className="todo__text">{description}</p>
        <p className="todo__text">{formatDate(dueDate)}</p>
        {isCompleted && <p className="todo__text">Completed</p>}
      </div>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </article>
  );
};

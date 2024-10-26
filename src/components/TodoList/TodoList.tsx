import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Todo } from "../Todo/Todo";
import { getTodos } from "../../api/requests";
import { ITodo } from "../../types";
import useStore from "../../store";

export const TodoList = () => {
  const { todos, setTodos, token } = useStore();

  const {
    data: fetchedTodos = [],
    isSuccess,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos", token],
    queryFn: () => {
      if (token) {
        return getTodos(token);
      } else {
        throw new Error("No token available");
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTodos(fetchedTodos);
    }
  }, [isSuccess, fetchedTodos]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {todos.map((todo: ITodo) => {
        return (
          <Todo
            key={todo.id}
            id={todo.id}
            title={todo.title}
            description={todo.description}
            dueDate={todo.dueDate}
            isCompleted={todo.isCompleted}
            createdAt={todo.createdAt}
            updatedAt={todo.updatedAt}
          />
        );
      })}
    </>
  );
};

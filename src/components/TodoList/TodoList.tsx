import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, CircularProgress, Typography } from "@mui/material";
import { Todo } from "../Todo/Todo";
import { getTodos } from "../../api/requests";
import { ITodo } from "../../types";
import useStore from "../../store";
import "./todo-list.scss";

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

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <div className="todo-list">
      {todos.length ? (
        todos.map((todo: ITodo) => {
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
        })
      ) : (
        <Typography>Add your first todo!</Typography>
      )}
    </div>
  );
};

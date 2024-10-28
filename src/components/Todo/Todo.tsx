import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Paper, Typography } from "@mui/material";
import { deleteTodo } from "../../api/requests";
import { ITodo } from "../../types";
import useStore from "../../store";
import "./todo.scss";

export const Todo = ({
  id,
  title,
  description,
  dueDate,
  isCompleted,
  createdAt,
  updatedAt,
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
    setEditingTodo({
      id,
      title,
      description,
      dueDate,
      isCompleted,
      createdAt,
      updatedAt,
    });
  };

  return (
    <Card variant="outlined" className="todo">
      <Paper className="todo__container">
        <Typography variant="h6" className="todo__title">
          {title}
        </Typography>
        <div style={{ wordBreak: "break-word" }}>
          <Typography variant="body1" className="todo__text">
            {description}
          </Typography>
        </div>
        <Typography variant="body1" className="todo__text">
          {formatDate(dueDate)}
        </Typography>
        {isCompleted && <p className="todo__text">Completed</p>}
      </Paper>
      <div className="todo__buttons">
        <Button variant="outlined" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
};

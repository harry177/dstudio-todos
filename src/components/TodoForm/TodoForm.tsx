import { useEffect } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { createTodo, editTodo } from "../../api/requests";
import { useAuthToken } from "../../hooks/useAuthToken";
import { ITodo } from "../../types";
import useStore from "../../store";
import "./todo-form.scss";

export const TodoForm = () => {
  const { popup, togglePopup, editingTodo, setEditingTodo } = useStore();

  const { getAuthToken } = useAuthToken();
  const token = getAuthToken();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      isCompleted: false,
    },
  });

  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        description: editingTodo.description,
        dueDate: editingTodo.dueDate.split("T")[0],
        isCompleted: editingTodo.isCompleted,
      });
    } else {
      reset();
    }
  }, [editingTodo]);

  const onClose = () => {
    togglePopup();
    setEditingTodo(null);
  };

  const { mutate: addTodo } = useMutation<void, Error, ITodo>({
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

  const handleForm: SubmitHandler<FieldValues> = (data) => {
    const todo: ITodo = {
      id: editingTodo ? editingTodo.id : uuidv4(),
      title: data.title,
      description: data.description,
      isCompleted: data.isCompleted,
      dueDate: data.dueDate,
      createdAt: editingTodo ? editingTodo.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingTodo) {
      updateTodo(todo);
    } else {
      addTodo(todo);
    }
    reset({
      title: "",
      description: "",
      dueDate: "",
      isCompleted: false,
    });
  };

  return (
    <>
      <div className={`overlay ${popup ? "visible" : ""}`} onClick={onClose} />
      <form
        className={`popup-container ${popup ? "visible" : ""}`}
        onSubmit={handleSubmit(handleForm)}
      >
        <Controller
          control={control}
          name="title"
          render={({ field }) => <input {...field} placeholder="Todo Title" />}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <textarea {...field} placeholder="Todo Description" />
          )}
        />
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => <input type="date" {...field} />}
        />
        {editingTodo && (
          <label>
            Is completed:
            <Controller
              control={control}
              name="isCompleted"
              render={({ field: { onChange, value, ref } }) => (
                <input
                  type="checkbox"
                  ref={ref}
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
          </label>
        )}
        <button type="submit">{editingTodo ? "Update" : "Create"}</button>
      </form>
    </>
  );
};

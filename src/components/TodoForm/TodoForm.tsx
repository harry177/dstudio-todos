import { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { Button, Checkbox, Modal, TextField } from "@mui/material";
import { FormHelperText, Textarea } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enGB } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodo, editTodo } from "../../api/requests";
import { useAuthToken } from "../../hooks/useAuthToken";
import { ITodo } from "../../types";
import { TodoFormSchema, TTodoFormSchema } from "./schema";
import useStore from "../../store";
import "./todo-form.scss";

export const TodoForm = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { popup, togglePopup, editingTodo, setEditingTodo } = useStore();

  const { getAuthToken } = useAuthToken();
  const token = getAuthToken();
  const queryClient = useQueryClient();

  const {
    formState: { errors, isValid },
    control,
    trigger,
    handleSubmit,
    reset,
  } = useForm<TTodoFormSchema>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      isCompleted: false,
    },
    mode: "onChange",
    resolver: zodResolver(TodoFormSchema),
  });

  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        description: editingTodo.description,
        dueDate: new Date(editingTodo.dueDate),
        isCompleted: editingTodo.isCompleted,
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: undefined,
        isCompleted: false,
      });
    }
  }, [editingTodo]);

  useEffect(() => {
    if (!isValid && isClicked) {
      trigger();
      setIsDisabled(true);
      setIsClicked(false);
    }
  }, [isClicked]);

  useEffect(() => {
    if (isValid) {
      setIsDisabled(false);
    }
  }, [isValid]);

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
    reset();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Modal open={popup} onClose={onClose}>
        <form className="popup-container" onSubmit={handleSubmit(handleForm)}>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Todo Title"
                variant="outlined"
                helperText={errors["title"]?.message?.toString()}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Todo Description"
                minRows={3}
                maxRows={5}
              />
            )}
          />
          {errors["description"] && (
            <FormHelperText
              sx={{ paddingLeft: "15px", marginTop: "-15px", fontSize: "13px" }}
            >
              {errors["description"]?.message}
            </FormHelperText>
          )}
          <Controller
            control={control}
            name="dueDate"
            render={({ field: { onChange } }) => (
              <DatePicker
                label={"Due Date"}
                value={editingTodo ? new Date(editingTodo.dueDate) : null}
                onChange={(value) => {
                  onChange(moment(value).format("YYYY-MM-DD"));
                }}
                slotProps={{
                  textField: {
                    helperText: errors["dueDate"]?.message?.toString(),
                  },
                }}
                disablePast
              />
            )}
          />
          {editingTodo && (
            <label>
              Is completed:
              <Controller
                control={control}
                name="isCompleted"
                render={({ field: { onChange, value, ref } }) => (
                  <Checkbox
                    ref={ref}
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )}
              />
            </label>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isDisabled}
            onClick={() => setIsClicked(true)}
          >
            {editingTodo ? "Update" : "Create"}
          </Button>
        </form>
      </Modal>
    </LocalizationProvider>
  );
};

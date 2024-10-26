import { ITodo } from "../types";
import { ILoginData, ILoginResponse, IRegisterData, IRegisterResponse } from "./types";
import { apiClient } from "./instance";

export const signupUser = async (data: IRegisterData): Promise<IRegisterResponse> => {
  const response = await apiClient.post("/InternalLogin/sign-up", data);
  return response.data;
};

export const loginUser = async (data: ILoginData): Promise<ILoginResponse> => {
  const response = await apiClient.post("/InternalLogin", {
    state: "Internal",
    ...data,
  });
  return response.data;
};

export const getTodos = async (token: string): Promise<ITodo[]> => {
  const response = await apiClient.get("/Todos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createTodo = async (token: string, todo: ITodo): Promise<void> => {
  const response = await apiClient.post("/Todos", todo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const editTodo = async (token: string, todoId: string, todo: ITodo): Promise<void> => {
  const response = await apiClient.put(`/Todos/${todoId}`, todo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTodo = async (token: string, todoId: string): Promise<void> => {
  await apiClient.delete(`/Todos/${todoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

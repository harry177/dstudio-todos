import { create } from "zustand";
import { ITodo } from "./types";

interface IStoreState {
  token: null | string;
  setToken: (token: string) => void;
  todos: ITodo[];
  setTodos: (todos: ITodo[]) => void;
  popup: boolean;
  togglePopup: () => void;
  editingTodo: ITodo | null;
  setEditingTodo: (todo: ITodo | null) => void;
}

const useStore = create<IStoreState>((set) => ({
  token: "",
  setToken: (token: string) => set({ token }),
  todos: [],
  setTodos: (todos: ITodo[]) => set({ todos }),
  popup: false,
  togglePopup: () =>
    set((state) => ({
      popup: !state.popup,
    })),
  editingTodo: null,
  setEditingTodo: (todo: ITodo | null) => set({ editingTodo: todo }),
}));

export default useStore;

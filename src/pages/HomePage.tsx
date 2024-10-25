import { TodoForm } from "../components/TodoForm/TodoForm";
import { TodoList } from "../components/TodoList/TodoList";

export const HomePage = () => {
  return (
    <>
      <TodoList />
      <TodoForm />
    </>
  );
};

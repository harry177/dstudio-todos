import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";
import useStore from "../../store";
import "./header.scss";

export const Header = () => {
  const { getAuthToken, removeAuthToken } = useAuthToken();
  const { token, setToken, togglePopup } = useStore();

  const cookieToken = getAuthToken();

  useEffect(() => {
    if (cookieToken && !token) {
      setToken(cookieToken);
    } else if (!cookieToken) {
      setToken("");
    }
  }, []);

  const addTodo = () => {
    togglePopup();
  };

  const handleLogout = () => {
    removeAuthToken();
    setToken("");
  };

  return (
    <header className="header">
      <Link to={"/"} className="header-logo">
        <h1>TodoPlatform</h1>
      </Link>
      <button onClick={addTodo} disabled={!token}>
        Add todo
      </button>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to={"/login"}>
          <button>Login</button>
        </Link>
      )}
      <Link to={"/signup"}>
        <button>Sign up</button>
      </Link>
      {/*{activeUser ? <p>{activeUser}</p> : null}*/}
    </header>
  );
};

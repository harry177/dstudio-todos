import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from '@mui/material';
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
        <Typography variant="h2">TodoPlatform</Typography>
      </Link>
      <Button variant="contained" onClick={addTodo} disabled={!token}>
        Add todo
      </Button>
      {token ? (
        <Button variant="contained" onClick={handleLogout}>Logout</Button>
      ) : (
        <Link to={"/login"}>
          <Button variant="contained">Login</Button>
        </Link>
      )}
      <Link to={"/signup"}>
        <Button variant="contained">Sign up</Button>
      </Link>
    </header>
  );
};

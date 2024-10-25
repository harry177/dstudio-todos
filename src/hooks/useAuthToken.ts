import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const useAuthToken = () => {

  const setAuthToken = (token: string) => {
    Cookies.set("accessToken", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const getAuthToken = () => {
    return Cookies.get("accessToken");
  };

  const removeAuthToken = () => {
    Cookies.remove("accessToken");
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return { setAuthToken, getAuthToken, removeAuthToken };
};

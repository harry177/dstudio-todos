import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { loginUser } from "../../api/requests";
import { ILoginData, ILoginResponse } from "../../api/types";
import { useAuthToken } from "../../hooks/useAuthToken";
import { LoginFormSchema, TLoginFormSchema } from "./schema";
import useStore from "../../store";

export const LoginForm = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const { setToken } = useStore();

  const { setAuthToken } = useAuthToken();

  const navigate = useNavigate();

  const {
    formState: { errors, isValid },
    control,
    trigger,
    handleSubmit,
  } = useForm<TLoginFormSchema>({
    mode: "onChange",
    resolver: zodResolver(LoginFormSchema),
  });

  const { mutate } = useMutation<ILoginResponse, Error, ILoginData>({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setAuthToken(response.accessToken);
      setToken(response.accessToken);
      navigate("/");
    },
    onError: (error) => {
      console.error("Error signing up:", error);
    },
  });

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

  const handleForm: SubmitHandler<FieldValues> = (data) => {
    const user = {
      username: data.nameLabel,
      password: data.passwordLabel,
    };

    mutate(user);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleForm)}>
      <div className="form-input__block">
        <label>Username</label>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
              helperText={errors["nameLabel"]?.message?.toString()}
            />
          )}
          name="nameLabel"
        />
      </div>
      <div className="form-input__block">
        <label>Password</label>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
              helperText={errors["passwordLabel"]?.message?.toString()}
            />
          )}
          name="passwordLabel"
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        disabled={!isValid || isDisabled}
        onClick={() => setIsClicked(true)}
      >
        Login
      </Button>
    </form>
  );
};

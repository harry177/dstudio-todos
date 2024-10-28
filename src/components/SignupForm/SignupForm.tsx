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
import { loginUser, signupUser } from "../../api/requests";
import { IRegisterData, IRegisterResponse } from "../../api/types";
import { useAuthToken } from "../../hooks/useAuthToken";
import { SignupFormSchema, TSignupFormSchema } from "./schema";
import useStore from "../../store";
import "./signup-form.scss";

export const SignupForm = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const { setToken } = useStore();

  const { setAuthToken } = useAuthToken();

  const navigate = useNavigate();

  const {
    formState: { errors, isValid },
    getValues,
    control,
    trigger,
    handleSubmit,
  } = useForm<TSignupFormSchema>({
    mode: "onChange",
    resolver: zodResolver(SignupFormSchema),
  });

  const { mutate } = useMutation<IRegisterResponse, Error, IRegisterData>({
    mutationFn: signupUser,
    onSuccess: async () => {
      const user = {
        username: getValues("emailLabel"),
        password: getValues("passwordLabel"),
      };
      try {
        const loginResponse = await loginUser(user);
        setAuthToken(loginResponse.accessToken);
        setToken(loginResponse.accessToken);
        navigate("/");
      } catch (error) {
        console.error("Error logging in:", error);
      }
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
    const newUser = {
      email: data.emailLabel,
      password: data.passwordLabel,
    };

    mutate(newUser);
    console.log(JSON.stringify(data));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleForm)}>
      <div className="form-input__block">
        <label>Email</label>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
              helperText={errors["emailLabel"]?.message?.toString()}
            />
          )}
          name="emailLabel"
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
      <div className="form-input__block">
        <label>Repeat password</label>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
              helperText={errors["repeatLabel"]?.message?.toString()}
            />
          )}
          name="repeatLabel"
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        disabled={isDisabled}
        onClick={() => setIsClicked(true)}
      >
        Sign up
      </Button>
    </form>
  );
};

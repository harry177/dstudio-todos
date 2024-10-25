import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/requests";
import { ILoginData, ILoginResponse } from "../../api/types";
import { useAuthToken } from "../../hooks/useAuthToken";
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
  } = useForm({
    mode: "onChange",
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
    console.log(JSON.stringify(data));
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(handleForm)}>
      <div className="form-input__block">
        <label>Username</label>
        <Controller
          control={control}
          rules={{ required: true, minLength: 3, maxLength: 30 }}
          render={({ field: { onChange, value } }) => (
            <input
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
            />
          )}
          name="nameLabel"
        />
        {errors?.nameLabel?.type === "required" && (
          <span>The field cannot be empty.</span>
        )}
        {errors?.nameLabel?.type === "minLength" && (
          <span>Username is too short.</span>
        )}
        {errors?.nameLabel?.type === "maxLength" && (
          <span>Username is too long.</span>
        )}
      </div>
      <div className="form-input__block">
        <label>Password</label>
        <Controller
          control={control}
          rules={{ required: true, minLength: 3, maxLength: 20 }}
          render={({ field: { onChange, value } }) => (
            <input
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
            />
          )}
          name="passwordLabel"
        />
        {errors?.passwordLabel?.type === "required" && (
          <span>The field cannot be empty.</span>
        )}
        {errors?.passwordLabel?.type === "minLength" && (
          <span>Password is too short.</span>
        )}
        {errors?.passwordLabel?.type === "maxLength" && (
          <span>Password is too long.</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isDisabled}
        onClick={() => setIsClicked(true)}
      >
        Login
      </button>
    </form>
  );
};

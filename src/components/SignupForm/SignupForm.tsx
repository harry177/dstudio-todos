import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser, signupUser } from "../../api/requests";
import { IRegisterData, IRegisterResponse } from "../../api/types";
import { useAuthToken } from "../../hooks/useAuthToken";
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
  } = useForm({
    mode: "onChange",
  });

  const validatePasswordMatch = (value: string) => {
    const passwordLabel = getValues("passwordLabel");
    return value === passwordLabel || "Passwords do not match";
  };

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
    <form className="signup-form" onSubmit={handleSubmit(handleForm)}>
      <div className="form-input__block">
        <label>Email</label>
        <Controller
          control={control}
          rules={{ required: true, minLength: 3, maxLength: 30 }}
          render={({ field: { onChange, value } }) => (
            <input
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
            />
          )}
          name="emailLabel"
        />
        {errors?.emailLabel?.type === "required" && (
          <span>The field cannot be empty.</span>
        )}
        {errors?.emailLabel?.type === "minLength" && (
          <span>Email is too short.</span>
        )}
        {errors?.emailLabel?.type === "maxLength" && (
          <span>Email is too long.</span>
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
      <div className="form-input__block">
        <label>Repeat password</label>
        <Controller
          control={control}
          rules={{ required: true, validate: validatePasswordMatch }}
          render={({ field: { onChange, value } }) => (
            <input
              onChange={(ev) => onChange(ev)}
              value={value ? value.toString() : ""}
            />
          )}
          name="repeatLabel"
        />
        {errors?.repeatLabel?.type === "required" && (
          <span>The field cannot be empty.</span>
        )}
        {errors?.repeatLabel?.type === "validate" && <span>Not match.</span>}
      </div>
      <button
        type="submit"
        disabled={isDisabled}
        onClick={() => setIsClicked(true)}
      >
        Sign up
      </button>
    </form>
  );
};

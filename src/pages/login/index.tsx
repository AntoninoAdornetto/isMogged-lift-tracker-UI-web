import React, { useState } from "react";
import { FormikTouched, useFormik } from "formik";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import { userLogin } from "@services/auth/login";
import { handleHttpException } from "@utils/handleHttpException";

const Login = () => {
  const [requestMessage, setRequestMessage] = useState("");

  const login = useMutation(userLogin, {
    onError(err) {
      setRequestMessage(handleHttpException(err));
    },
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (data) => {
      const errors: Record<string, string> = {};

      if (!data.email) {
        errors.email = "Email is required";
      }

      if (!data.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
    onSubmit: async (data) => {
      login.mutateAsync(data);
    },
  });

  const isFormFieldValid = (name: keyof FormikTouched<{ email: string; password: string }>) => {
    return !!loginForm.touched[name] && loginForm.errors[name];
  };

  const getErrorMessage = (name: keyof FormikTouched<{ email: string; password: string }>) => {
    return isFormFieldValid(name) && <small className='p-error'>{loginForm.errors[name]}</small>;
  };

  if (login.isSuccess) {
    return <Navigate to={`/dashboard/${login.data.user.user_id}`} replace={true} />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Dialog
        visible={!!requestMessage}
        position='top'
        showHeader={true}
        onHide={() => setRequestMessage("")}
      >
        <div className='flex justify-evenly'>
          <i
            className={classNames({
              pi: true,
              "pi-check-circle": login.isSuccess,
              "pi-times-circle": login.isError,
              "pr-2": true,
            })}
            style={{
              fontSize: "2rem",
              color: `var(--${login.isSuccess ? "green" : "red"}-500)`,
            }}
          ></i>
          <span className='pb-10 pr-5 pl-5'>{requestMessage}</span>
        </div>
      </Dialog>

      <div className='w-3/4'>
        <form className='p-fluid' data-testid='login--form' onSubmit={loginForm.handleSubmit}>
          <div className='mb-5'>
            <span className='p-float-label'>
              <InputText
                autoFocus
                className={classNames({ "p-invalid": isFormFieldValid("email") })}
                data-testid='email--input'
                id='email'
                name='email'
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
              />
              <label htmlFor='email'>Email*</label>
            </span>
            {getErrorMessage("email")}
          </div>

          <div className='mb-5'>
            <span className='p-float-label'>
              <InputText
                className={classNames({ "p-invalid": isFormFieldValid("password") })}
                data-testid='password--input'
                id='password'
                name='password'
                type='password'
                onChange={loginForm.handleChange}
                value={loginForm.values.password}
              />
              <label className='' htmlFor='password'>
                Password*
              </label>
            </span>
            {getErrorMessage("password")}
          </div>

          <Button
            className={classNames({
              "p-button-info": loginForm.isValid,
              "p-button-danger": !loginForm.isValid,
            })}
            label='Login'
            loading={login.isLoading}
            type='submit'
            data-testid='loginSubmitBtn'
          />
        </form>
      </div>
    </div>
  );
};

export default Login;

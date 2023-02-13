import React, { useRef } from "react";
import { FormikTouched, useFormik } from "formik";
import { useMutation } from "react-query";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import { userLogin } from "@services/auth/login";
import { handleHttpException } from "@utils/handleHttpException";

const Login = () => {
  const toast = useRef<Toast>(null);

  const login = useMutation(userLogin, {
    onError(err) {
      toast.current?.show({ severity: "error", detail: handleHttpException(err), life: 3000 });
    },
    onSuccess(data) {
      Cookies.set("user_id", data.user.user_id, {
        expires: new Date(data.session.refresh_token_expires_at),
        sameSite: "Strict",
      });
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
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Toast ref={toast} position='top-center' />

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

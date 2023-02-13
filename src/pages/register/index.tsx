import React, { useEffect, useRef, useState } from "react";
import { FormikTouched, useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Navigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { useMutation } from "react-query";
import Cookies from "js-cookie";

import { createAccount, createAccountRequest } from "@services/account/createAccount";
import { userLogin } from "@services/auth/login";
import { handleHttpException } from "@utils/handleHttpException";

type createAccountRequiredFields = Pick<createAccountRequest, "email" | "password" | "name">;

const Register: React.FC = () => {
  const [userID, setUserID] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  const register = useMutation(createAccount, {
    onError(err) {
      const error = JSON.stringify(handleHttpException(err));
      toast.current?.show({ severity: "error", detail: error, life: 3000 });
      console.error(error);
    },
  });

  const registerForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate(data: createAccountRequest) {
      const errors: Record<string, string> = {};

      if (!data.email) {
        errors.email = "Email is required";
      }

      if (!data.password) {
        errors.password = "Password is required";
      }

      if (!data.name) {
        errors.name = "Name is required";
      }

      return errors;
    },
    async onSubmit(data) {
      register.mutateAsync(data);
    },
  });

  const isFormFieldValid = (name: keyof FormikTouched<createAccountRequiredFields>) => {
    return !!registerForm.touched[name] && registerForm.errors[name];
  };

  const getErrorMessage = (name: keyof FormikTouched<createAccountRequiredFields>) => {
    return isFormFieldValid(name) && <small className='p-error'>{registerForm.errors[name]}</small>;
  };

  useEffect(() => {
    if (!register.isSuccess) return;

    (async () => {
      const res = await userLogin(registerForm.values);
      Cookies.set("user_id", res.user.user_id, {
        expires: new Date(res.session.refresh_token_expires_at),
        sameSite: "Strict",
      });
      setUserID(res.user.user_id);
    })();
  }, [register.isSuccess]);

  if (userID) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <Toast ref={toast} position='top-center' />
      <div className='w-3/4'>
        <form className='p-fluid' data-testid='register--form' onSubmit={registerForm.handleSubmit}>
          <div className='mb-5'>
            <span className='p-float-label'>
              <InputText
                autoFocus
                className={classNames({ "p-invalid": isFormFieldValid("name") })}
                data-testid='name--input'
                id='name'
                name='name'
                onChange={registerForm.handleChange}
                value={registerForm.values.name}
              />
              <label htmlFor='name'>Name*</label>
            </span>
            {getErrorMessage("name")}
          </div>

          <div className='mb-5'>
            <span className='p-float-label'>
              <InputText
                autoFocus
                className={classNames({ "p-invalid": isFormFieldValid("email") })}
                data-testid='email--input'
                id='email'
                name='email'
                onChange={registerForm.handleChange}
                value={registerForm.values.email}
              />
              <label htmlFor='email'>Email*</label>
            </span>
            {getErrorMessage("email")}
          </div>

          <div className='mb-5'>
            <span className='p-float-label'>
              <InputText
                autoFocus
                className={classNames({ "p-invalid": isFormFieldValid("password") })}
                data-testid='password--input'
                id='password'
                name='password'
                type='password'
                onChange={registerForm.handleChange}
                value={registerForm.values.password}
              />
              <label htmlFor='password'>Password*</label>
            </span>
            {getErrorMessage("password")}
          </div>

          <Button
            className={classNames({
              "p-button-info": registerForm.isValid,
              "p-button-danger": !registerForm.isValid,
            })}
            label='Register'
            loading={register.isLoading}
            type='submit'
            data-testid='registerSubmitBtn'
          />
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { FormikTouched, useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Navigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { useMutation } from "react-query";

import { createAccount, createAccountRequest } from "@services/account/createAccount";
import { handleHttpException } from "@utils/handleHttpException";

type createAccountRequiredFields = Pick<createAccountRequest, "email" | "password" | "name">;

const Register: React.FC = () => {
  const [requestMessage, setRequestMessage] = useState("");

  const register = useMutation(createAccount, {
    onError(err) {
      setRequestMessage(JSON.stringify(handleHttpException(err)));
      console.error(requestMessage);
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

  if (register.isSuccess) {
    return <Navigate to={`/dashboard/${register.data.id}`} replace={true} />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
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

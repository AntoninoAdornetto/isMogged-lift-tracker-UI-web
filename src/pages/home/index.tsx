import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import Container from "@layouts/container";
import "./index.css";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface HomeProps {
  navigate?: NavigateFunction;
}

export default function Home({ navigate }: HomeProps) {
  const redirect = navigate ? navigate : useNavigate();

  const footer = (
    <div className='flex justify-around'>
      <Button
        data-testid='registerBtn'
        label='Register'
        className='w-1/3'
        onClick={() => redirect("/register")}
      />
      <Button
        data-testid='loginBtn'
        label='Login'
        className='w-1/3'
        onClick={() => redirect("/login")}
      />
    </div>
  );

  return (
    <Container className='hero--container' id='home--page'>
      <div className='flex justify-center items-center h-full'>
        <Card className='mr-5 ml-5' footer={footer} title='Ready to Mog?'>
          <p className='m-0'>
            Pull up your huggies, grab your oven mitt and get ready to set some PRs
          </p>
        </Card>
      </div>
    </Container>
  );
}

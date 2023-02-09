import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

import Container from "@layouts/container";
import "./index.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const footer = (
    <div className='flex justify-around'>
      <Button label='Register' className='w-1/3' onClick={() => navigate("register")} />
      <Button label='Login' className='w-1/3' onClick={() => navigate("login")} />
    </div>
  );

  return (
    <Container className='hero--container'>
      <div className='flex justify-center items-center h-full'>
        <Card className='mr-5 ml-5' footer={footer} title='Ready to mog?'>
          <p className='m-0'>
            Pull up your huggies, grab your oven mitt and get ready to set some PRs
          </p>
        </Card>
      </div>
    </Container>
  );
};

export default Home;

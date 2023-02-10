import React from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { APIError } from "@lib/axios";
import Navigation from "@layouts/navigation";
import Home from "@pages/home";
import renewToken from "@services/auth/renewToken";

const _10MIN_MS = 600000 as const;

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useQuery("session", renewToken, {
    retry: false,
    refetchInterval: _10MIN_MS,
    onError(err) {
      const error = err as APIError;
      console.error(error.response?.data.error);
      return error.response?.data.error;
    },
  });

  const onRedirect = (route: string) => navigate(route);

  if (data?.user_id) {
    return (
      <>
        {pathname === "/" && <div>Weekly recap component will go here</div>}
        <Navigation userID={data.user_id} />
      </>
    );
  }

  return <Home handleRedirect={onRedirect} />;
}

export default App;

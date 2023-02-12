import React from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Navigation from "@layouts/navigation";
import Home from "@pages/home";
import { renewToken } from "@services/auth/renewToken";
import { handleHttpException } from "@utils/handleHttpException";

const _10MIN_MS = 600000 as const;

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data } = useQuery("session", renewToken, {
    enabled: !!Cookies.get("session_id"),
    retry: false,
    refetchInterval: _10MIN_MS,
    refetchOnWindowFocus: false,
    onError(err) {
      console.error(handleHttpException(err));
      if (pathname !== "/") navigate("/");
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

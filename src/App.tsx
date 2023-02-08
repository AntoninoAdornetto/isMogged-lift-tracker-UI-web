import React from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

import { APIError } from "@lib/axios";
import Navigation from "@layouts/navigation";
import renewToken from "@services/auth/renewToken";
const _10MIN_MS = 600000 as const;

function App() {
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

  if (data?.user_id) {
    return (
      <>
        {pathname === "/" && <div>Weekly recap component will go here</div>}
        <Navigation userID={data.user_id} />
      </>
    );
  }

  return <div data-testid='home--page'>Home Page</div>;
}

export default App;

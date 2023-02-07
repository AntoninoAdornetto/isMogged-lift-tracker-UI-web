import React from "react";
import { useQuery } from "react-query";
import renewToken from "@services/auth/renewToken";

import { type APIError } from "@src/@types/api";
import Navigation from "@layouts/navigation";

function App() {
  const { data } = useQuery("session", renewToken, {
    retry: false,
    onError(err) {
      const error = err as APIError;
      console.error(error.response?.data.error);
      return error.response?.data.error;
    },
  });

  if (data?.user_id) {
    return <Navigation userID={data.user_id} />;
  }

  return <div data-testid='home--page'>Home Page</div>;
}

export default App;

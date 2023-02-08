import React from "react";
import { useQuery } from "react-query";

import { APIError } from "@lib/axios";
import Navigation from "@layouts/navigation/index";
import renewToken from "@services/auth/renewToken";

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

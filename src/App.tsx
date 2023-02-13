import React from "react";
import { useQuery } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import Navigation from "@layouts/navigation";
import { renewToken } from "@services/auth/renewToken";
import { handleHttpException } from "@utils/handleHttpException";

const _10MIN_MS = 600000 as const;

export default function App() {
  const navigate = useNavigate();
  const session = Cookies.get("session_id");
  const userID = Cookies.get("user_id");

  if (!session || !userID) {
    return <Navigate to='/home' replace={true} />;
  }

  useQuery("session", renewToken, {
    enabled: true,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: _10MIN_MS,
    onError(err) {
      console.error(handleHttpException(err));
      navigate("/home");
    },
    onSuccess() {
      navigate("/dashboard/".concat(userID));
    },
  });

  return <Navigation userID={userID} />;
}

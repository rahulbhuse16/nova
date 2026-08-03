import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "./Auth";

const TOKEN_KEY = "nova-token";

export default function AuthWrapper() {
  const navigate = useNavigate();

  const handlers = useMemo(
    () => ({
      onSignIn: async () => {
        localStorage.setItem(TOKEN_KEY, "demo-token");
        navigate("/today");
      },
      onSignUp: async () => {
        localStorage.setItem(TOKEN_KEY, "demo-token");
        navigate("/today");
      },
      onGithubAuth: async () => {
        localStorage.setItem(TOKEN_KEY, "demo-token");
        navigate("/today");
      },
    }),
    [navigate]
  );

  return <Auth {...handlers} />;
}

import { Container } from "@mui/material";

import LoginForm from "@components/LoginForm";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <h1>Welcome back!</h1>
      <p>Please sign in to continue.</p>
      <LoginForm />
    </Container>
  );
}

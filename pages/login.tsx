import { Container, Typography } from "@mui/material";

import LoginForm from "@components/LoginForm";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Welcome back!</Typography>
      <Typography variant="body2">Please sign in to continue.</Typography>
      <LoginForm />
    </Container>
  );
}

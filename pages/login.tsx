import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import styles from '../styles/Login.module.css'
import useUser from '../lib/useUser';

export default function Login() {
  const { mutateUser } = useUser({
    redirectTo: "/settings",
    redirectIfFound: true,
  });

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const body = { username, password }
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 200) {
      const user = await res.json();
      mutateUser(user, false);
    } else {
      setErrorMsg('Login Failed: Your email or password is incorrect');
    }
  }

  return (
    <div className={styles.login}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <TextField
              required
              id="username"
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
        </div>
        <div>
          <TextField
            required
            id="password"
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <Button type="submit" variant="contained" size="large" className={styles.btnSubmit}>Login</Button>
      </form>
      {errorMsg && <Alert severity="error" className={styles.loginAlert}>{errorMsg}</Alert> }
    </div>
  )
}
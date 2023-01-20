import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '../styles/Login.module.css'
import useUser from '../lib/useUser';
import useAlertStore from '../store/alertStore';

export default function Login() {
  const { mutateUser } = useUser({
    redirectTo: "/settings",
    redirectIfFound: true,
  });

  const [user, setUser] = useState<{ username: string, password: string }>({ username: '', password: '' });
  const openAlert = useAlertStore(state => state.openAlert);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user }),
    })
    if (res.status === 200) {
      const resUser = await res.json();
      mutateUser(resUser, false);
    } else {
      openAlert({ message: 'Login Failed: Your email or password is incorrect' });
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
              onChange={(e) => setUser({ ...user, username: e.target.value})}
              value={user.username}
            />
        </div>
        <div>
          <TextField
            required
            id="password"
            type="password"
            label="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value})}
            value={user.password}
          />
        </div>
        <Button type="submit" variant="contained" size="large" className={styles.btnSubmit}>Login</Button>
      </form>
    </div>
  )
}
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <Box sx={{ margin: '5px auto' }}>
          <TextField
              required
              autoFocus
              id="username"
              label="Username"
              onChange={(e) => setUser({ ...user, username: e.target.value})}
              value={user.username}
            />
        </Box>
        <Box sx={{ margin: '5px auto' }}>
          <TextField
            required
            id="password"
            type="password"
            label="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value})}
            value={user.password}
          />
        </Box>
        <Button type="submit" variant="contained" size="large" sx={{ width: '100%' }}>Login</Button>
      </form>
    </Box>
  )
}
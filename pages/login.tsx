import { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from '../styles/Login.module.css'

export default function Login() {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const body = { username, password }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json();
    } catch (error) {
      console.error('Login Error:', error)
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
    </div>
  )
}
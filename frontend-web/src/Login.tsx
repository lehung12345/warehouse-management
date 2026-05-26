import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setMessage(j.error || 'Login failed')
      return
    }

    const j = await res.json()
    const token = j.token
    localStorage.setItem('token', token)
    setMessage('Logged in as ' + (j.user?.username || username) + ' (' + (j.user?.role || '') + ')')
  }

  return (
    <div style={{maxWidth:400, margin:'4rem auto', padding:20, border:'1px solid #ddd', borderRadius:8}}>
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:12}}>
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{width:'100%'}} />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p style={{marginTop:12}}>{message}</p>}
    </div>
  )
}

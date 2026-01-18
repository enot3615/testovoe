/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import axios from 'axios'
import './Users.css'

interface User {
  _id?: string
  name: string
  email: string
  phone: string
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [token, setToken] = useState('')
  const [user, setUser] = useState<User>({ name: '', email: '', phone: '' })
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    if (!token) return setError('Спочатку введіть JWT токен!')
    setError('')

    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-users?limit=6', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка завантаження')
    }
  }

  const addUser = async () => {
    if (!token) return setError('Потрібен токен!')

    try {
      await axios.post('http://localhost:3000/api/v1/add-user', user, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser({ name: '', email: '', phone: '' })
      fetchUsers()
    } catch (err: any) {
      console.log(err)
      setError(err.message || 'Не вдалося створити користувача')
    }
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  return (
    <div className="users-page">
      <h2 className="page-title">Управління Користувачами</h2>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <label className="label-group">
          <span>JWT</span>
          <input
            className="input-modern"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Вставте Bearer токен сюди..."
          />
        </label>
      </div>

      <div className="card">
        <label className="label-group">
          <span>Новий користувач</span>
          <div className="form-col">
            <input
              className="input-modern"
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              placeholder="Ім'я користувача"
            />
            <input
              className="input-modern"
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              placeholder="Email"
            />
            <input
              className="input-modern"
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleUserChange}
              placeholder="Телефон"
            />
            <button className="btn-primary" onClick={addUser}>
              Додати
            </button>
          </div>
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <h3>Список користувачів</h3>
        <button className="btn-primary" onClick={fetchUsers}>
          {'Оновити'}
        </button>
      </div>

      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} className="user-card-item">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
            <span className="user-email" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
              {user.phone}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users

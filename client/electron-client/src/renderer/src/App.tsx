/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Users from './pages/Users'
import './App.css'

function App() {
  return (
    <HashRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <h3>My App</h3>
          <nav>
            <Link to="/" className="nav-link">
              🏠
            </Link>
            <Link to="/users" className="nav-link">
              👥
            </Link>
          </nav>
        </aside>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App

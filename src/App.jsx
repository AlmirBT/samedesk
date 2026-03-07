import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import Tasks from './pages/Tasks'
import UsersPage from './pages/Users'
import Roles from './pages/Roles'
import Tags from './pages/Tags'
import Shifts from './pages/Shifts'
import SettingsPage from './pages/Settings'
import Stats from './pages/Stats'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/shifts" element={<Shifts />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/stats" element={<Stats />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, KeyRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = credentials, 2 = 2FA
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const codeRefs = useRef([])

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleLogin = (e) => {
    e.preventDefault()
    if (!loginValue || !password) {
      setError('Введите логин и пароль')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 800)
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits filled
    if (newCode.every(d => d !== '')) {
      const fullCode = newCode.join('')
      if (fullCode === '123456') {
        setError('')
        setLoading(true)
        setTimeout(() => {
          login(loginValue, password)
          navigate('/', { replace: true })
        }, 500)
      } else {
        setError('Неверный код')
        setCode(['', '', '', '', '', ''])
        setTimeout(() => codeRefs.current[0]?.focus(), 100)
      }
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold">
            Fun<span className="text-red-primary">Time</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">HelpDesk</p>
        </div>

        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Логин</label>
              <input
                type="text"
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                placeholder="ivan_admin"
                className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 focus:ring-1 focus:ring-red-primary/20 transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 focus:ring-1 focus:ring-red-primary/20 transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-light text-sm"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} icon={<LogIn size={18} />}>
              Войти
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <KeyRound size={24} className="text-red-primary" />
              </div>
              <p className="text-sm text-text-secondary">Введите 6-значный код подтверждения</p>
              <p className="text-xs text-text-muted mt-1">Подсказка: 123456</p>
            </div>

            <div className="flex justify-center gap-3">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => codeRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  autoFocus={i === 0}
                  className="w-11 h-13 bg-bg-card border border-border rounded-lg text-center text-xl font-mono text-text-primary focus:outline-none focus:border-red-primary focus:ring-1 focus:ring-red-primary/30 transition-colors"
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-light text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={() => { setStep(1); setCode(['', '', '', '', '', '']); setError('') }}
              className="text-sm text-text-muted hover:text-text-secondary w-full text-center transition-colors cursor-pointer"
            >
              Назад
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

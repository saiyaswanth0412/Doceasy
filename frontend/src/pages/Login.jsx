import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const { isDark } = useTheme()
  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login successful!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Background Decoration */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10'></div>

      <form onSubmit={onSubmitHandler} className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl border ${
        isDark
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2'>
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {state === 'Sign Up'
              ? 'Sign up to book your first appointment'
              : 'Log in to your Doceasy account'
            }
          </p>
        </div>

        {/* Form Fields */}
        <div className='space-y-5 mb-6'>
          {state === 'Sign Up' && (
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder='John Doe'
                required
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 ${
                  isDark
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-slate-900 placeholder-gray-400'
                }`}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='you@example.com'
              required
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 ${
                isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-slate-900 placeholder-gray-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='••••••••'
              required
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 ${
                isDark
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-300 text-slate-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg mb-4'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {/* Toggle State */}
        <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {state === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <button
                type='button'
                onClick={() => setState('Login')}
                className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={() => setState('Sign Up')}
                className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
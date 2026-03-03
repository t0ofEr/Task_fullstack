import { useState } from 'react';
import { login } from '../api/auth';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Completa usuario y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await login(username.trim(), password);
      onLogin(token);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-form" onSubmit={handleSubmit} data-testid="login-form">
        <div className="login-form__header">
          <h1 className="login-form__title">Task Manager</h1>
          <p className="login-form__subtitle">Inicia sesión para continuar</p>
        </div>

        {error && (
          <p className="login-form__error" role="alert">
            {error}
          </p>
        )}

        <label className="login-form__label" htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          className="login-form__input"
          type="text"
          placeholder="Tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          autoComplete="username"
          autoFocus
        />

        <label className="login-form__label" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          className="login-form__input"
          type="password"
          placeholder="Tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />

        <button
          className="btn btn--primary login-form__submit"
          type="submit"
          disabled={loading || !username.trim() || !password}
        >
          {loading ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;

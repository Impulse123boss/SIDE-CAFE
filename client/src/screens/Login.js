import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="brand">Side <span>Café</span></h1>
      <h2>Log in</h2>
      <p className="subtitle">Welcome back!</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue
        </motion.button>
      </form>

      <div className="divider">or</div>
      <p className="forgot-password">Forgot password</p>

      <motion.button
        className="phone-login"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        📞 Continue with phone number
      </motion.button>

      <p className="signup-text">
        Don’t have an account? <span>Sign up</span>
      </p>
    </motion.div>
  );
}

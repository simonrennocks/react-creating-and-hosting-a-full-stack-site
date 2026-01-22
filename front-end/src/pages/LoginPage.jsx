import {useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const auth = getAuth();     
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to login. Please check your credentials and try again.');
    }
  }

  return (
    <> 
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <Link to="/create-account">Create Account</Link>
    </>
  )}
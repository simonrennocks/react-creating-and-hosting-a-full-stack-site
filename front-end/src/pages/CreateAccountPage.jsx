import {useState} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


export default function CreateAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleCreateAccount() {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    } 

    try {
      const auth = getAuth();     
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to Create Account. ' + err.message);
    }
  }
 return (
    <> 
      <h1>Create Acccount</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" id="password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder="Confirm Password" id="confirm-password-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button onClick={handleCreateAccount}>Create Account</button>
      <Link to="/login">Login if you already have an account</Link>
    </>
  )}
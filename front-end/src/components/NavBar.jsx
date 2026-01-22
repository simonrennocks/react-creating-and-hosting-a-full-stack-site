import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useUser } from '../useUser';

export default function NavBar() {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  return (
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/articles'>Articles</Link></li>
        {isLoading ? 
          <li>Loading...</li> : (
          <>
          {user && (
          <li>signed in as {user.email}</li>
          )}
          <li>
            {user ?
            <button onClick={() => signOut(getAuth())}>Logout</button> : 
            <button onClick={() => navigate('/login')}>Login</button>}
          </li>
          </>
      )}
    </ul> 
    </nav>
  );
}
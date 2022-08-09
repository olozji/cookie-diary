import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';

const MainNavigation = () => {
   const authCtx = useContext(AuthContext);
   const isLoggedIn = authCtx.isLoggedIn;
   const googleLog = authCtx.googleLog;

   const logoutHandler = () => {
    alert("정말 로그아웃 하시겠습니까?");
    authCtx.logout();
   }

   const onLogoutSuccess = () => {
    googleLog.onLogout();
  };

  const onLogout = () => {
    if (window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      alert("정말 로그아웃 하시겠습니까?");
      if (auth2 !== null) {
        auth2
          .signOut()
          .then(auth2.disconnect().then(() => onLogoutSuccess()))
          .catch(e => console.log(e));
      }
    }
  };

  return (
    <header className="main_nav_header">
      <nav className="main_nav">
        <ul>
            {!isLoggedIn && (
                <li>
                  <Link to='/'>Login</Link>
              </li>
            )}
          {isLoggedIn && (
              <li>
               <Link to='/profile'>Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
            <Link to='/'><button className='btn_logout' onClick={logoutHandler}>Logout</button></Link>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

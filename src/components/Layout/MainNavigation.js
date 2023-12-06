import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';


const MainNavigation = () => {
   const authCtx = useContext(AuthContext);
   const isLoggedIn = authCtx.isLoggedIn;
   const googleLog = authCtx.googleLog;

  //  const logoutHandler = () => {
  //   alert("정말 로그아웃 하시겠습니까?");
  //   authCtx.logout();
  //  }

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

  const handleLogout = () => {
    // Kakao SDK의 로그아웃 메서드 호출
    alert("정말 로그아웃 하시겠습니까?");
    window.Kakao.Auth.logout();
    authCtx.logout();
  };


  const kakaoLogoutHandler = async () => {
    try {
      const kakaoToken = "092eb3b3a380dfd4afcd4f5d605f2217"; 
        const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
            method: 'POST',
            headers: {
                'Authorization': `KakaoAK ${kakaoToken}`,
            },
        });

        if (response.ok) {
          authCtx.logout();
          response.sessionStorage.clear();				
          response.localStorage.clear();	
            alert('카카오 계정에서 로그아웃되었습니다.');
        } else {
          const errorMessage = await response.text();
          console.error(`카카오 로그아웃에 실패했습니다. 오류 메시지: ${errorMessage}`);
          alert('카카오 로그아웃 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error(error);
        alert('카카오 로그아웃 중 오류가 발생했습니다.');
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
            <Link to='/'><button className='btn_logout' onClick={handleLogout}>Logout</button></Link>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import AuthContext from "../../store/AuthContext";

import {HiOutlineMail } from 'react-icons/hi';
import {RiLockPasswordLine } from 'react-icons/ri';
import KakaoLogin from "react-kakao-login";


const AuthForm = () => {

    const env = process.env;
    env.PUBLIC_URL = env.PUBLIC_URL || "";

    const navigate = useNavigate();

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const authCtx = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const switchAuthHandler = () => {
        setIsLogin((prevState)=> !prevState);
    };

  const REST_API_KEY = "7be77ad3cd613bdca9e2ed92267e38ff"
  const REDIRECT_URI = "http://localhost:3000/oauth"
  const KAKAO_AUTH_URL = `http://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;


   
  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    try {
        const url = isLogin
            ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY'
            : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY';

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword,
                returnSecureToken: true,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('로그인에 실패하였습니다. 아이디 혹은 비밀번호를 확인해주세요');
        }

        const data = await response.json();
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        authCtx.login(data.idToken, expirationTime.toISOString());
        navigate('/home');
    } catch (error) {
        alert(error.message);
    } finally {
        setIsLoading(false);
    }
};

const socialLoginSuccess = (res) => {
    console.log("소셜 로그인 성공");
    console.log(res);
    alert('로그인 성공');
  
    const { response } = res; // 카카오 응답에서 response 객체를 가져옴
    const token = response.access_token; // 액세스 토큰
    const expiresIn = response.expires_in; // 만료 시간 (초 단위)
  
    // 만료 시간을 현재 시간 기준으로 계산
    const expirationTime = new Date(new Date().getTime() + expiresIn * 1000).toISOString();
  
    authCtx.login(token, expirationTime, "kakao");
    navigate('/home');
  };
  
  // 소셜 로그인 실패
  const socialLoginFail = (res) => {
    console.log("소셜 로그인 실패");
    console.log(res);
    alert('로그인 실패')
  };

  const kakaoLogoutHandler = async () => {
    try {
        const response = await fetch('https://kapi.kakao.com/v1/user/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 092eb3b3a380dfd4afcd4f5d605f2217`,
            },
        });

        if (response.ok) {
            alert('카카오 계정에서 로그아웃되었습니다.');
        } else {
            throw new Error('카카오 로그아웃에 실패했습니다.');
        }
    } catch (error) {
        console.error(error);
        alert('카카오 로그아웃 중 오류가 발생했습니다.');
    }
};


    return (
        <section className="Auth_section">
            <div className="Auth_container">
            <img src={process.env.PUBLIC_URL + `assets/Fortnite-Gingerbread.png`}/>
            <p>감정쿠킹 Diary</p>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitHandler} className="auth_form" >
            <div className="email_input">
                <HiOutlineMail/>&nbsp;&nbsp;<label htmlFor="email">이메일</label>
                    <input type='email' id="email" required ref={emailInputRef} />
                </div>
                <div className="password_input">
                    <RiLockPasswordLine />&nbsp;&nbsp;<label htmlFor="password">비밀번호</label>
                    <input type='password' id="password" required ref={passwordInputRef}/>
                </div>
                <div className="auth_btn">
                {!isLoading && (
                         <button className="btn_login">{isLogin ? '로그인' : '새 계정 만들기'}</button>
                    )}
                    {isLoading && <p>Sending request...</p>}
                    <button
                    type="button"
                    className="Auth_btn_toggle"
                    onClick={switchAuthHandler}
                    >
                     {isLogin ? '새로운 계정 만들기' : '기존 계정으로 로그인하기'}   
                    </button>
                    </div>
                    <div className="Auth_form">
                    <span className="Auth_form_line"></span>
                    간편 로그인
                    <span className="Auth_form_line"></span>
                    </div>
                    <div className="auth_btn">
                    {!isLoading && (
                        <KakaoLogin
                        token="092eb3b3a380dfd4afcd4f5d605f2217"
                        onSuccess={(res) => socialLoginSuccess(res)}
                        onFail={(res) => socialLoginFail(res)}
                        onLogout={kakaoLogoutHandler}
                        REDIRECT_URI={KAKAO_AUTH_URL}
                      />
                    )}
                    {isLoading && <p>Sending request...</p>}
                </div>
            </form>
            </div>
           
        </section>
    );
};

export default AuthForm;


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
  const KAKAO_AUTH_URL = `http://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;


   
    const submitHandler = (e) => {
        e.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

    
        setIsLoading(true);
        let url;
        if(isLogin){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCVua7iTTauDBN29gJUxS5BbQ71KlR48_s';
        } else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCVua7iTTauDBN29gJUxS5BbQ71KlR48_s';
        }
        fetch(
           url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password:enteredPassword,
                    returnSecureToken:true,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
    
        ).then(async (res) => {
            setIsLoading(false);
            if(res.ok) {
                return res.json();
            } else {
                const data = await res.json();
                let errorMessage = '로그인에 실패하였습니다. 아이디 혹은 비밀번호를 확인해주세요';
                throw new Error(errorMessage);
            }
        }).then((data) => {
            const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
            authCtx.login(data.idToken, expirationTime.toISOString());
            navigate('/home');
        })
          .catch((err) => {
            alert(err.message);
        });
    }


// 소셜 로그인 성공
// const socialLoginSuccess = (res) => {
//     console.log("소셜 로그인 성공");
//     console.log(res)
//     alert('로그인 성공')
    
//     authCtx.login();
//     navigate('/home');
//   };

const socialLoginSuccess = (res) => {
    console.log("소셜 로그인 성공");
    console.log(res);
    alert('로그인 성공');
  
    const { response } = res; // 카카오 응답에서 response 객체를 가져옴
    const token = response.access_token; // 액세스 토큰
    const expiresIn = response.expires_in; // 만료 시간 (초 단위)
  
    // 만료 시간을 현재 시간 기준으로 계산
    const expirationTime = new Date(new Date().getTime() + expiresIn * 1000).toISOString();
  
    authCtx.login(token, expirationTime);
    navigate('/home');
  };
  
  // 소셜 로그인 실패
  const socialLoginFail = (res) => {
    console.log("소셜 로그인 실패");
    console.log(res);
    alert('로그인 실패')
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
                        onLogout={console.info}
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
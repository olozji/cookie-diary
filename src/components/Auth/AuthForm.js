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

    return (
        <section className="Auth_section">
            <div className="Auth_container">
            <img src={process.env.PUBLIC_URL + `assets/Fortnite-Gingerbread.png`}/>
            <p>감정쿠킹 Diary</p>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <div className="auth_form" >
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
            </div>
            </div>
           
        </section>
    );
};

export default AuthForm;


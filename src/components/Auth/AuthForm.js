import React, { useContext, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import AuthContext from "../../store/AuthContext";

import {HiOutlineMail } from 'react-icons/hi';
import {RiLockPasswordLine } from 'react-icons/ri';


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
            </form>
            </div>
           
        </section>
    );
};

export default AuthForm;
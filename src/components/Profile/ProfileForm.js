import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../store/AuthContext";

import {RiLockPasswordLine } from 'react-icons/ri';

const ProfileForm = () => {
  const navigate = useNavigate();

  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHanlder = (e) => {
    e.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCVua7iTTauDBN29gJUxS5BbQ71KlR48_s',{
        method:'POST',
        body:JSON.stringify({
            idToken:authCtx.token,
            password:enteredNewPassword,
            returnSecureToken:false
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then((res)=>{
        navigate('/');
    });
  }

  return (
    <form onSubmit={submitHanlder}>
      <div className="profile_form">
      <RiLockPasswordLine /><label htmlFor='new-password'>새 비밀번호</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div>
        <button className="profile_btn" onClick={()=>alert('변경시 바꾸실 수 없습니다. 그래도 변경 하시겠습니까?')}>비밀번호 변경</button>
        <button className="profile_cancel" onClick={()=>navigate(-1)}>취소 하기</button>
      </div>
    </form>
  );
}

export default ProfileForm;

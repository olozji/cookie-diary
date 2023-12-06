import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token,loginMethod) => {},
    logout: (loginMethod) => {},
});


const calculateRemainingTime = (expirationTime) => {

    const currentTime = new Date().getTime();

    const adjExpirationTime = new Date(expirationTime).getTime();

    const remaninigDuration = adjExpirationTime - currentTime;

    return remaninigDuration;
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 3600) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
        }
        return {
            token: storedToken,
            duration: remainingTime,
        }
    }

export const AuthContextProvider = (props) => {

    const tokenData = retrieveStoredToken();
    let initialToken;
    if(tokenData) {
        initialToken = tokenData.token;
    }
    
    const [ token, setToken ] = useState(initialToken);
    const [loginMethod, setLoginMethod] = useState(""); // loginMethod 추가

    const userIsLoggedIn = !!token;

    const loginHandler = (token,expirationTime, loginMethod) => {
        setLoginMethod(loginMethod);
        const storageKey = `userInfo_${loginMethod}`;


        setToken(token);
       
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);
        localStorage.setItem('loginMethod', loginMethod); // 추가
        localStorage.setItem(storageKey, JSON.stringify({ token, expirationTime}));


        const remainingTime = calculateRemainingTime(expirationTime);

       logoutTimer = setTimeout(() => logoutHandler(loginMethod),remainingTime);

    };


    const logoutHandler = useCallback(() => {

        const storageKey = `userInfo_${loginMethod}`;

        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('loginMethod', loginMethod); // 추가
        localStorage.removeItem(storageKey);
        console.log(storageKey);
        

        if(logoutTimer){
            clearTimeout(logoutTimer);
        }
    },[loginMethod]);


    useEffect(()=>{
        if(tokenData && userIsLoggedIn) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler,tokenData.duration);
        }
    },[tokenData,userIsLoggedIn,logoutHandler]);

    useEffect(() => {
        const storedLoginMethod = localStorage.getItem('loginMethod');
        if (storedLoginMethod) {
            setLoginMethod(storedLoginMethod);
            console.log(storedLoginMethod)

            const storageKey = `userInfo_${storedLoginMethod}`;
            const storedUserInfo = JSON.parse(localStorage.getItem(storageKey));
            
            if (storedUserInfo) {
                const { token, expirationTime } = storedUserInfo;
                const remainingTime = calculateRemainingTime(expirationTime);
    
                if (remainingTime > 0) {
                    setToken(token);
    
                    logoutTimer = setTimeout(() => logoutHandler(storedLoginMethod), remainingTime);
                }
            }
        }
    }, [logoutHandler]);

    

    const contextValue = {
        token:token,
        isLoggedIn:userIsLoggedIn,
        login:loginHandler,
        logout:logoutHandler,
    };

    return (
    <AuthContext.Provider value={contextValue}>
        {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
import React, { useContext, useEffect, useReducer, useRef } from 'react';

import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import Home from './pages/Home';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import NewDiary from './pages/NewDiary';
import Auth from './pages/Auth';
import Layout from './components/Layout/Layout'
import AuthContext from './store/AuthContext';
import UserProfile from './components/Profile/UserProfile';
import { AuthContextProvider }  from './store/AuthContext';

  const reducer = (state, action) => {

    let newState = [];

    switch (action.type) {
      case 'INIT': {
        return action.data;
      }
      case 'CREATE': {
        const newItem = {
          ...action.data,
        }
        newState = [newItem,...state];
        break;
      }
      case 'REMOVE': {
        newState = state.filter((it)=>
          it.id !== action.targetId
        );
        break;
      }
      case 'EDIT': {
        newState = state.map((it)=>
          it.id === action.data.id ? {...action.data} : it
        );
        break;
      }
      default :
        return state;
    }
    localStorage.setItem("diary",JSON.stringify(newState))
    return newState;
  }

 export const DiaryStateContext = React.createContext();
 export const DiaryDispatchContext = React.createContext();

 

function App() {
  
  const authCtx = useContext(AuthContext);

    const [data, dispatch] = useReducer(reducer,[]);
  
    useEffect(()=>{
      const localData = localStorage.getItem('diary');
      if(localData){

        const diaryList = JSON.parse(localData).sort((a,b)=>parseInt(b.id)- parseInt(a.id));
        
        if(diaryList.length >= 1){
          dataId.current = parseInt(diaryList[0].id)+1
          dispatch({type:'INIT', data:diaryList});
        }
      } 
    },[])

  const dataId = useRef(0);

  const onCreate = (date, content, emotion, image) => {
    
    dispatch({type:'CREATE',
   
    data:{

    id:dataId.current,

    date:new Date(date).getTime(),

    content,

    emotion,

    image,
  },

  });
    dataId.current += 1;
  }


  const onRemove = (targetId) => {
    dispatch({type:'REMOVE',
    targetId
  })
  }


  const onEdit = (targetId, date, content, emotion, image) => {
    dispatch({type:'EDIT',
    data : {
      id : targetId,

      date : new Date(date).getTime(),

      content,

      emotion,

      image,
    },
  });
  }

 
  return (
  <DiaryStateContext.Provider value={data}>
    <DiaryDispatchContext.Provider
    value={{
      onCreate,
      onRemove,
      onEdit,
    }}>
  <AuthContextProvider>
   <BrowserRouter>
   <div className='App'>
    <Layout>
    <Routes>
    <Route path='/home' element={<Home/>}/>
      {!authCtx.isLoggedIn && (
         <Route path='/' element={<Auth/>}/> 
      )}
      <Route path='profile'>
      {authCtx.isLoggedIn && <UserProfile/> }
      {!authCtx.isLoggedIn && ( 
        <Route path='' element={<UserProfile/>} />
      )}
      </Route>
      <Route path='newdiary' element={<NewDiary />}/>
      <Route path='edit/:id' element={<Edit />}/>
      <Route path='diary/:id' element={<Diary />}/>
    </Routes>
    </Layout>
   </div>
   </BrowserRouter>
   </AuthContextProvider>
   </DiaryDispatchContext.Provider>
   </DiaryStateContext.Provider>
 
  );
}

export default App;

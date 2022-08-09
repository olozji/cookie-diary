import { useContext, useState, useEffect } from "react";
import { DiaryStateContext } from '../App';

import Header from "./../components/Header";
import Buttons from "./../components/Buttons";
import DiaryList from "./../components/DiaryList";

const Home = () => {

    const diaryList = useContext(DiaryStateContext);

    const [data,setData] = useState([]);

    const [CurDate, setCurDate] = useState(new Date());
    const headText = `${CurDate.getFullYear()}년 ${CurDate.getMonth() + 1 }월`;


    useEffect(()=>{
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `diary-web-app`;
    },[]);


    useEffect (()=>{
        if(diaryList.length >= 1){
           const firstDay = new Date(
            CurDate.getFullYear(),
            CurDate.getMonth(),
            1
           ).getTime();

           const lastDay = new Date(
            CurDate.getFullYear(),
            CurDate.getMonth()+1,
            0,
            23,
            59,
            59
           ).getTime();
            setData(
                diaryList.filter((it)=>firstDay <= it.date && it.date <= lastDay)
            );
        }
    },[diaryList,CurDate]);

    // useEffect(()=>{
    //     console.log(data);
    // },[data]);
   

    const preDate = () => {
        setCurDate(
            new Date(CurDate.getFullYear(), CurDate.getMonth()-1,CurDate.getDate())
        );
    };

    const nextDate = () => {
        setCurDate(
            new Date(CurDate.getFullYear(), CurDate.getMonth()+1, CurDate.getDate())
        )
    }

    return (
        <div>
            <Header
            headText={headText}
            leftBtn={<Buttons text={"<"} onClick={preDate}/>}
            rightBtn={<Buttons text={">"} onClick={nextDate} />}
            />
            <DiaryList diaryList={data}/>
        </div>
    );
}

export default Home;
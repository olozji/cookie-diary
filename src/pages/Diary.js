import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";

import { getStringDate } from "../util/Date";
import { EmotionList } from "../util/Emotion";

import Buttons from "../components/Buttons";
import Header from "../components/Header";


const Diary = () => {

    const diaryList = useContext(DiaryStateContext);
    const [data, setData] = useState();
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(()=>{
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `diary-web-app - ${id}번 날 일기`
    },[]);

    useEffect(()=>{
        if(diaryList.length >= 1){
        
        const targetDiary = diaryList.find((it)=> parseInt(it.id) === parseInt(id));
       
    
        if(targetDiary){
            setData(targetDiary); 
        }else{
            alert('없는 일기 입니다');
            navigate('/',{replace:true});
        }
        }
    },[id,diaryList]);

     if(!data){
        return <div className="DiaryPage">로딩중입니다...</div>
     }else{
    const EmotionData = EmotionList.find((it)=> parseInt(it.emotion_id)=== parseInt(data.emotion));

    
    return (
         <div className="DiaryPage">
          <Header
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftBtn={<Buttons
                    text={'>'}
                    onClick={()=>navigate(-1)}
          />}
          rightBtn={<Buttons
                     text={'수정하기'}
                     onClick={()=>navigate(`/edit/${data.id}`)}
          />}
          />
          <article>
            <section>
                <span>오늘의 나의 쿠키는?</span>
                <div className={["diary_image_wrapper", `diary_image_wrapper_${data.emotion}`].join(" ")}>
                    <img src={EmotionData.emotion_img}/>
                    <div className="diary_image_description">
                        {EmotionData.emotion_title}
                    </div>
                </div>
            </section>
            <section>
                <div className="uploadImage_wrapper">
                <img src={data.image} style={{width:'500px'}}/>
                </div>
            </section>
            <section>
                <span>오늘의 일기</span>
                <div className="diary_content_wrapper">
                    <p>{data.content}</p>
                </div>
            </section>
          </article>
         </div>
    )
}
}

export default Diary;
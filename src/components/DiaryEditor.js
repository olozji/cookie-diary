import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DiaryDispatchContext } from "./../App";
import {getStringDate} from "../util/Date";
import { EmotionList } from "../util/Emotion";

import Buttons from "./Buttons";
import Header from "./Header";
import EmotionItem from "./EmotionItem";




const DiaryEditor = ({isEdit,originData}) => {

    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);

    const [date, setDate] = useState(getStringDate(new Date()));

    const [ image, setImage] = useState('');
    const [ loading, setloading] = useState(false);
        
    const {onCreate, onEdit, onRemove} = useContext(DiaryDispatchContext);

    const handleClickEmotion = useCallback((emotion)=>{
            setEmotion(emotion);
    },[]);

   const navigate = useNavigate();


   const handleSubmit = () => {
    if(content.length < 1) {
        contentRef.current.focus();
        return;
    }
    if(window.confirm(
        isEdit ? '해당 일기를 수정하시겠습니까?' : '새로운 일기를 작성하시겠습니까?'
        )
        ){
         if(!isEdit){
            onCreate(date, content, emotion, image);
    }else {
         onEdit(originData.id, date, content, emotion, image);
    }   
  }
    navigate('/home',{replace:true});
   }

    const handleRemove = () => {
        if(window.confirm(
            '정말 삭제하시겠습니까?'
        )){
            onRemove(originData.id);
            navigate('/home',{replace:true});
        }
    }


    const upLoadingImg= async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'nrwpmxgs');
        setloading(true);
        const res = await fetch(
            'https://api.cloudinary.com/v1_1/dxgin55zt/upload/',
            {
            method:'POST',
            body:data
            }
        )
        const file = await res.json();
        setImage(file.secure_url);
        setloading(false);
    }
      

    useEffect(()=>{
        if(isEdit){
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
            setImage(originData.image);
            }
        },[isEdit,originData]);


    return (
        <div className="DiaryEditor">
         <Header 
            headText={
                isEdit ? '일기 수정하기': '새 일기쓰기'}
                leftBtn={<Buttons text={'>'} 
                onClick={()=>navigate(-1)}
            />
            }
            rightBtn={ isEdit && (
                <Buttons 
                text={'삭제하기'}
                type={"remove"}
                onClick={handleRemove}
                />
            )}
         />
       <div>
        <section>
            <h4>오늘은 언제인가요?</h4>
            <div className='input_box'>
            <input 
            className="input_date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            type="date"
            />
            </div>
        </section>
        <section>
            <h4>오늘 나의 쿠키에 무엇을 추가할까요?</h4>
            <div className="input_box emotion_list_wrapper">
                {EmotionList.map((it)=>(
                    <EmotionItem key={it.emotion_id} {...it}
                    onClick={handleClickEmotion}
                    isSelected={it.emotion_id === emotion}
                    /> 
                ))}
            </div>
        </section>
        <section>
            <h4>오늘 나의 하루는 어땠나요?</h4>
            <div className="image">
                <label for="image_input">
                <img src={process.env.PUBLIC_URL + `/assets/icon-add-image.png`} className="image_icon"/>
                    </label>
                    <input
                        type="file"
                        name="file"
                        placeholder ="이미지 업로드 테스트"
                        id="image_input"
                        onChange = {upLoadingImg}
                    />
                    {loading ? (
                        <h3>Loading...</h3>
                    ):(
                        <img src={image} style={{width:'300px'}}/>
                    )}
                    </div>
            <div className="input_content">
                <textarea
                placeholder="오늘 나의 기분은..."
                value={content}
                ref={contentRef}
                onChange={(e)=>setContent(e.target.value)}
                /> 
            </div>
        </section>
        <section>
            <div className="control_btn">
                <Buttons
                text={'취소하기'}
                type={"remove"}
                onClick={()=>navigate(-1)}
                />
                <Buttons 
                text={'작성완료'}
                type={"complete"}
                onClick={handleSubmit}
                />
            </div>
        </section>
       </div>
        </div>
    )
}


export default DiaryEditor;
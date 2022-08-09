import React from "react";

import { useNavigate } from "react-router-dom";
import { EmotionList } from "../util/Emotion";

import Buttons from "./Buttons";

const DiaryItem = ({content, date, emotion, id, image, emotion_description }) => {
    const env = process.env;
    env.PUBLIC_URL = env.PUBLIC_URL || "";

        const navigate = useNavigate();

        const created_date = new Date(parseInt(date)).toLocaleDateString();

        const EmotionData = EmotionList.find((it)=> parseInt(it.emotion_id)=== parseInt(it.emotion));

        const diaryView = () => {
            navigate(`/diary/${id}`);
        }

        const diaryEdit = () => {
            navigate(`/edit/${id}`);
        }

    return (
        <div className="DiaryItem">
            <div 
            onClick={diaryView}
            className={["emotion_img_wrapper", `emotion_img_wrapper_${emotion}`,].join(" ")}
            >
               <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`}/>
            </div>
            <div 
            onClick={diaryView}
            className="content"
            >
                <div className="date">{created_date}</div>
                <div className="content_preview">{content.slice(0,25)}</div>
                <img className="content_image" src={image} style={{width:'200px',borderRadius:'10px'}}/>
            </div>
            <div className="btn_edit">
                <Buttons
                onClick={diaryEdit}
                text={'수정 하기'} 
            />
        </div>
        </div>
    );
}

export default React.memo(DiaryItem);
import { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

const NewDiary = () => {

    useEffect(()=>{
        const titleElement = document.getElementsByTagName("title")[0];
        titleElement.innerHTML = `diary-web-app - 새로운 일기`
    },[]);

    return( 
    <div>
        <DiaryEditor/>
    </div>
    )
}

export default NewDiary;
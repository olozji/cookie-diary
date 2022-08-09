import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Buttons from "./Buttons";
import DiaryItem from "./DiaryItem";


  const selectedType = [
    {value:'latest', name:'최신순'},
    {value:'oldest', name:'오래된순'},
]
  const selectedFilter = [
    {value:'all', name:'모두보기'},
    {value:'good', name:'좋은 감정만'},
    {value:'bad', name:'나쁜 감정만'},
]


const SelectMenu = React.memo(({value,onChange,optionList}) => {
    return (
        <select 
        className="SelectMenu"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        >
        {optionList.map((it,idx)=>(
            <option className="optionMenu" key={idx} value={it.value}>
                {it.name}
            </option>
        ))}
        </select>
    );
});


    const DiaryList = ({diaryList}) => {
        const navigate = useNavigate();

        const [sortType, setSortType] = useState('latest'); 
        const [curFilter, setCurFilter] = useState('all');
        const [ search, setSearch] = useState('');

        const ChangeDiaryList = () => {

             const filterCallback = (item) => {
                if(curFilter === 'good'){
                    return parseInt(item.emotion) <= 3;
                }else{
                    return parseInt(item.emotion) > 3;
                }
            }

        const compare = (a,b) => {
                if(sortType === 'latest') {
                    return parseInt(b.date) - parseInt(a.date);
                }else {
                    return parseInt(a.date) - parseInt(b.date);
                }
            }
 
        const copyList = JSON.parse(JSON.stringify(diaryList));

        const copyFilter = curFilter === 'all' ? copyList : copyList.filter((it)=>filterCallback(it));

        const SortedList = copyFilter.sort(compare);
        return SortedList;
    }

    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
            <div className="left_col">
                <SelectMenu 
                value={sortType}
                onChange={setSortType}
                optionList={selectedType}
                />
                <SelectMenu
                value={curFilter}
                onChange={setCurFilter}
                optionList={selectedFilter}
                />
                </div>
                <div className="right_col">
                    <Buttons 
                    type={"positive"}
                    text={'+'}
                    onClick={()=>navigate('/NewDiary')}
                    />
                </div>
            </div>
          {ChangeDiaryList().map((it)=> (
            <DiaryItem key={it.id} {...it} 
            />
          ))}
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
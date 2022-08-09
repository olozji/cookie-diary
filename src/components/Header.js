const Header = ({headText, leftBtn, rightBtn}) => {
    return (
    <header>
        <div className="left_Btn">
            {leftBtn}
        </div>
        <div className="head_Text">
            {headText}
        </div>
        <div className="right_Btn">
            {rightBtn}
        </div>
    </header>
    );
};

export default Header;
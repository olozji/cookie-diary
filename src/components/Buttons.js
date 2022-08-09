const Buttons = ({text, type, onClick}) => {

    const BtnType = ["complete","remove"].includes(type) ? type : "default";

    return (
       <button className={["btn", `btn_${BtnType}`].join(" ")} onClick={onClick}>
        {text}
       </button>
    );
};

    Buttons.defaultProps = {
        type:"default",
    }

export default Buttons;
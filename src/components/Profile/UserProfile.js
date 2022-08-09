import ProfileForm from "./ProfileForm";


const UserProfile = () => {
    return (
       <section className="profile_section">
        <h2>회원 정보 수정</h2>
        <h1>비밀 번호를 변경 하시겠습니까?</h1>
        <ProfileForm/>
       </section>
    )
}

export default UserProfile;
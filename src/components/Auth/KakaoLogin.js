import KakaoLogin from 'react-kakao-login';

const KakaoLoginComponent = () => {

  const REST_API_KEY = "7be77ad3cd613bdca9e2ed92267e38ff"
  const REDIRECT_URI = "http://localhost:3000/oauth"
  const KAKAO_AUTH_URL = `http://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;


  const responseKaKao = (res) => {
    console.log(res);
  };

  useEffect(() => {
    window.kakao.init('7be77ad3cd613bdca9e2ed92267e38ff');
},[]);


  return (
    <KakaoLogin
      token="7be77ad3cd613bdca9e2ed92267e38ff"
      onSuccess={responseKaKao}
      onFail={console.error}
      onLogout={console.info}
      REDIRECT_URI={KAKAO_AUTH_URL}
    />
  );
};

export default KakaoLoginComponent;

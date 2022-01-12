import React, {useState} from 'react'
import Notiflix from 'notiflix'
import {requestApi} from "../../../common/RequestFunctions";
import WelcomeContainer from "../../../component/Welcome/WelcomeContainer";
import WelcomeInput from "../../../component/InputBox/WelcomeInput";
import DefaultButton from "../../../component/DefaultButton";
import {SF_ADDRESS, SF_PORT} from "../../../common/configset";


const LoginPage = () => {
    // const router = useRouter()
    const port = SF_PORT === "" ? ":80" : `:${SF_PORT}`;
    const [data, setData] = useState<{id:string, base_url:string}>({id:"", base_url:`${SF_ADDRESS}${port}`});
    // const [data, setData] = useState<{id:string, base_url:string}>({id:"", base_url:`192.168.0.17:5000`});

    const onClickLogin = async () => {
        Notiflix.Loading.dots('이메일 보내는 중...')
        const res = await requestApi('post', '/anonymous/modify/email', data)

        if(res){
            Notiflix.Report.success("이메일을 확인해주세요.", "", "확인");
        }else{
            Notiflix.Report.warning("아이디 또는 이메일이 존재하지 않습니다.", "", "확인");
        }
    }

    const onKeyDownEnter = async (key: string) => {
        if (key === 'Enter')
            await onClickLogin().then(() => Notiflix.Loading.remove(500))
    }

    return (
        <WelcomeContainer>
            <div style={{width: 320}}>
                <p style={{fontSize: 36, marginBottom: 26, textAlign: 'left', fontFamily: 'Roboto', fontWeight: 'bold'}}>비밀번호 찾기</p>
                <WelcomeInput type="email" value={data.id} title={'ID (e-mail)'}
                              onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                  setData({...data, id: e.target.value})
                              }} hint={'이메일을 입력해주세요.'} onKeyDown={onKeyDownEnter} />
                <DefaultButton title={'확인'} onClick={() => onClickLogin().then(() => Notiflix.Loading.remove(500) ) } />
            </div>
        </WelcomeContainer>
    )
}

export default LoginPage

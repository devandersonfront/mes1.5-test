import React, {useEffect, useState} from "react";
import WelcomeInput from "../../../component/InputBox/WelcomeInput";
import DefaultButton from "../../../component/DefaultButton";
import Notiflix from "notiflix";
import WelcomeContainer from "../../../component/Welcome/WelcomeContainer";
import {requestApi} from "shared/src/common/RequestFunctions";
import {useRouter} from "next/router";

const Password = () => {
    const router = useRouter();

    const {secure, id} = router.query;

    const [data, setData] = useState<{id:string | string[], password:string, secure:string | string[]}>({id:id , password:"", secure:secure });


    const [checkPassword, setCheckPassword] = useState<{password:string, check:string}>({password:"", check:""});

    const onKeyDownEnter = async (key: string) => {
        if (key === 'Enter')
            await onClickLogin().then(() => Notiflix.Loading.remove(500))
    }

    const onClickLogin = async () => {
        Notiflix.Loading.dots('확인중...')

        if(checkPassword.password !== checkPassword.check){
            Notiflix.Report.warning("비밀번호를 확인해 주세요.", "", "확인");

        }else{
            const res = await requestApi('put', '/anonymous/modify/password', data)

            if(res && res.status === 200){
                Notiflix.Report.success("비밀번호가 변경되었습니다.", "", "확인");
                router.push("/mes/login")
            }else{
                Notiflix.Report.warning("에러발생.", "", "확인");
            }
        }
    }


    useEffect(()=>{
        setData({...data, secure:secure as string, id:id as string})
    },[secure, id])


    return (
        <WelcomeContainer>
            <div style={{width: 320}}>
                <p style={{fontSize: 36, marginBottom: 26, textAlign: 'left', fontFamily: 'Roboto', fontWeight: 'bold'}}>비밀번호 변경</p>
                <WelcomeInput type="password" value={checkPassword.password} title={'변경할 비밀번호 입력'}
                              onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                  setCheckPassword({...checkPassword, password:e.target.value})
                                  setData({...data, password: e.target.value})

                              }} hint={'비밀번호를 입력해주세요.'}/>
                <WelcomeInput type="password" value={checkPassword.check} title={'변경할 비밀번호 입력 확인'}
                              onChangeEvent={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                  setCheckPassword({...checkPassword, check:e.target.value})
                              }} hint={'비밀번호를 다시 한번 입력해주세요.'} onKeyDown={onKeyDownEnter} />
                <DefaultButton title={'확인'} onClick={() => {
                    onKeyDownEnter("Enter")
                } } />
            </div>
        </WelcomeContainer>
    );
}


export default Password;

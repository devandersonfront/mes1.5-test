import React, {useEffect} from 'react';
import {WelcomeInputCompo} from '../../styles/styledComponents'
//웰컴, 로그인 페이지 네비게이션 컴포넌트

interface IProps {
  title: string,
  hint: string,
  type: string,
  value: number | string,
  onChangeEvent?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (key: string) => void
}

const WelcomeInput = ({title, hint, type, value, onChangeEvent, onKeyDown}: IProps) => {

  const onCheckKor = (event: any) => {
    event = event || window.event;
    if((/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g).test(event.target.value)){
      alert('한글은 비밀번호로 사용할 수 없습니다.')
    }
    let keyID = (event.which) ? event.which : event.keyCode;
    if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 )
      return;
    else
      event.target.value = event.target.value.replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "");
  }

  return (

    <>
      <div style={{display: 'flex', justifyContent: 'flex-start'}}>
        <label style={{fontSize: 14, width: '100%', textAlign: 'left', fontFamily: 'Roboto', fontWeight: 'bold'}}>{title}</label>
      </div>
      {
        type === 'password' ?
          <WelcomeInputCompo type={type} onKeyUp={(e)=>onCheckKor(e)}
                             onKeyDown={(e) => onKeyDown && onKeyDown(e.key)}
                             style={{imeMode:'disabled'}} onChange={onChangeEvent} value={value} placeholder={hint}/>
          :
          <WelcomeInputCompo type={type} onChange={onChangeEvent} value={value} placeholder={hint}/>
      }
    </>

  );
}


export {WelcomeInput};

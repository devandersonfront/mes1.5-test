import React, {useEffect} from 'react';
import Styled from 'styled-components'
//@ts-ignore
import IMG_BG from ''

const WelcomeContainer = ({children}: any) => {

  useEffect(()=>{

  },[])

  return (


    <div style={{
      zIndex: 1,
      backgroundImage: `url(${require('../../public/images/img_welcome_bg.png')})`,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: "center",
      justifyContent: "center",
    }}>
      <FullBodyDiv>
        {children}
      </FullBodyDiv>
    </div>

  );
}


const FullBodyDiv = Styled.div`
    height: 100vh;
    min-height: 768px;
    width: 100vw;
    color: white;
    position:relative;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    align-items: center; 
    justify-content: center;
    -webkit-justify-content: center;
    -webkit-align-items: center;
`

export default WelcomeContainer;

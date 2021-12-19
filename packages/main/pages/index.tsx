import WelcomePage from '../container/welcomePage'
import styled from 'styled-components'

const Container = styled.div`
  .container {
    min-height: 100vh;
    padding: 0 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .welcomebtn {
    padding: 12px;
    border-radius: 5px;
    click-event: none;
    color: black;
    background-color: #19B9DF;
    border: none;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
  }

  .welcomeInputBox {
    width: 100%;
    margin-top: 6px;
    margin-bottom: 11px;
    font-size: 14px;
    border-radius: 5px;
    outline: none;
    border: 0;
    background-color: #ffffff;
    font-size: 15px;
    padding: 14px;
    width: calc(100% - 30px) !important;
    color: #252525;
  }
`

export default function Home() {
  return (
    <Container>
      <WelcomePage>
        <div>

        </div>
      </WelcomePage>
    </Container>
  )
}

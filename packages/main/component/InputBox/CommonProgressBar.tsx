import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from 'shared/src/@types/type';
import Styled from 'styled-components'
import settingRowColor from '../../../shared/src/Functions/settingRowColor';
interface Props {
    column : IExcelHeaderType,
    row : any,
}

const ProgressContainer = Styled.div`
  display:flex;
  backgroundColor: #353B48;
  width: 100%;
  position : relative;

`


const ProgressGrid = Styled.div(({ width, backgroundColor } : { width : string , backgroundColor :string }) => ({
    width,
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const percentData = {

    maximum : 100 ,
    progressContainerStyle : { width: '100%' , height :'32px' , background : '#1B273F'} ,
    type : 'value' ,
    drawscale : false

}

const degreeData = {

    maximum : 100 ,
    progressContainerStyle : { width: '100%' , height :'32px' , background : '#1B273F'} ,
    type : 'range' ,
    drawscale : true

}

const countData = {

    maximum : 100 ,
    progressContainerStyle : { width: '100%' , height :'32px' , background : '#1B273F'} ,
    type : 'value' ,
    drawscale : false

}

const CommonProgressBar: React.FunctionComponent<Props> = ({ column, row }) => {

    const [ value , setValue ] = useState<any>()
    const [ setting , setSetting ] = useState<any>({
        maximum : 0 ,
        progressContainerStyle : { width: '100%' , height :'32px' , background : '#1B273F'} ,
        type : '' ,
        drawscale : true
    })


    const resizeWidth = React.useCallback((target: number) => {
        // return setting?.maximum ? ((target / setting?.maximum) * 100).toFixed(1) + '%' : '0'
        return setting?.maximum ? ((target / setting?.maximum) * 100).toFixed(1) + '%' : '0'
    }, [ value, setting?.maximum ])


    const ProgressGraduation = React.useMemo(() => {
        return  <ProgressDataContainer>
            <div>
                {
                    new Array(setting?.maximum/10).fill('_').map((_,dataIndex)=>(
                        <ValueGrid key={dataIndex}>

                        </ValueGrid>
                    ))
                }
            </div>
        </ProgressDataContainer>


    },[value])


    React.useEffect(()=>{

        if(column.key === 'usagePercent'){
            setSetting(percentData)
        }else if(column.key === 'progressCount' || "total_counter"){
            setSetting(countData)
        }else {
            setSetting(degreeData)
        }

    },[row])

    useEffect(()=>{
        setValue(row)

    },[row])

    return (
        <Container style={{display: 'flex' , alignItems:'center' , height : '100%', backgroundColor:settingRowColor({type: row.border})}} >
            <ProgressContainer style={setting.progressContainerStyle}>
                {
                    setting?.type === 'value' ? value !== undefined ?
                            <React.Fragment>
                                {/* backgroundColor={value && value?.isOverMax ? '#FF341A' : '#19B9DF'} */}
                                <ProgressDataText>{resizeWidth(value?.[column.key])}</ProgressDataText>
                                <ProgressGrid width={resizeWidth(value?.[column.key])} backgroundColor={row.border ? "#1937DF" : '#19B9DF'}/>
                                {
                                    setting?.drawscale && ProgressGraduation
                                }
                            </React.Fragment>
                            : <>정보 없음</>
                        // <FrequentlyFlexMiddle styles={{ width: '100%' }}>
                        //     <FrequentlyLabel text={'정보 없음'} size={24} weight={'bold'}
                        //                      fontFamily={'Noto Sans CJK KR'} textAlign={'center'}
                        //                      containerStyles={{ opacity: .5 }}/>
                        // </FrequentlyFlexMiddle>
                        :
                        null
                }
                {
                    setting?.type === 'range' ? value.on ?
                            <React.Fragment>
                                <ProgressGrid width={resizeWidth(value?.on)} backgroundColor={'#1B273F'}/>
                                {
                                    setting?.drawscale  && ProgressGraduation
                                }
                            </React.Fragment>
                            :
                            <>정보 없음</>
                        // <FrequentlyFlexMiddle styles={{ width: '100%' }}>
                        //     <FrequentlyLabel text={'정보 없음'} size={24} weight={'bold'}
                        //                      fontFamily={'Noto Sans CJK KR'} textAlign={'center'}
                        //                      containerStyles={{ opacity: .5 }}/>
                        // </FrequentlyFlexMiddle>
                        :
                        null
                }
                {
                    setting?.type === 'range' ? value?.off && value?.on ?
                            <React.Fragment>
                                <ProgressGrid width={resizeWidth(value?.off-value?.on)} backgroundColor={'#19B9DF'}/>
                                {
                                    setting?.drawscale  && ProgressGraduation
                                }
                            </React.Fragment>
                            :
                            <>정보 없음</>
                        // <FrequentlyFlexMiddle styles={{ width: '100%' }}>
                        //     <FrequentlyLabel text={'정보 없음'} size={24} weight={'bold'}
                        //                      fontFamily={'Noto Sans CJK KR'} textAlign={'center'}
                        //                      containerStyles={{ opacity: .5 }}/>
                        // </FrequentlyFlexMiddle>
                        :
                        null
                }
            </ProgressContainer>
        </Container>
    )

}
export default CommonProgressBar


const Container = Styled.div`
  width : 100%
`

const ProgressDataContainer = Styled.div<any>`

  width: 100%;
  height: 100%;
  position : absolute;
  top : 0;
  left : 0;
  

`
const ValueGrid = Styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items:center;
  height: 100%;
  margin-left : -1px;
  opacity : 0.8;

  &:after{
    content : "";
    height : 5px;
    width : 1px;
    background : white; 
  }

  &:nth-child(9n+1){
    &:after{
      content : "";
      height : 15px;
      width : 1px;
      background : white; 
    }
  }
`
const ProgressDataText = Styled.p`
    width:100%;
    height:100%;
    position:absolute;
    z-index:10;
    text-align:center;
    margin:0;
    
`
import React from 'react';

const MidRangeExcelTable = () => {
    return (
        <div>
            <div style={{width: '1746px', height: '40px',display: "flex", justifyContent: "center", alignItems: "center",backgroundColor: '#F4F6FA',fontWeight: "bold" , border: '0.5px solid #B3B3B3' }}>초ㆍ중ㆍ종 검사 결과</div>
            <div style={{display: "flex"}}>
                <div>
                    <div>작성자</div>
                    <div>1132</div>
                </div>
                <div>
                    점검시간
                </div>
                <div>
                    검사 항목(단위)
                </div>
                <div>
                    점검 기준
                </div>
                <div>
                    <div>
                        시료
                    </div>
                    <div>
                        <div/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export {MidRangeExcelTable};

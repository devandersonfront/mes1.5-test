import React from 'react';
//@ts-ignore
import filterOpenB from "../../../public/images/filter_open_b.png";
//@ts-ignore
import filterOpenW from "../../../public/images/filter_open_w.png";
import Notiflix from "notiflix";

interface IProps {

}

const MidrangeExcelDropdown = () => {
    return (
        <select
            className={'editDropdown'}
            style={{
                zIndex: 10,
                appearance: 'none',
                border: 0,
                width: '100%',
                padding: '0 8px 0 9px',
                background: `url(${filterOpenB}) no-repeat right 9px center`,
                backgroundSize: '24px',
            }}
            value={/*column.key === "type" ? selectType() :*/  "무"}
            onChange={(event) => {}}
        >
            {[{pk: '11', name: '합격'},{pk: '131', name: '불합격'}, ].map((title) => {
                return (<option key={title.pk} value={title.name}>
                    {title.name}
                </option>)
            })}
        </select>
    );
};

export {MidrangeExcelDropdown};

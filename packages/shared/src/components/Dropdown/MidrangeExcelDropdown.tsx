import React, {ChangeEvent} from 'react';
//@ts-ignore
import filterOpenB from "../../../public/images/filter_open_b.png";
//@ts-ignore
import filterOpenW from "../../../public/images/filter_open_w.png";
import Notiflix from "notiflix";

interface IProps {
    contents: string[]
    value: string
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    readOnly?:boolean
}

const MidrangeExcelDropdown = ({contents,value,onChange, readOnly}: IProps) => {

    return (
        <select
            className={'editDropdown'}
            style={{
                zIndex: 10,
                appearance: 'none',
                border: 0,
                width: '100%',
                padding: '0 8px 0 9px',
                background: readOnly ? null : `url(${filterOpenB}) no-repeat right 9px center`,
                backgroundSize: '24px',
            }}
            value={/*column.key === "type" ? selectType() :*/  value}
            onChange={onChange}
            disabled={readOnly}
        >
            {contents.map((title,index) => {
                return (<option key={title+'Midrange'+index} value={title} >
                    {title}
                </option>)
            })}
        </select>
    );
};

export {MidrangeExcelDropdown};

import React from "react";
import styled from "styled-components";
import {Header as PageHeader} from "shared";

const MesToolList = () => {
    return (
        <div>
            <PageHeader
                title={"공구 재고 현황"}
                buttons={
                    ['행추가', '저장하기', '삭제']
                }
                buttonsOnclick={() => {}
                    // () => {}
                    // onClickHeaderButton
                }
            />
            공구 재고 현황
        </div>
    )
}

export {MesToolList};

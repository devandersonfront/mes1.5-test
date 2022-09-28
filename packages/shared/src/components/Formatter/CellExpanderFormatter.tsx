import {useFocusRef} from "../../hook/useFocusRef";
import styled from "styled-components";

interface CellExpanderFormatterProps {
    expanded: boolean;
    onCellExpand: () => void;
}

const CellExpanderFormatter = ({expanded, onCellExpand}: CellExpanderFormatterProps)=> {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onCellExpand();
        }
    }
    return (
        <div style={{cursor : "pointer"}} onClick={onCellExpand} >
          <span onKeyDown={handleKeyDown}>
            <span>
              {expanded ? '\u25BC' : '\u25B6'}
            </span>
          </span>
        </div>
    );
}

export default CellExpanderFormatter
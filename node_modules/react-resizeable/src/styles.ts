import styled, { css } from 'styled-components';

export const Parent = styled.div<ReactResizeable.ResizeableProps>`
  position: relative;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  height: ${({ height }) => height ?? 'auto'};
  flex-wrap: initial;
`;

const baseResizeStyle = (resizeDir: ReactResizeable.ResizeDirection) => css`
  resize: ${resizeDir};
  overflow: 'auto';
`;

const resizeStyles = ({
  resizeable,
  resizeDir,
}: ReactResizeable.ChildProps['resize']) => {
  if (!resizeable && !resizeDir) return;

  return resizeDir === 'both' || resizeDir === 'vertical'
    ? css`
        ${baseResizeStyle(resizeDir)};
        height: auto;
      `
    : baseResizeStyle(resizeDir!);
};

export const StyledChild = styled.div<ReactResizeable.ChildProps['resize']>`
  min-height: ${({ minHeight }) => minHeight ?? 'auto'};
  height: ${({ height }) => height ?? '100%'};
  overflow: scroll;
  width: ${({ width }) => width};
  min-width: ${({ minWidth }) => minWidth ?? 'min-content'};
  flex-grow: 1;

  ${resizeStyles}
`;

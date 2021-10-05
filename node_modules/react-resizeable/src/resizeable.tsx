import * as React from 'react';

import { Parent } from './styles';
import { debounce } from './debounce';
import { median } from './median';
import { generateRandomString } from './random-string';

const Resizeable: React.FC<ReactResizeable.ResizeableProps> = ({
  children,
  as = 'div',
  flexDirection = 'row',
  height = '100%',
}) => {
  const [resizeId] = React.useState(generateRandomString());
  const parent = React.useRef<HTMLElement>(null);
  const minWidth = React.useRef(0);
  const medianRootWidth = React.useRef(0);
  const totalMinWidths = React.useRef(0);
  const resizeWidthDiff = React.useRef(0);

  React.useEffect(() => {
    if (!parent.current) return;

    let widths: number[] = [];
    let totalByResize = { resizeTotalWidths: 0, nonResizeTotalWidths: 0 };

    Array.from(parent.current.children).map(c => {
      const width = Number(
        getComputedStyle(c)
          .getPropertyValue('min-width')
          .replace('px', '')
      );
      widths = [...widths, width];

      if (getComputedStyle(c).getPropertyValue('resize') === 'none') {
        totalByResize = {
          ...totalByResize,
          nonResizeTotalWidths: totalByResize.nonResizeTotalWidths + width,
        };
      } else {
        totalByResize = {
          ...totalByResize,
          resizeTotalWidths: totalByResize.resizeTotalWidths + width,
        };
      }
    });

    minWidth.current = Math.min(...widths);

    totalMinWidths.current = widths.reduce((acc, val) => val + acc, 0);

    medianRootWidth.current = Math.ceil(Math.sqrt(median(widths)));

    resizeWidthDiff.current = Math.abs(
      totalByResize.resizeTotalWidths - totalByResize.nonResizeTotalWidths
    );
  }, [parent]);

  const onResize = React.useCallback(
    ({ totalMin }: { totalMin?: number } = {}) => {
      if (!parent.current) return;

      const minToMeasure = totalMin ?? totalMinWidths.current;

      if (minToMeasure >= window.innerWidth) {
        parent.current.style.flexWrap = 'wrap';
        parent.current.style.height = 'auto';
      } else {
        parent.current.style.flexWrap = '';
        parent.current.style.height = height;
      }
    },
    [parent, totalMinWidths.current]
  );

  React.useEffect(() => {
    // setup MutationObserver
    const resizeableChildren:
      | HTMLElement[]
      | undefined
      | {}[] = React.Children.map(children, (child, idx) => {
      if (!React.isValidElement(child)) return child;

      return child.props?.resize?.resizeable
        ? document.getElementById(`resizeable-${resizeId}-${idx}`)
        : null;
    })?.filter(child => Boolean(child));

    const config = {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true,
    };

    const callback: MutationCallback = mutationsList => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(mutationsList) || !mutationsList.length) {
          return;
        }
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
          if (mutation.type !== 'attributes') return;

          if (mutation.target instanceof HTMLElement) {
            const newTotalMin =
              totalMinWidths.current -
              minWidth.current +
              mutation.target.offsetWidth +
              medianRootWidth.current +
              resizeWidthDiff.current;

            if (newTotalMin >= window.innerWidth) {
              onResize({
                totalMin: newTotalMin,
              });
            }
          }
        }
      });
    };

    const observer = new MutationObserver(callback);

    resizeableChildren?.forEach(el => {
      if (el instanceof HTMLElement) {
        observer.observe(el, config);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    // on initial mount ensure proper flex layout
    onResize();
  }, [onResize]);

  React.useEffect(() => {
    // @ts-ignore it complains we're not typing the event but we don't care about it
    window.addEventListener('resize', debounce(onResize, 200));

    return () => {
      // @ts-ignore it complains we're not typing the event but we don't care about it
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return (
    <Parent as={as} ref={parent} flexDirection={flexDirection} height={height}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child, {
          ...child.props,
          id: `resizeable-${resizeId}-${idx}`,
        });
      })}
    </Parent>
  );
};

export default Resizeable;

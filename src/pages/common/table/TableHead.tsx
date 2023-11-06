import { FC, HTMLAttributes, PropsWithChildren, ThHTMLAttributes, RefObject } from 'react';

interface ITHead extends HTMLAttributes<HTMLTableSectionElement> {
  thData: (ThHTMLAttributes<HTMLTableCellElement> & PropsWithChildren)[][];
  trRef?: RefObject<HTMLTableRowElement>; // sticky 사용 관련 useRef refObject
}

const TableHead: FC<ITHead> = ({ thData, trRef, ...theadAttributes }) => {
  return (
    <thead {...theadAttributes}>
      {thData.map((thInfos, thDataIdx) => (
        <tr key={thDataIdx} ref={thDataIdx === 0 && !!trRef ? trRef : undefined}>
          {thInfos.map(({ children, ...trAttributes }, index) => (
            <th key={index} {...trAttributes}>
              {children}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;

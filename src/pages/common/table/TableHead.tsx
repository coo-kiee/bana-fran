import { FC, HTMLAttributes, PropsWithChildren, ThHTMLAttributes, RefObject } from 'react';
import Utils from 'utils/Utils';

interface ITHead extends HTMLAttributes<HTMLTableSectionElement> {
  thData: (ThHTMLAttributes<HTMLTableCellElement> & PropsWithChildren)[][];
  trRef?: RefObject<HTMLTableRowElement>; // sticky 사용 관련 useRef refObject
  multiLine?: boolean; // 엑셀/Table 줄바꿈 처리용 (br태그 추가)
}

const TableHead: FC<ITHead> = ({ thData, trRef, multiLine = false, ...theadAttributes }) => {
  return (
    <thead {...theadAttributes}>
      {thData.map((thInfos, thDataIdx) => (
        <tr key={thDataIdx} ref={thDataIdx === 0 && !!trRef ? trRef : undefined}>
          {thInfos.map(({ children, ...trAttributes }, index) => (
            <th key={index} {...trAttributes}>
              {multiLine ? Utils.addLineBreak(children, '\n') : children}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};

export default TableHead;

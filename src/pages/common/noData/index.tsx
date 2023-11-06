import { FC, HTMLAttributes } from 'react';

interface NoDataProps {
  rowSpan?: number;
  colSpan?: number;
  paddingTop?: number;
  paddingBottom?: number;
  isTable?: boolean;
  showImg?: boolean;
  text?: string;
  style?: HTMLAttributes<HTMLTableCellElement>['style'];
}
const NoData: FC<NoDataProps> = ({
  rowSpan = 10,
  colSpan = 20,
  paddingTop = 103,
  paddingBottom = 103,
  isTable = false,
  showImg = false,
  text = '내역이 없습니다.',
  style = {
    fontSize: 25,
    color: '#555',
    background: '#fff',
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
  },
}) => {
  if (isTable)
    return (
      <tr>
        <td className="no-data" rowSpan={rowSpan} colSpan={colSpan} style={showImg ? undefined : style}>
          {text}
        </td>
      </tr>
    );

  return <span style={showImg ? undefined : style}>{text}</span>;
};

export default NoData;

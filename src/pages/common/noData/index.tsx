import { FC } from "react";

interface NoDataProps {
    rowSpan?: number,
    colSpan?: number,
    paddingTop?: number,
    paddingBottom?: number,
    isTable?: boolean,
    showImg?: boolean,
}
const NoData: FC<NoDataProps> = ({ rowSpan = 10, colSpan = 20, paddingTop = 103, paddingBottom = 103, isTable = false, showImg = false }) => {
    return (
        isTable ?
        <tr>
            <td
                className="no-data"
                rowSpan={rowSpan}
                colSpan={colSpan}
                style={showImg ? undefined : { fontSize:25, color:'#555', background: '#fff', paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }} >
                내역이 없습니다.
            </td>
        </tr>
        : <span style={showImg ? undefined : { fontSize:25, color:'#555', background: '#fff', paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }} >내역이 없습니다.</span>
    );
}

export default NoData;
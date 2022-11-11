import { FC, Suspense, useEffect, useState } from "react";

// Component
import Loading from "pages/common/loading";

// Service
import CALCULATE_SERVICE from 'service/calculateService';
import { ErrorBoundary } from "react-error-boundary";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import { useEventKeyCode } from "hooks/useEventKeyCode";

interface ChangeHistoryProps {
    fCode: number,
    staffNo: number,
    calculateId: number,
    handlePopup: (key: string, value: boolean) => void
};
const ChangeHistory: FC<ChangeHistoryProps> = ({ fCode, staffNo, calculateId, handlePopup }) => {

    const [dataCnt, setDataCnt] = useState(0);
    const { width, headerText } = TABLE_COLUMN_INFO;

    const closePopup = () => {
        handlePopup('changeHistory', false);
    };
    
    useEventKeyCode(closePopup, 'Escape');

    return (
        <div className="alert-layer history-layer active" style={dataCnt >= 10 ? { paddingTop: '100px', paddingBottom: '100px' } : undefined}>
            <div className="msg-wrap">
                <p className="title">수정요청/변경이력</p>
                <table className="board-wrap" cellPadding="0" cellSpacing="0">
                    {/* Column Width */}
                    <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
                    <tbody>
                        {/* Table Header  */}
                        <tr>{headerText.map((text) => <th key={text}>{text}</th>)}</tr>
                        {/* List */}
                        <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => <tr><td rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} style={{ paddingTop: '40px' }}><SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} /></td></tr>} onError={(e) => console.log('changeHistory', e)}>
                            <Suspense fallback={<tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} style={{ background: '#fff' }}><Loading height={80} width={80} marginTop={20} /></td></tr>}>
                                <TableList staffNo={staffNo} fCode={fCode} calculateId={calculateId} setDataCnt={setDataCnt} />
                            </Suspense>
                        </ErrorBoundary>
                    </tbody>
                </table>
                <button className="btn-close history-close" onClick={closePopup} ></button>
                <button className="cta-btn" onClick={closePopup}>확인</button>
            </div>
        </div >
    );
}

export default ChangeHistory;



const TABLE_COLUMN_INFO = {
    width: ['130', '98', '98', '372', '250', '250'],
    headerText: ['일시', '구분', '등록자', '수정요청/답변내용', '변경 전', '변경 후'],
} as const;

interface TableListProps {
    fCode: number,
    staffNo: number,
    calculateId: number,
    setDataCnt: React.Dispatch<React.SetStateAction<number>>,
};
const TableList: FC<TableListProps> = ({ fCode, staffNo, calculateId, setDataCnt }) => {

    console.log(calculateId);
    const { data: fixList } = CALCULATE_SERVICE.useCalculateFixList(['caculateFixList', JSON.stringify({ fCode, staffNo, calculateId })], fCode, staffNo, calculateId);

    // 리스트 개수에 따라 팝업 Padding Style 조정
    useEffect(() => {
        if (fixList) setDataCnt(prev => fixList.length);
    }, [fixList, setDataCnt])

    return (
        <>
            {
                fixList && fixList.map((fixData, index) => {
                    const { log_date, log_type, insert_staff_name, comment, pre_data, change_data } = fixData;
                    const [date, time] = log_date.split(' ');
                    const [staffName, storeName] = insert_staff_name.split('(');

                    return (
                        <tr key={index}>
                            <td>{date}<br />{time}</td>{/* 일시 */}
                            <td>{log_type}</td>{/* 구분 */}
                            <td>{staffName}{storeName && <br />}{storeName}</td>{/* 등록자 */}
                            <td>{comment}</td>{/* 수정요청/답변내용 */}
                            <td className="content" style={{ whiteSpace: 'pre' }}>{pre_data}</td>{/* 변경 전 */}
                            <td className="content" style={{ whiteSpace: 'pre' }}>{change_data}</td>{/* 변경 후 */}
                        </tr>
                    )
                })
            }
            {fixList && fixList.length === 0 && <tr><td className="no-data" rowSpan={10} colSpan={TABLE_COLUMN_INFO.width.length} >No Data</td></tr>}
        </>
    )
};
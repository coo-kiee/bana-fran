import { FC, forwardRef, useRef } from "react";
import Utils from "utils/Utils";
import { format } from "date-fns";

// component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import Sticky from "pages/common/sticky";

// type
import { PageInfoType, isMusicChargeDetailType, isOrderDetailListType, isVirtualAccListType, VirtualAccListType, TableHeadItemType } from "types/etc/etcType";
import { useSetRecoilState } from "recoil";
import { orderDetailModalState } from "state";
import { ExtraOverallTableRowItemType } from "types/membership/extraType";

interface EtcDetailTableProps {
    colGroup: Array<string>, // colgroup width 관련 ... ["195", "195", ...]
    theadData: TableHeadItemType[][], // 테이블 header th 관련 ...[ [{itemName: '기간', rowSpan: 2},{itemName: 'BGM 서비스 이용료' colSpan: 3,className:'price-area'},...], [{itemName: '공급가', className: 'price-area'}] ]
    tbodyData: any, // ? 프로시저 데이터 확인하기
    pageInfo: PageInfoType, // 페이지네이션 관련 정보
    handlePopupOrderDetail?: () => void, // 발주내역에서 EtcOrderDetail 여는 함수
}

// TODO: 상세 내역 테이블 관련 (.board-wrap 부분)
const EtcDetailTable = forwardRef<HTMLTableElement, EtcDetailTableProps>(
    (props, ref) => {
        const { colGroup, theadData, tbodyData, pageInfo: { currentPage, row } } = props;
        const setOrderDetailmodalState = useSetRecoilState(orderDetailModalState);

        // sticky header display
        // const [showSticky, setShowSticky] = useState<boolean>(false);
        const thRef = useRef<HTMLTableRowElement>(null);

        return (
            <>
                <Sticky reference={thRef.current}>
                    <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={theadData} />
                </Sticky>

                <table className="board-wrap" cellPadding="0" cellSpacing="0" ref={ref}>
                    <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={theadData} ref={thRef} />
                    <tbody>
                        {
                            tbodyData.length > 0 ?
                                tbodyData.map((tbodyRow: any, idx: number) => {
                                    if (
                                        (idx < (currentPage - 1) * row) || // 현재 페이지 이전에 있는 데이터
                                        (idx >= (currentPage * row)) // 현재 페이지 이후에 있는 데이터
                                    ) {
                                        return null;
                                    } else if (isMusicChargeDetailType(tbodyRow)) { // TODO: 음악 서비스 이용료, 로열티 상세내역 테이블
                                        const { std_date, state, suply_amount, tax_amount, total_amount } = tbodyRow;
                                        const tempData = { std_date, state, suply_amount, tax_amount, total_amount };

                                        const handleText = (keyName: string, value: string | number) => {
                                            if (keyName === 'suply_amount' || keyName === 'tax_amount') return Utils.numberComma(value);
                                            else if (keyName === 'total_amount') return <strong>{Utils.numberComma(value)}</strong>
                                            else return value;
                                        };

                                        const handleClassName = (keyName: string) => {
                                            if (keyName === 'std_date') return 'align-center'
                                            else if (keyName === 'state') return 'align-left'
                                            else return 'align-right'
                                        };

                                        return (
                                            <tr key={`etc_music_charge_detail_table_row_${idx}`}>
                                                {Object.entries(tempData).map((bodyItem: [string, string | number], idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                                                    return <td key={`etc_music_charge_detail_tbody_${idx}`} className={handleClassName(bodyItem[0])}>{handleText(bodyItem[0], bodyItem[1])}</td>
                                                })}
                                            </tr>
                                        );
                                    } else if (isOrderDetailListType(tbodyRow)) { // TODO: 발주내역 상세내역 상세내역 테이블  
                                        const { nOrderID, insert_date, last_modify_date, cancel_date, staff_name, last_modify_staff, cacel_staff, state_name, order_count, first_item, amount } = tbodyRow;

                                        const tempData = { insert_date, last_modify_date, cancel_date, staff_name, last_modify_staff, cacel_staff, state_name, order_count, first_item, amount }; // 순서 정리
                                        const handleText = (keyName: string, value: string | number) => {
                                            if (keyName === 'insert_date' || keyName === 'last_modify_date' || keyName === 'cancel_date') { // 날짜 정리
                                                return format(new Date(value), 'yyyy/MM/dd hh:mm')
                                            } else if (keyName === 'first_item') { // '~~ 외 n건' 처리
                                                if (order_count > 1) { // 1개 이상 품목 있는 경우
                                                    return `${value} 외 ${order_count - 1}건`
                                                } else return value; // 품목이 1개라면 바로 품목 이름 리턴
                                            } else if (keyName === 'amount') {
                                                return `${Utils.numberComma(value)}원`;
                                            } else if (keyName === 'order_count') {
                                                return Utils.numberComma(value);
                                            } else return value;
                                        }; // 내부 텍스트 관련

                                        const handleClassName = (keyName: string) => {
                                            if (keyName === 'order_count' || keyName === 'amount') return 'align-right';
                                            else if (keyName === 'first_item') return 'align-left order-view';
                                            else return 'align-center;'
                                        }// 클래스 관련

                                        const handlePopupOrderDetail = () => {
                                            // TODO: 상세 품목 모달 열기 
                                            setOrderDetailmodalState((prevState) => ({ ...prevState, show: true, orderCode: nOrderID }));
                                        };

                                        return (
                                            <tr key={`etc_detail_table_body_row_${idx}`}>
                                                {Object.entries(tempData).map((bodyItem: [string, string | number], idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                                                    return <td key={`etc_detail_table_tbody_${idx}`} className={handleClassName(bodyItem[0])} onClick={handlePopupOrderDetail}>{handleText(bodyItem[0], bodyItem[1])}</td>
                                                })}
                                            </tr>
                                        )
                                    } else if (isVirtualAccListType(tbodyRow)) { // TODO: 가상계좌 충전/차감 상세내역 테이블
                                        const { balance, deposit, division, log_date, state } = tbodyRow;
                                        const tempData: VirtualAccListType = { log_date, division, deposit, state, balance }; // 순서 정리 ... 거래일시 - 거래구분 - 거래 금액 - 적요 - 거래 후 잔액

                                        const handleClassName = (keyName: string) => {
                                            switch (keyName) {
                                                case 'log_date': return 'align-center';
                                                case 'division':
                                                    if (division === '차감') return 'align-center negative-value'
                                                    else return 'align-center';
                                                case 'deposit':
                                                    if (division === '차감') return 'align-center negative-value';
                                                    else return 'align-center';
                                                case 'state': return 'align-center';
                                                case 'balance': return 'align-right';
                                                default: return ''
                                            }
                                        }; // className 관련
                                        const handleText = (keyName: string, value: string | number) => {
                                            if (keyName === 'log_date') { // 날짜 정리
                                                return format(new Date(value), 'yyyy/MM/dd hh:mm')
                                            } else if (keyName === 'deposit' || keyName === 'balance') {
                                                return Utils.numberComma(value);
                                            } else return value;
                                        }; // 내부 데이터 관련

                                        return (
                                            <tr key={`etc_Detail_table_body_row_${idx}`}>
                                                {Object.entries(tempData).map((bodyItem: [string, string], idx: number) => {  // ['balance', '123450']
                                                    return <td key={`etc_detail_table_tbody_${idx}`} className={handleClassName(bodyItem[0])}>{handleText(bodyItem[0], bodyItem[1])}</td>
                                                })}
                                            </tr>
                                        )
                                    } else {
                                        return (
                                            <tr key={`etc_Detail_table_body_row_${idx}`}>
                                                {tbodyRow.map((bodyItem: any, idx: number) => {  // ? 프로시저 데이터 확인 후 수정
                                                    return <td key={`etc_detail_table_tbody_${idx}`} className="align-center">{bodyItem}</td>
                                                })}
                                            </tr>
                                        )
                                    }
                                })
                                :
                                <tr>
                                    <td colSpan={10}>데이터가 없습니다.</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </>
        )
    }
)

interface EtcDetailTableHeadProps {
    detailTableColGroup: string[],
    detailTableHead: ExtraOverallTableRowItemType[][] | TableHeadItemType[][]
}
const EtcDetailTableHead = forwardRef<HTMLTableRowElement | null, EtcDetailTableHeadProps>(({ detailTableColGroup, detailTableHead }, ref) => {
    const handleColumnRowText = (itemName: Array<string> | string) => {
        if (Array.isArray(itemName)) { // ExtraOverallTableRowItemType 경우
            if (itemName.length > 1) return <>{itemName[0]}<p>({itemName[1]})</p></>;
            else return itemName[0];
        } else { // TableHeadItemType 경우
            return itemName;
        };
    };

    return (
        <>
            <colgroup>
                {detailTableColGroup.map((el, idx) => <col key={`extra_overall_col_${idx}`} width={el} />)}
            </colgroup>
            <thead>
                {detailTableHead.map((trData, idx1) => {
                    return (
                        <tr key={`extra_overall_table_row_${idx1}`} ref={idx1 === 0 && !!ref ? ref : undefined}>
                            {trData.map((tdData, idx2) => {
                                return (
                                    <th key={`extra_overall_table_row_item_${idx2}`} rowSpan={tdData.rowSpan || undefined} colSpan={tdData.colSpan || undefined} className={tdData.className || ''}>
                                        {handleColumnRowText(tdData.itemName)}
                                    </th>
                                )
                            })}
                        </tr>
                    )
                })}
            </thead>
        </>
    )
})

interface EtcDetailTableFallbackProps {
    colGroup: Array<string>,
    theadData: TableHeadItemType[][] | ExtraOverallTableRowItemType[][],
}
const EtcDetailTableFallback: FC<EtcDetailTableFallbackProps> = ({ colGroup, theadData }) => {
    return (
        <table className="board-wrap" cellPadding="0" cellSpacing="0">
            <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={theadData} />
            <tbody>
                <Loading width={50} height={50} isTable={true} />
            </tbody>
        </table>
    )
}

interface EtcDetailTableErrorFallbackProps {
    colSpan: number,
    colGroup: Array<string>,
    theadData: TableHeadItemType[][] | ExtraOverallTableRowItemType[][],
    resetErrorBoundary: () => void;
}
const EtcDetailTableErrorFallback: FC<EtcDetailTableErrorFallbackProps> = ({ colSpan, colGroup, theadData, resetErrorBoundary }) => {
    return (
        <table className="board-wrap" cellPadding="0" cellSpacing="0">
            <EtcDetailTableHead detailTableColGroup={colGroup} detailTableHead={theadData} />
            <tbody>
                <SuspenseErrorPage isTable={true} />
            </tbody>
        </table>
    )
}

export { EtcDetailTable, EtcDetailTableHead, EtcDetailTableFallback, EtcDetailTableErrorFallback };
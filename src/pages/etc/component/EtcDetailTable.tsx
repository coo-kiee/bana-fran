import React, { FC, forwardRef, ReactNode, useRef } from "react";
import Utils from "utils/Utils";
import { format } from "date-fns";

// component
import Loading from "pages/common/loading";
import SuspenseErrorPage from "pages/common/suspenseErrorPage";
import Sticky from "pages/common/sticky";

// type
import { PageInfoType, isMusicChargeDetailType, isOrderDetailListType, isVirtualAccListType, VirtualAccListType, TableHeadItemType, ETC_TAB_TYPE } from "types/etc/etcType";
import { ExtraOverallTableRowItemType } from "types/membership/extraType";
import NoData from "pages/common/noData";
import { EtcDetailTableHead } from "./EtcDetailTableHeader";

interface EtcDetailTableProps {
    colGroup: Array<string>, // colgroup width 관련 ... ["195", "195", ...]
    theadData: TableHeadItemType[][], // 테이블 header th 관련 ...[ [{itemName: '기간', rowSpan: 2},{itemName: 'BGM 서비스 이용료' colSpan: 3,className:'price-area'},...], [{itemName: '공급가', className: 'price-area'}] ]
    tbodyData: ReactNode[], // ? 프로시저 데이터 확인하기
    pageInfo: PageInfoType, // 페이지네이션 관련 정보
    handlePopupOrderDetail?: () => void, // 발주내역에서 EtcOrderDetail 여는 함수
}

// TODO: 상세 내역 테이블 관련 (.board-wrap 부분)
const EtcDetailTable = forwardRef<HTMLTableElement, EtcDetailTableProps>(
    (props, ref) => {
        console.log(`EtcDetailTable`)
        const { colGroup, theadData, tbodyData, pageInfo: { currentPage, row } } = props;

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
                        {tbodyData.map((item: any, index: number) => {
                            const isCurrentPage = (index >= (currentPage - 1) * row && index < currentPage * row);
                            return (<tr key={index} style={{ display: isCurrentPage ? '' : 'none' }}>{item}</tr>);
                        })}
                        {tbodyData?.length === 0 && <NoData isTable={true} />}
                    </tbody>
                </table>
            </>
        )
    }
)

export default EtcDetailTable;

const tabList = {
    [ETC_TAB_TYPE.DELIVERY]: {
        detailInfo: [
            ['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'],
            ['수수료 공급가', '주문금액의 2% (부가세 별도.)']
        ],
        colgroup: ['188', '*', '120', '120', '150', '190', '136', '150', '150', '150'],
        tableHead: [
            [{ itemName: '결제일시', rowSpan: 2 }, { itemName: '메뉴', rowSpan: 2 }, { itemName: '주문금액', rowSpan: 2 }, { itemName: '배달비', rowSpan: 2 }, { itemName: '결제방식', rowSpan: 2 }, { itemName: '결제수단', rowSpan: 2 }, { itemName: '주문자', rowSpan: 2 }, { itemName: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' }],
            [{ itemName: '수수료 공급가 (2%)', className: "price-area" }, { itemName: '부가세 (0.2%)', className: "price-area" }, { itemName: '수수료 합계 (2.2%)', className: "price-area" },]
        ],
    },
    [ETC_TAB_TYPE.MUSIC]: {
    },
    [ETC_TAB_TYPE.GIFTCARD]: {
    },
    [ETC_TAB_TYPE.ORDER]: {
    },
    [ETC_TAB_TYPE.ROYALTY]: {
    },
    [ETC_TAB_TYPE.ACCOUNT]: {
    },
};
import { FC, useState } from "react";
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// component   
import DeliveryChargeDetail from "./DeliveryChargeDetail";

// type
import { SearchInfoType, SearchInfoSelectType, TableHeadItemType, ETC_DELIVERY_SEARCH_OPTION_TYPE, ETC_DELIVERY_SEARCH_OPTION_LIST, ETC_TAB_TYPE } from "types/etc/etcType";
import CalanderSearch from "pages/common/calanderSearch";
import EtcTotalTable from "../component/EtcTotalTable";

const DeliveryCharge = () => {
    // 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [{ value: 'SEARCH_0', title: '구분 전체' }]
    }); // 실제 쿼리에서 사용될 날짜, 옵션값

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // column 관련 데이터 
    const detailPriceInfo = [
        ['주문금액', '배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.'],
        ['수수료 공급가', '주문금액의 2% (부가세 별도.)']
    ];
    const detailTableColGroup = ['188', '*', '120', '120', '150', '190', '136', '150', '150', '150'];
    const detailTableHead: TableHeadItemType[][] = [
        [{ itemName: '결제일시', rowSpan: 2 }, { itemName: '메뉴', rowSpan: 2 }, { itemName: '주문금액', rowSpan: 2 }, { itemName: '배달비', rowSpan: 2 }, { itemName: '결제방식', rowSpan: 2 }, { itemName: '결제수단', rowSpan: 2 }, { itemName: '주문자', rowSpan: 2 }, { itemName: '바나 딜리버리 수수료', colSpan: 3, className: 'price-area' }],
        [{ itemName: '수수료 공급가 (2%)', className: "price-area" }, { itemName: '부가세 (0.2%)', className: "price-area" }, { itemName: '수수료 합계 (2.2%)', className: "price-area" },]
    ];

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.DELIVERY} />
            <DeliveryChargeDetailSearch handleSearchInfo={handleSearchInfo} />
            <DeliveryChargeDetail searchInfo={searchInfo} detailPriceInfo={detailPriceInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>
    )
}

export default DeliveryCharge;

const DeliveryChargeDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'), // 2022-10-01
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'), // 2022-10-31
        searchOption: [{ value: 'SEARCH_0', title: '구분 전체' }],
    }); // etcSearch 내부 검색 날짜 관련 보여질 state

    const searchOptionList = [
        {
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.TOTAL]: { title: '구분 전체', value: 'TOTAL' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CARD]: { title: '현장카드', value: 'CARD' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.CASH]: { title: '현장현금', value: 'CASH' },
            [ETC_DELIVERY_SEARCH_OPTION_TYPE.APP]: { title: '어플선결제', value: 'APP' },
        }
    ];

    return (
        // 검색 -> 관련 X 
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM-dd'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            selectOption={searchOptionList}
            optionList={ETC_DELIVERY_SEARCH_OPTION_LIST}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
        />
    )
}
import { FC, useState } from 'react';
import { format, subMonths, lastDayOfMonth, isAfter } from 'date-fns';

// type
import { SearchInfoSelectType, ETC_TAB_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_TYPE, ETC_GIFTCARD_SEARCH_CARD_TYPE, ETC_GIFTCARD_SEARCH_DEVICE_TYPE, ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_LIST } from "types/etc/etcType";

// component 
import GiftCardDetail from './GiftCardDetail';
import EtcTotalTable from '../component/EtcTotalTable';
import CalanderSearch from 'pages/common/calanderSearch';

const GiftCard = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-10 
        searchOption: [
            { value: 'ALL', title: '포인트 구분 전체' },
            { value: 'ALL', title: '상품권종 전체' },
            { value: 'ALL', title: '처리기기 전체' },
        ],
    }); // etcSearch 내부 검색 날짜

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoSelectType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    };

    // TODO: EtcSearchDetail 관련 데이터
    const detailPriceInfo = [
        ['키오스크/POS 판매금액은 가상계좌에서 자동 차감됩니다.'],
        ['어플 판매금액은 가상계좌에서 차감되지 않습니다.'],
        ['판매취소된 상품권은 폐기되므로 재고에 반영되지 않습니다.']
    ];

    // TODO: EtcDetailTable 관련 데이터 
    const detailTableColGroup = ['195', '195', '195', '195', '195', '195', '150', '150', '150'];
    const detailTableHead = [
        [{ itemName: '일시', rowSpan: 2 }, { itemName: '구분', rowSpan: 2 }, { itemName: '상품권종', rowSpan: 2 }, { itemName: '수령(금액)', rowSpan: 2 }, { itemName: '판매기기', rowSpan: 2 }, { itemName: '가상계좌 충전/차감', rowSpan: 2 }, { itemName: '재고', colSpan: 3, className: 'price-area' }],
        [{ itemName: '1만원권', className: "price-area" }, { itemName: '3만원권', className: "price-area" }, { itemName: '5만원권', className: "price-area" }]
    ];

    return (
        <div className="board-date-wrap">
            <EtcTotalTable currTab={ETC_TAB_TYPE.GIFTCARD} />
            <GiftCardDetailSearch handleSearchInfo={handleSearchInfo} />
            <GiftCardDetail searchInfo={searchInfo} detailPriceInfo={detailPriceInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
        </div>
    )
}

export default GiftCard;

const GiftCardDetailSearch: FC<{ handleSearchInfo: (currentTempSearchInfo: SearchInfoSelectType) => void }> = ({ handleSearchInfo }) => {
    const [tempSearchInfo, setTempSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM'), // 2022-10 
        to: format(new Date(), 'yyyy-MM'), // 2022-10 
        searchOption: [
            { value: 'CATEGORY_ALL', title: '포인트 구분 전체' },
            { value: 'CARD_ALL', title: '상품권종 전체' },
            { value: 'DEVICE_ALL', title: '처리기기 전체' },
        ],
    }); // etcSearch 내부 검색 날짜 관련 보여질 state

    const searchOptionList = [
        {
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.CATEGORY_ALL]: { title: '포인트 구분 전체', value: 'CATEGORY_ALL' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL]: { title: '판매', value: 'SELL' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.SELL_DELETE]: { title: '판매 취소(폐기)', value: 'SELL_DELETE' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.ADD]: { title: '임의 추가', value: 'ADD' },
            [ETC_GIFTCARD_SEARCH_CATEGORY_TYPE.DELETE]: { title: '임의 폐기', value: 'DELETE' },
        },
        {
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.CARD_ALL]: { title: '상품권종 전체', value: 'CARD_ALL' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.TEN]: { title: '1만원권', value: 'TEN' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.THIRTY]: { title: '3만원권', value: 'THIRTY' },
            [ETC_GIFTCARD_SEARCH_CARD_TYPE.FIFTY]: { title: '5만원권', value: 'FIFTY' },
        },
        {
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.DEVICE_ALL]: { title: '처리기기 전체', value: 'DEVICE_ALL' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.BRANCH_APP]: { title: '매장 앱', value: 'BRANCH_APP' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.APP]: { title: '어플', value: 'APP' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.KIOSK]: { title: '키오스크', value: 'DEVICE_2' },
            [ETC_GIFTCARD_SEARCH_DEVICE_TYPE.POS]: { title: 'POS', value: 'DEVICE_2' },
        },
    ];

    return (
        <CalanderSearch
            title={`상세내역`}
            dateType={'yyyy-MM'}
            searchInfo={tempSearchInfo}
            setSearchInfo={setTempSearchInfo}
            selectOption={searchOptionList}
            optionList={[ETC_GIFTCARD_SEARCH_CATEGORY_LIST, ETC_GIFTCARD_SEARCH_CARD_LIST, ETC_GIFTCARD_SEARCH_DEVICE_LIST]}
            handleSearch={() => handleSearchInfo(tempSearchInfo)} // 조회 버튼에 필요한 fn
            showMonthYearPicker={true}
        />
    )
}
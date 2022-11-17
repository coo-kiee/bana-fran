import { useState } from 'react';
import { format, subMonths, lastDayOfMonth } from 'date-fns';

// type
import { SearchInfoType, SearchInfoSelectType } from "types/etc/etcType";

// component 
import GiftCardDetail from './component/GiftCardDetail';
import GiftCardOverall from './component/GiftCardOverall';

const GiftCard = () => {
    // TODO: 상태 관련
    const [searchInfo, setSearchInfo] = useState<SearchInfoSelectType>({
        from: format(subMonths(new Date(), 1), 'yyyy-MM-01'),
        to: format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
        searchOption: [
            { value: 'ALL', title: '포인트 구분 전체' },
            { value: 'ALL', title: '상품권종 전체' },
            { value: 'ALL', title: '처리기기 전체' },
        ],
    }); // etcSearch 내부 검색 날짜

    // 상태 관련 함수
    const handleSearchInfo = (currentTempSearchInfo: SearchInfoType) => {
        setSearchInfo((prevSearchInfo) => ({ ...prevSearchInfo, ...currentTempSearchInfo }));
    }; // tempSearchInfo -> searchInfo로 업데이트 (-> 자동으로 refetch역할)

    // TODO: EtcTable 관련 데이터 (프로시저 데이터 확인 후 수정하기)
    const colGroup = ['20%', '20%', '20%', '20%', '20%',];
    const thead = ['재고 구분', '1만원권', '3만원권', '5만원권', '합계'];

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
        <div id="tab3" className="tab-content active">
            <div className="info-wrap">
                <p>※ 실물 상품권 발주/위탁판매내역을 조회할 수 있습니다.<strong>(가상계좌 자동 차감되므로 정산내역에는 반영되지 않습니다.)</strong></p>
            </div>
            <div className="board-date-wrap">
                <GiftCardOverall tableColGroup={colGroup} tableHead={thead} />
                <GiftCardDetail searchInfo={searchInfo} detailPriceInfo={detailPriceInfo} handleSearchInfo={handleSearchInfo} detailTableColGroup={detailTableColGroup} detailTableHead={detailTableHead} />
            </div>
        </div>
    )
}

export default GiftCard;
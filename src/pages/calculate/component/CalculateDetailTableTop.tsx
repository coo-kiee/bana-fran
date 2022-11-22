import { FC, ReactNode } from "react";

// Type
import { SearchInfoRadioType, SearchInfoSelectType, SearchInfoType } from "types/etc/etcType";

// Component
import CalanderSearch from "pages/common/calanderSearch";

interface CalculateDetailTableTopProps {
    calanderSearchOption: {
        title?: string,
        dateTitle?: string,
        optionType?: 'SELECT' | 'RADIO',
        selectOption?: Array<{ [x: string | number]: { title: string, value: string | number } }>,
        optionList?: Array<any>,
        handleSearch?: () => void,
    },
    titleFrom: string,
    titleTo: string,
    searchResult: ReactNode,
    searchCondition: SearchInfoRadioType | SearchInfoSelectType | SearchInfoType,
    setSearchCondition: React.Dispatch<React.SetStateAction<any>>,
};
const CalculateDetailTableTop: FC<CalculateDetailTableTopProps> = ({ calanderSearchOption, titleFrom, titleTo, searchResult, searchCondition, setSearchCondition }) => {

    const { title = '', dateTitle = '', optionType = undefined, selectOption = [], optionList = [], handleSearch } = calanderSearchOption;

    return (
        <>
            <CalanderSearch
                title={title}
                dateTitle={dateTitle}
                dateType={'yyyy-MM-dd'}
                searchInfo={searchCondition}
                setSearchInfo={setSearchCondition}
                optionType={optionType}
                selectOption={selectOption} // select로 나타날 옵션 정보
                optionList={optionList} // option 맵핑할 때 사용  
                handleSearch={handleSearch}
            />
            <div className="search-result-wrap">
                {
                    <>
                        <div className="search-date">
                            {/* <p>조회기간: {titleFrom} ~ {titleTo}</p> */}
                        </div>
                        <ul className="search-result">
                            {/* {searchResult} */}
                            {/* <li>충전포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalChargePoint)}원</span></li>
                            <li>잔돈포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalPointChange)}원</span></li>
                            <li>유상(충전+잔돈)포인트 사용금액 합계 : <span className="value">{Utils.numberComma(totalChargePoint + totalPointChange)}원</span></li> */}
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

export default CalculateDetailTableTop;
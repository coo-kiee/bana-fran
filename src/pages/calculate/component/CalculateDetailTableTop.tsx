import { FC } from "react";

// Type
import { SearchInfoRadioType, SearchInfoSelectType, SearchInfoType } from "types/etc/etcType";

// Component
import CalanderSearch from "pages/common/calanderSearch";
import Utils from "utils/Utils";

interface CalculateDetailTableTopProps {
    calanderSearchOption: {
        title?: string,
        dateTitle?: string,
        dateType?: string,
        optionType?: 'SELECT' | 'RADIO',
        selectOption?: Array<{ [key: string | number]: { title: string, value: string | number } }>,
        optionList?: Array<any>,
        showMonthYearPicker?: boolean,
        handleSearch?: () => void,
    },
    titleFrom: string,
    titleTo: string,
    totalInfo: { [key: string | number]: { title: string, sum: number } },
    searchCondition: SearchInfoRadioType | SearchInfoSelectType | SearchInfoType,
    setSearchCondition: React.Dispatch<React.SetStateAction<any>>,
};
const CalculateDetailTableTop: FC<CalculateDetailTableTopProps> = ({ calanderSearchOption, titleFrom, titleTo, totalInfo, searchCondition, setSearchCondition }) => {

    const { title = '', dateTitle = '', dateType = 'yyyy-MM-dd', optionType = undefined, selectOption = [], optionList = [], showMonthYearPicker = false, handleSearch } = calanderSearchOption;

    return (
        <>
            <CalanderSearch
                title={title}
                dateTitle={dateTitle}
                dateType={dateType}
                searchInfo={searchCondition}
                setSearchInfo={setSearchCondition}
                optionType={optionType}
                selectOption={selectOption} // select로 나타날 옵션 정보
                optionList={optionList} // option 맵핑할 때 사용  
                showMonthYearPicker={showMonthYearPicker}
                handleSearch={handleSearch}
            />
            <div className="search-result-wrap">
                {
                    <>
                        <div className="search-date">
                            <p>조회기간: {titleFrom} ~ {titleTo}</p>
                        </div>
                        <ul className="search-result">
                            {totalInfo && Object.values(totalInfo).map((total, index) => <li key={index}>{total.title} : <span className="value">{Utils.numberComma(total.sum)}원</span></li>)}
                        </ul>
                    </>
                }
            </div>
        </>
    )
};

export default CalculateDetailTableTop;
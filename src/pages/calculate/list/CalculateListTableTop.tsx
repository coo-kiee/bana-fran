import { FC } from "react";

// Type
import { CalculateStatusType, CALCULATE_STATUS } from "types/calculate/calculateType";

// API
import CALCULATE_SERVICE from 'service/calculateService';

interface CalculateListTableTopProps {
    listRefetchFn: (() => Promise<void>) | undefined,
    calculateStatus: CalculateStatusType,
    fCode: number,
    staffNo: number,
    searchDate: string,
    handlePopup: (key: string, value: boolean) => void,
    setSearchDate: React.Dispatch<React.SetStateAction<string>>,
};
const CalculateListTableTop: FC<CalculateListTableTopProps> = ({ listRefetchFn, calculateStatus, fCode, staffNo, searchDate, handlePopup, setSearchDate }) => {

    const isError = calculateStatus === CALCULATE_STATUS.ERROR;
    const isInactive = !calculateStatus || calculateStatus === CALCULATE_STATUS.CONFIRM || isError;
    const { data: monthList } = CALCULATE_SERVICE.useCalculateMonthList(fCode, staffNo);

    return (
        <>
            {
                <div className="function-wrap">
                    <div className="select-wrap">
                        <div className="search-wrap">
                            <select name="" id="" value={searchDate} onChange={(e) => setSearchDate(prev => e.target.value)}>
                                {monthList?.map((item, index) => <option key={index} value={item.std_month}>{item.std_month}</option>)}
                                {monthList?.length === 0 && <option value={searchDate}>{searchDate}</option>}
                            </select>
                            <button className="goast-btn" onClick={() => listRefetchFn && listRefetchFn()}>선택</button>
                        </div>
                    </div>
                    <div className="btn-wrap">
                        <button className={`btn-check ${isInactive ? 'inactive' : ''}`} onClick={isInactive ? undefined : () => handlePopup('calculateConfirm', true)} >정산확인</button>
                        <button className={`btn-modify-request modify-view ${isInactive ? 'inactive' : ''}`} onClick={isInactive ? undefined : () => handlePopup('requestModify', true)} >수정요청</button>
                        <button className={`btn-modify-history history-view ${isError ? 'inactive' : ''}`} onClick={isError ? undefined : () => handlePopup('changeHistory', true)} >수정요청/변경이력</button>
                    </div>
                    <p className="title">
                        <span className="sub-title hyphen">'보전'은 본사로부터 보전받을 금액이며, '청구'는 본사가 가맹점에 청구하는 금액을 의미합니다.</span>
                    </p>
                </div>
            }
        </>
    )
};
 
export default CalculateListTableTop;
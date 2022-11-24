// Date
import { format, lastDayOfMonth, subMonths } from "date-fns";

// Type
import { FC, useState } from "react";
import { CALCULATE_TYPE, CLAIM_TAB_TYPE, TabType } from "types/calculate/calculateType";

// State
import { franState, loginState } from "state";
import { useRecoilValue } from "recoil";

// Util
import Utils from "utils/Utils";

// Component
import CalculateHeader from "pages/calculate/component/CalculateHeader";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import CalculateClaimDetailTable from "./CalculateClaimDetailTable";
import CalculateLastMonthTable from "pages/calculate/component/CalculateLastMonthTable";
import CalculateClaimTab from "./CalculateClaimTab";

const CalculateClaim: FC = () => {

    const caculateType = CALCULATE_TYPE.CLAIM;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list[0]?.f_code_name || '';
    const staff_no = userInfo?.staff_no || 0;

    const [tabType, setTabType] = useState<TabType>(CLAIM_TAB_TYPE.CLAIM);
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const initialSearchDate = Object.values(CLAIM_TAB_TYPE).reduce((arr, cur) => {
        arr[cur] = { fromDate, toDate };
        return arr
    }, {} as TabSearchDateInfo);
    
    const [tabSearchDateInfo, setTabSearchDateInfo] = useState<TabSearchDateInfo>(initialSearchDate);

    return (
        <>
            <section className="container">
                <CalculateHeader caculateType={caculateType} />
                <section className="contents-wrap claim-wrap">
                    <div className="contents">
                        <CalculatePrecautions caculateType={caculateType} />
                        <div className="board-date-wrap">
                            <CalculateLastMonthTable userInfo={{ f_code, f_code_name, staff_no }} caculateType={caculateType} />
                            <div id="tab1" className="tab-content active">
                                <CalculateClaimTab tabType={tabType} setTabType={setTabType}/>
                                <CalculateClaimDetailTable tabType={tabType} userInfo={{ f_code, f_code_name, staff_no }} tabSearchDateInfo={tabSearchDateInfo} setTabSearchDateInfo={setTabSearchDateInfo} />
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CalculateClaim;




// Component Type
export type TabSearchDateInfo = {
    [key in TabType]: { fromDate: string, toDate: string }
};
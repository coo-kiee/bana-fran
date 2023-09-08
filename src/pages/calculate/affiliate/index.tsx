// Date
import { format, lastDayOfMonth, subMonths } from "date-fns";

// Type
import { FC, useState } from "react";
import { AffilateTabType, AFFILIATE_TAB_TYPE, CALCULATE_TYPE  } from "types/calculate/calculateType";

// State
import { franState, loginState } from "state";
import { useRecoilValue } from "recoil";

// Component
import CalculateSection from "pages/calculate/component/CalculateSection";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import CalculateAffiliateDetailTable from "./CalculateAffiliateDetailTable";
import CalculateLastMonthTable from "pages/calculate/component/CalculateLastMonthTable";
import CalculateAffiliateTab from "./CalculateAffiliateTab";

const CalculateAffiliate: FC = () => {

    const caculateType = CALCULATE_TYPE.AFFILIATE;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list.length > 0 ? Object.values(userInfo?.f_list).filter((item: any) => item.f_code === f_code)[0]?.f_code_name : '';
    const staff_no = userInfo?.staff_no || 0;

    const [tabType, setTabType] = useState<AffilateTabType>(AFFILIATE_TAB_TYPE.COUPON);
    const fromDate = format(subMonths(new Date(), 1), 'yyyy-MM-01');
    const toDate = format(lastDayOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const initialSearchDate = Object.values(AFFILIATE_TAB_TYPE).reduce((arr, cur) => {
        arr[cur] = { fromDate, toDate };
        return arr
    }, {} as TabSearchDateInfo);

    const [tabSearchDateInfo, setTabSearchDateInfo] = useState<TabSearchDateInfo>(initialSearchDate);

    return (
        <CalculateSection caculateType={caculateType} >
            <CalculateAffiliateTab tabType={tabType} setTabType={setTabType} />
            <CalculatePrecautions caculateType={tabType} />
            <div className="board-date-wrap">
                <CalculateLastMonthTable userInfo={{ f_code, f_code_name, staff_no }} caculateType={tabType} />
                <div id="tab1" className="tab-content active">
                    <CalculateAffiliateDetailTable tabType={tabType} userInfo={{ f_code, f_code_name, staff_no }} tabSearchDateInfo={tabSearchDateInfo} setTabSearchDateInfo={setTabSearchDateInfo} />
                </div>
            </div>
        </CalculateSection>
    );
}

export default CalculateAffiliate;




// Component Type
export type TabSearchDateInfo = {
    [key in AffilateTabType]: { fromDate: string, toDate: string }
};
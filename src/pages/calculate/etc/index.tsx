
// Type
import { FC } from "react";
import { CALCULATE_TYPE } from "types/calculate/calculateType";

// State
import { franState, loginState } from "state";
import { useRecoilValue } from "recoil";

// Component
import CalculateSection from "pages/calculate/component/CalculateSection";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import CalculateEtcDetailTable from "./CalculateEtcDetailTable";
import CalculateLastMonthTable from "pages/calculate/component/CalculateLastMonthTable";

const CalculateEtc: FC = () => {

    const caculateType = CALCULATE_TYPE.ETC;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list.length > 0 ? Object.values(userInfo?.f_list).filter((item: any) => item.f_code === f_code)[0]?.f_code_name : '';
    const staff_no = userInfo?.staff_no || 0;

    return (
        <CalculateSection caculateType={caculateType} >
            <CalculatePrecautions caculateType={caculateType} />
            <div className="board-date-wrap">
                <CalculateLastMonthTable userInfo={{ f_code, f_code_name, staff_no }} caculateType={caculateType} />
                <CalculateEtcDetailTable userInfo={{ f_code, f_code_name, staff_no }} />
            </div>
        </CalculateSection>
    );
}

export default CalculateEtc;
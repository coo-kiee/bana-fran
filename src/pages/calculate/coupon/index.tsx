import { FC } from "react";

// Type
import { CALCULATE_TYPE } from "types/calculate/calculateType";


// State
import { franState, loginState } from "state";
import { useRecoilValue } from "recoil";

// Component
import CalculateSection from "pages/calculate/component/CalculateSection";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import CalculateCouponDetailTable from "./CalculateCouponDetailTable";
import CalculateLastMonthTable from "pages/calculate/component/CalculateLastMonthTable";

const CalculateCoupon: FC = () => {

    const caculateType = CALCULATE_TYPE.COUPON;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = useRecoilValue(franState);
    const f_code_name = userInfo?.f_list.length > 0 ? Object.values(userInfo?.f_list).filter((item: any) => item.f_code === f_code)[0]?.f_code_name : '';
    const staff_no = userInfo?.staff_no || 0;

    return (
        <CalculateSection caculateType={caculateType} >
            <CalculatePrecautions caculateType={caculateType} />
            <div className="fixed-paid-point-wrap">
                <CalculateLastMonthTable userInfo={{ f_code, f_code_name, staff_no }} caculateType={caculateType} />
                <CalculateCouponDetailTable userInfo={{ f_code, f_code_name, staff_no }} />
            </div>
        </CalculateSection>
    );
}

export default CalculateCoupon;
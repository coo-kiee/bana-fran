
// Type
import { FC } from "react";
import { CALCULATE_TYPE } from "types/calculate/calculateType";

// State
import { loginState } from "state";
import { useRecoilValue } from "recoil";

// Component
import CalculateHeader from "pages/calculate/component/CalculateHeader";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import PointDetailTable from "./PointDetailTable";
import CalculateLastMonthTable from "pages/calculate/component/CalculateLastMonthTable";

const CalculatePoint: FC = () => {

    const caculateType = CALCULATE_TYPE.POINT;

    // 사용자 정보
    const { userInfo } = useRecoilValue(loginState);
    const f_code = userInfo?.f_list[0]?.f_code || 0;
    const f_code_name = userInfo?.f_list[0]?.f_code_name || '';
    const staff_no = userInfo?.staff_no || 0;

    return (
        <>
            <section className="container">
                <CalculateHeader caculateType={caculateType} />
                <section className="contents-wrap paid-point-wrap">
                    <div className="contents">
                        <CalculatePrecautions caculateType={caculateType} />
                        <div className="fixed-paid-point-wrap">
                            <CalculateLastMonthTable userInfo={{ f_code, f_code_name, staff_no }} caculateType={caculateType} />
                            <PointDetailTable userInfo={{ f_code, f_code_name, staff_no }} />
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CalculatePoint;
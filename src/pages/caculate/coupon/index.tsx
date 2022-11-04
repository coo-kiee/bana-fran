
// Type
import { FC } from "react";
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculatePrecautions from "pages/caculate/component/CaculatePrecautions";
import CouponDetailTable from "./CouponDetailTable";
import CouponLastMonthTable from "./CouponLastMonthTable";

// interface CaculateCouponProps {
//     caculateType: CaculateType,
// };
const CaculateCoupon: FC = ({  }) => {

    const caculateType = CACULATE_TYPE.COUPON;

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap paid-point-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
                        <div className="fixed-paid-point-wrap">
                            <CouponLastMonthTable />
                            <CouponDetailTable />
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CaculateCoupon;
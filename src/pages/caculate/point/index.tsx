
// Type
import { FC } from "react";
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculatePrecautions from "pages/caculate/component/CaculatePrecautions";
import PointDetailTable from "./PointDetailTable";
import PointLastMonthTable from "./PointLastMonthTable";

// interface CaculatePointProps {
//     caculateType: CaculateType,
// };
const CaculatePoint: FC = ({  }) => {

    const caculateType = CACULATE_TYPE.POINT;

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap paid-point-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
                        <div className="fixed-paid-point-wrap">
                            <PointLastMonthTable />
                            <PointDetailTable />
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CaculatePoint;
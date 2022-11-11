
// Type
import { FC } from "react";
import { CalculateType, CALCULATE_TYPE } from "types/calculate/calculateType";

// Component
import CalculateHeader from "pages/calculate/component/CalculateHeader";
import CalculatePrecautions from "pages/calculate/component/CalculatePrecautions";
import ClaimDetailTable from "./ClaimDetailTable";
import ClaimLastMonthTable from "./ClaimLastMonthTable";

// interface CalculateClaimProps {
//     caculateType: CalculateType,
// };
const CalculateClaim: FC = ({  }) => {

    const caculateType = CALCULATE_TYPE.CLAIM;

    return (
        <>
            <section className="container">
                <CalculateHeader caculateType={caculateType} />
                <section className="contents-wrap claim-wrap">
                    <div className="contents">
                        <CalculatePrecautions caculateType={caculateType} />
                        <div className="board-date-wrap">
                            <ClaimLastMonthTable />
                            <ClaimDetailTable />
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
}

export default CalculateClaim;
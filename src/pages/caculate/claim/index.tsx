
// Type
import { FC } from "react";
import { CaculateType } from "types/caculate/caculateType";

// Component
import CaculateHeader from "pages/caculate/component/CaculateHeader";
import CaculatePrecautions from "pages/caculate/component/CaculatePrecautions";
import ClaimDetailTable from "./ClaimDetailTable";
import ClaimLastMonthTable from "./ClaimLastMonthTable";

interface CaculateClaimProps {
    caculateType: CaculateType,
};
const CaculateClaim: FC<CaculateClaimProps> = ({ caculateType }) => {

    return (
        <>
            <section className="container">
                <CaculateHeader caculateType={caculateType} />
                <section className="contents-wrap claim-wrap">
                    <div className="contents">
                        <CaculatePrecautions caculateType={caculateType} />
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

export default CaculateClaim;
import { FC } from "react";

// Type
import { CalculateType, CALCULATE_TYPE } from "types/calculate/calculateType";

interface CalculateHeaderProps {
    caculateType: CalculateType,
};
const CalculateHeader: FC<CalculateHeaderProps> = ({ caculateType }) => {

    return (
        <header>
            <div className="page-title calculate">
                <p className="present">정산관리</p>
                <p className="spot">{HEADER_SUBTITLE[caculateType]}</p>
            </div>
        </header>
    );
}

export default CalculateHeader;



const HEADER_SUBTITLE = {
    [CALCULATE_TYPE.LIST]: '정산내역 확인',
    [CALCULATE_TYPE.POINT]: '유상포인트 결제내역',
    [CALCULATE_TYPE.COUPON]: '본사 쿠폰 결제내역',
    [CALCULATE_TYPE.CLAIM]: '고객 클레임 보상 내역',
    [CALCULATE_TYPE.ETC]: '기타 정산 내역',
} as const;
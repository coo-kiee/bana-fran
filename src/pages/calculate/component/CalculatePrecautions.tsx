// Type
import { FC } from "react";
import { AffilateTabType, AFFILIATE_TAB_TYPE, CALCULATE_TYPE } from "types/calculate/calculateType";

interface CalculatePrecautionsProps {
    caculateType: CALCULATE_TYPE | AffilateTabType,
};
const CalculatePrecautions: FC<CalculatePrecautionsProps> = ({ caculateType }) => {
    
    return (
        <div className="info-wrap">
            {
                PRECAUTIONS_INFO[caculateType as keyof typeof PRECAUTIONS_INFO].map((text, index) => <p key={index}>{text}</p>)
            }
        </div>
    );
}

export default CalculatePrecautions;



// Component Type
const PRECAUTIONS_INFO = {
    [CALCULATE_TYPE.LIST]: ['※ 직전 월 정산내역을 확인 후 [정산확인]을 완료하시면 본사에서 세금계산서를 발행합니다.'],
    [CALCULATE_TYPE.POINT]: ['※ 유상포인트(충전포인트/잔돈포인트)의 결제내역을 조회 가능 합니다. (무상으로 제공되는 바나포인트는 제외).'],
    [CALCULATE_TYPE.COUPON]: ['※ 본사에서 비용을 부담하는 쿠폰의 결제내역을 조회 가능 합니다. (가맹점 비용 부담인 월간랭킹쿠폰, 스탬프적립쿠폰 등은 제외)'],
    [CALCULATE_TYPE.CLAIM]: ['※ 가맹점 과실로 발생한 고객 클레임 보상을 위해 본사가 발행한 쿠폰이 사용된 경우의 비용청구 및 보전내역을 조회할 수 있습니다.'],
    [CALCULATE_TYPE.ETC]: ['※ 기타 발생한 가맹점에 대한 비용 청구 및 보전 등의 정산내역을 조회할 수 있습니다.'],
    [AFFILIATE_TAB_TYPE.COUPON]: ['※ 제휴사 쿠폰 결제금액은 제휴사에서 직접 정산(수수료 차감 후)하여 지급합니다.'],
} as const;
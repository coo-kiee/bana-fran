// Type
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

const CaculatePrecautions = () => {
    
    const temp: CaculateType = CACULATE_TYPE.LIST;
    return (
        <div className="info-wrap">
            {
                PRECAUTIONS_INFO[temp].map((text, index) => <p key={index}>{text}</p>)
            }
        </div>
    );
}

export default CaculatePrecautions;



const PRECAUTIONS_INFO = {
    [CACULATE_TYPE.LIST]: ['※ 직전 월 정산내역을 확인 후 [정산확인]을 완료하시면 본사에서 세금계산서를 발행합니다.', '※ 당월 5일까지 직전월의 정산확인을 하지 않을 시 자동으로 정산확인 완료 처리됩니다.'],
    [CACULATE_TYPE.POINT]: ['※ 유상포인트(충전포인트/잔돈포인트)의 결제내역을 조회 가능 합니다. (무상으로 제공되는 바나포인트는 제외).'],
    [CACULATE_TYPE.COUPON]: ['※ 본사에서 비용을 부담하는 쿠폰의 결제내역을 조회 가능 합니다. (가맹점 비용 부담인 월간랭킹쿠폰, 스탬프적립쿠폰 등은 제외)'],
    [CACULATE_TYPE.CLAIM]: ['※ 해당 가맹점의 과실로 인한 고객 클레임을 보상하기 위해 본사에서 임의 발행한 ‘서비스 쿠폰’에 대한 청구 내역을 조회할 수 있습니다.'],
    [CACULATE_TYPE.ETC]: ['※ 기타 발생한 가맹점에 대한 비용 청구 및 보전 등의 정산내역을 조회할 수 있습니다.'],
} as const;
import { FC } from "react";

// Type
import { CaculateType, CACULATE_TYPE } from "types/caculate/caculateType";

interface CaculateHeaderProps {
    caculateType: CaculateType,
};
const CaculateHeader: FC<CaculateHeaderProps> = ({ caculateType }) => {

    return (
        <header>
            <div className="page-title calculate">
                <p className="present">정산관리</p>
                <p className="spot">{HEADER_SUBTITLE[caculateType]}</p>
            </div>
        </header>
    );
}

export default CaculateHeader;



const HEADER_SUBTITLE = {
    [CACULATE_TYPE.LIST]: '정산내역 확인',
    [CACULATE_TYPE.POINT]: '유상포인트 결제내역',
    [CACULATE_TYPE.COUPON]: '본사 쿠폰 결제내역',
    [CACULATE_TYPE.CLAIM]: '고객 클레임 보상 내역',
    [CACULATE_TYPE.ETC]: '기타 정산 내역',
} as const;
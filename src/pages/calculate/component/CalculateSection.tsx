import { FC, ReactNode } from 'react';

// Const
import { CalculateType, CALCULATE_TYPE } from 'constants/calculate/common';

interface CalculateSectionProps {
  caculateType: CalculateType;
  children: ReactNode;
}
const CalculateSection: FC<CalculateSectionProps> = ({ caculateType, children }) => {
  return (
    <section className={`container ${caculateType === 3 ? 'min-width-1800' : 'min-width-1400'}`}>
      <CalculateHeader caculateType={caculateType} />
      <section className={`contents-wrap ${SECTION_CLASSNAME[caculateType]}`}>
        <div className="contents">{children}</div>
      </section>
    </section>
  );
};

export default CalculateSection;

const CalculateHeader: FC<{ caculateType: CalculateType }> = ({ caculateType }) => {
  return (
    <header>
      <div className="page-title calculate">
        <p className="present">정산관리</p>
        <p className="spot">{HEADER_SUBTITLE[caculateType]}</p>
      </div>
    </header>
  );
};

// Component Type
const HEADER_SUBTITLE = {
  [CALCULATE_TYPE.LIST]: '정산내역 확인',
  [CALCULATE_TYPE.POINT]: '유상포인트 결제내역',
  [CALCULATE_TYPE.COUPON]: '본사 쿠폰 결제내역',
  [CALCULATE_TYPE.CLAIM]: '클레임 쿠폰 정산내역',
  [CALCULATE_TYPE.ETC]: '기타 정산 내역',
  [CALCULATE_TYPE.AFFILIATE]: '제휴사 쿠폰/포인트 결제내역',
  [CALCULATE_TYPE.BANA_POINT]: '바나포인트 정산내역',
  [CALCULATE_TYPE.STAMP_COUPON]: '스탬프 쿠폰 정산내역',
} as const;

const SECTION_CLASSNAME = {
  [CALCULATE_TYPE.LIST]: 'calculate-wrap',
  [CALCULATE_TYPE.POINT]: 'paid-point-wrap',
  [CALCULATE_TYPE.COUPON]: 'paid-point-wrap',
  [CALCULATE_TYPE.CLAIM]: 'claim-wrap',
  [CALCULATE_TYPE.ETC]: 'cal-etc-wrap',
  [CALCULATE_TYPE.AFFILIATE]: 'affiliate-wrap',
  [CALCULATE_TYPE.BANA_POINT]: 'affiliate-wrap',
  [CALCULATE_TYPE.STAMP_COUPON]: 'affiliate-wrap',
} as const;

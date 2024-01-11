import { FC } from 'react';

// Const
import { CALCULATE_TYPE } from 'constants/calculate/common';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import StampCouponDetail from './StampCouponDetail';

const CalculateStampCoupon: FC = () => {
  const caculateType = CALCULATE_TYPE.STAMP_COUPON;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="board-date-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <StampCouponDetail />
      </div>
    </CalculateSection>
  );
};

export default CalculateStampCoupon;

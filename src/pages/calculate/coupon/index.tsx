import { FC } from 'react';

// Const
import { CALCULATE_TYPE } from 'constants/calculate/common';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import CouponDetail from './CouponDetail';

const CalculateCoupon: FC = () => {
  const caculateType = CALCULATE_TYPE.COUPON;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="fixed-paid-point-wrap coupon">
        <CalculateLastMonthTable caculateType={caculateType} />
        <CouponDetail />
      </div>
    </CalculateSection>
  );
};

export default CalculateCoupon;

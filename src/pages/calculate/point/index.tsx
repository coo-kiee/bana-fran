// Type
import { FC } from 'react';
import { CALCULATE_TYPE } from 'types/calculate/calculateType';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import PointDetail from './PointDetail';

const CalculatePoint: FC = () => {
  const caculateType = CALCULATE_TYPE.POINT;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="fixed-paid-point-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <PointDetail />
      </div>
    </CalculateSection>
  );
};

export default CalculatePoint;

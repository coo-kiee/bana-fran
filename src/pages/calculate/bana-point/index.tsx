import { FC } from 'react';

// Const
import { CALCULATE_TYPE } from 'constants/calculate/common';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import BanaPointDetail from './BanaPointDetail';

const CalculateBanaPoint: FC = () => {
  const caculateType = CALCULATE_TYPE.BANA_POINT;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="board-date-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <BanaPointDetail />
      </div>
    </CalculateSection>
  );
};

export default CalculateBanaPoint;

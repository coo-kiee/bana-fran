import { FC } from 'react';

// Const
import { CALCULATE_TYPE } from 'constants/calculate/common';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import EtcDetail from './EtcDetail';

const CalculateEtc: FC = () => {
  const caculateType = CALCULATE_TYPE.ETC;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="board-date-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <EtcDetail />
      </div>
    </CalculateSection>
  );
};

export default CalculateEtc;

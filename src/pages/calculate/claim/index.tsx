import { FC } from 'react';

// Const
import { CALCULATE_TYPE } from 'types/calculate/calculateType';
import { CLAIM_TAB_TITLE } from 'constants/calculate/claim';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import ClaimDetail from './ClaimDetail';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import Tab from '../../common/tab';

const CalculateClaim: FC = () => {
  const caculateType = CALCULATE_TYPE.CLAIM;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="board-date-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <div id="tab1" className="tab-content active">
          <Tab tabTitleObj={CLAIM_TAB_TITLE} render={(tabType) => <ClaimDetail tabType={tabType} />} />
        </div>
      </div>
    </CalculateSection>
  );
};

export default CalculateClaim;

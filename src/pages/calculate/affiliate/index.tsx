import { FC } from 'react';

// Const
import { AFFILIATE_TAB_TITLE } from 'constants/calculate/affiliate';
import { CALCULATE_TYPE } from 'constants/calculate/common';

// Component
import CalculateSection from 'pages/calculate/component/CalculateSection';
import CalculatePrecautions from 'pages/calculate/component/CalculatePrecautions';
import CalculateLastMonthTable from 'pages/calculate/component/CalculateLastMonthTable';
import Tab from '../../common/tab';
import AffiliateDetail from './AffiliateDetail';

const CalculateAffiliate: FC = () => {
  const caculateType = CALCULATE_TYPE.AFFILIATE;

  return (
    <CalculateSection caculateType={caculateType}>
      <CalculatePrecautions caculateType={caculateType} />
      <div className="board-date-wrap">
        <CalculateLastMonthTable caculateType={caculateType} />
        <div id="tab1" className="tab-content active">
          <Tab tabTitleObj={AFFILIATE_TAB_TITLE} render={(tabType) => <AffiliateDetail tabType={tabType} />} />
        </div>
      </div>
    </CalculateSection>
  );
};

export default CalculateAffiliate;

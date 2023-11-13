import { useState } from 'react';

// component
import PrizeEdit from './component/PrizeEdit';
import MonthRankOverall from './component/MonthRankOverall';
import MonthRankDetail from './component/MonthRankDetail';
import MembershipSummary from '../component/MembershipSummary';
import MembershipHeader from '../component/MembershipHeader';

// type
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

const MonthRankContainer = () => {
  const [popupRankReward, setPopupRankReward] = useState<boolean>(false); // 랭킹 설정 모달 열림 여부

  return (
    <>
      <section className="container min-width-1200">
        <MembershipHeader pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK} />
        <section className="contents-wrap membership_ranking">
          <MembershipSummary pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK}>
            <MonthRankOverall setPopupRankReward={setPopupRankReward} />
            <MonthRankDetail pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK} />
          </MembershipSummary>
        </section>
      </section>
      {popupRankReward && <PrizeEdit setPopupRankReward={setPopupRankReward} />}
    </>
  );
};

export default MonthRankContainer;

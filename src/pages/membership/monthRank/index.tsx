// component
import MonthRankOverall from './component/MonthRankOverall';
import MonthRankDetail from './component/MonthRankDetail';
import MembershipSummary from '../component/MembershipSummary';
import MembershipHeader from '../component/MembershipHeader';

// type
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

const MonthRankContainer = () => {
  return (
    <>
      <section className="container min-width-1200">
        <MembershipHeader pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK} />
        <section className="contents-wrap membership_ranking">
          <MembershipSummary pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK}>
            <MonthRankOverall />
            <MonthRankDetail pageType={MEMBERSHIP_PAGE_TYPE.MONTHRANK} />
          </MembershipSummary>
        </section>
      </section>
    </>
  );
};

export default MonthRankContainer;

// component
import ExtraOverall from './component/ExtraOverall';
import ExtraDetail from './component/ExtraDetail';
import MembershipSummary from '../component/MembershipSummary';
import MembershipHeader from '../component/MembershipHeader';

// type
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

const ExtraContainer = () => {
  return (
    <section className="container min-width-1600">
      <MembershipHeader currentTab={MEMBERSHIP_PAGE_TYPE.EXTRA} />
      <section className="contents-wrap membership_current">
        <MembershipSummary currentTab={MEMBERSHIP_PAGE_TYPE.EXTRA}>
          <ExtraOverall />
          <ExtraDetail />
        </MembershipSummary>
      </section>
    </section>
  );
};

export default ExtraContainer;

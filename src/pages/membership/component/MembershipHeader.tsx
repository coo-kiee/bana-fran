import { FC } from 'react';

// type, constants
import { MEMBERSHIP_HEADER_LIST } from 'constants/membership';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

const MembershipHeader: FC<{ pageType: MEMBERSHIP_PAGE_TYPE }> = ({ pageType }) => {
  return (
    <header>
      <div className="page-title membership">
        <p className="present">멤버십현황</p>
        <p className="spot">{MEMBERSHIP_HEADER_LIST[pageType].subtitle}</p>
      </div>
    </header>
  );
};

export default MembershipHeader;

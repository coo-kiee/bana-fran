import React, { FC } from 'react';
import { MEMBERSHIP_HEADER_LIST } from 'constants/membership';
import { MEMBERSHIP_PAGE_TYPE } from 'types/membership/membershipType';

interface MembershipHeaderProps {
  currentTab: MEMBERSHIP_PAGE_TYPE;
}
const MembershipHeader: FC<MembershipHeaderProps> = ({ currentTab }) => {
  return (
    <header>
      <div className="page-title membership">
        <p className="present">멤버십현황</p>
        <p className="spot">{MEMBERSHIP_HEADER_LIST[currentTab].subtitle}</p>
      </div>
    </header>
  );
};

export default MembershipHeader;

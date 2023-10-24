import { Dispatch, FC, SetStateAction } from 'react';

// Type
import { SearchDate } from 'constants/calculate/common';
import { ClaimTabType, CLAIM_TAB_TYPE } from 'types/calculate/calculateType';
import { ClaimDetailTotalInfo } from 'constants/calculate/claim';

// Util
import Utils from 'utils/Utils';

// API
import { useCalculateClaimDetailList } from 'service/calculateService';

// Hook
import useSumClaimDetailTotalInfo from 'hooks/calculate/claim/useSumClaimDetailTotalInfo';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import useUserInfo from 'hooks/user/useUser';
import useHandleDetailTotalInfo from 'hooks/calculate/common/useHandleDetailTotalInfo';
import usePageInfo from 'hooks/pagination/usePageInfo';

// Component
import TableList from 'pages/common/table/TableList';

interface IClaimDetailList {
  tabType: ClaimTabType;
  sortType: string;
  searchDate: SearchDate;
  setDetailTotalInfo: Dispatch<SetStateAction<ClaimDetailTotalInfo>>;
}
const ClaimDetailList: FC<IClaimDetailList> = ({ tabType, sortType, searchDate, setDetailTotalInfo }) => {
  const { user } = useUserInfo();

  const { checkCurrentPageData } = usePageInfo();

  const params = {
    f_code: user.fCode,
    from_date: searchDate.fromDate,
    to_date: searchDate.toDate,
    ...(tabType === CLAIM_TAB_TYPE.ALL ? { search_type: sortType } : undefined),
  };

  // Query
  const claimDetailListRes = useCalculateClaimDetailList({ staffNo: user.staffNo, params, tabType });

  useHandlePageDataCnt(claimDetailListRes);

  const claimDetailTotalInfo = useSumClaimDetailTotalInfo({ tabType, claimDetailListRes });
  useHandleDetailTotalInfo(claimDetailTotalInfo, setDetailTotalInfo);

  return (
    <TableList
      queryRes={claimDetailListRes}
      render={(datas) =>
        datas?.map((claimData, index) => (
          <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
            <td className="align-center">{claimData.send_date.replace(' ', '\n')}</td>
            <td className="align-center">{claimData.use_date.replace(' ', '\n')}</td>
            <td className="align-center">{claimData.use_flag}</td>
            <td className="align-center">{claimData.coupon_title}</td>
            <td className="align-right">{Utils.numberComma(claimData.coupon_amt)}</td>
            <td className="align-center">{claimData.expiration_date.replace(' ', '\n')}</td>
            <td className="align-center">{claimData.send_phone}</td>
            {tabType === CLAIM_TAB_TYPE.ALL && <td className="align-left">{claimData.claim_text}</td>}
            <td className="align-center">{claimData.send_f_name}</td>
            <td className="align-center">{claimData.use_f_name}</td>
            <td className="align-center">{claimData.use_phone}</td>
            <td className="align-right">{Utils.numberComma(claimData.coupon_charge)}</td>
            <td className="align-right">{Utils.numberComma(claimData.supply_amt)}</td>
            <td className="align-right">{Utils.numberComma(claimData.vat_amt)}</td>
            <td className="align-right">{Utils.numberComma(claimData.coupon_charge)}</td>
          </tr>
        ))
      }
    />
  );
};

export default ClaimDetailList;

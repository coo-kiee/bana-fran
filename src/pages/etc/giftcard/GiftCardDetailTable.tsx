import React, { FC } from 'react';
import { useLayoutEffect } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { GiftCardDetailType } from 'types/etc/etcType';
import { giftcardFilterOption } from 'constants/etc';

// hook
import useGiftcardOption from 'hooks/etc/useGiftcardOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface GiftCardDetailTableProps {
  etcGiftcardListKey: string[];
  searchDate: SearchDate;
  filterCondition: Record<keyof giftcardFilterOption, string>;
  setDetailTotalInfo: React.Dispatch<React.SetStateAction<GiftCardDetailType[]>>;
}
const GiftCardDetailTable: FC<GiftCardDetailTableProps> = ({
  etcGiftcardListKey,
  searchDate,
  filterCondition,
  setDetailTotalInfo,
}) => {
  const { user } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useGiftcardOption();
  const listData = ETC_SERVICE.useGiftCardList(etcGiftcardListKey, [
    user.fCode,
    searchDate.fromDate,
    searchDate.toDate,
  ]);

  useHandlePageDataCnt(listData, filterCondition, filterData);
  useLayoutEffect(() => {
    if (!listData?.data) return;

    setDetailTotalInfo(listData.data);
  }, [listData, setDetailTotalInfo]);

  return (
    <Table.TableList
      queryRes={listData}
      render={(datas) =>
        datas
          ?.filter((couponDetail) => filterData(filterCondition, couponDetail))
          .map(({ std_date, gubun, item_name, item_cnt, item_amt, rcp_type, account_amt }, index) => {
            const display = checkCurrentPageData(index) ? '' : 'none';

            return (
              <tr key={index} style={{ display }}>
                <td className="align-center">{std_date}</td>
                <td className={`align-center ${gubun.includes('임의') ? 'negative-value' : ''}`}>{gubun}</td>
                <td className="align-center">{item_name}</td>
                <td className="align-center">
                  {Utils.numberComma(item_cnt)}장 ({Utils.numberComma(item_amt)})
                </td>
                <td className="align-center">{rcp_type}</td>
                <td className={`align-center ${account_amt < 0 ? 'negative-value' : ''}`}>
                  {Utils.numberComma(account_amt)}
                </td>
              </tr>
            );
          })
      }
    />
  );
};

export default GiftCardDetailTable;

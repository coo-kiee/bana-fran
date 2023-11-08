import { FC } from 'react';
import Utils from 'utils/Utils';

// hook
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';
import useEventSearchText from 'hooks/event/useEventTextFilter';

// component
import TableList from 'pages/common/table/TableList';

// service
import EVENT_SERVICE from 'service/eventService';

// type, constants
import { EVENT_TAB_TYPE, EventTabType, eventCouponUsageType } from 'constants/event';
import { SearchDate } from 'constants/calculate/common';
import { EventCouponStatusListItemType, EventCouponUsageListItemType } from 'types/event/eventType';

interface EventDetailTableProps {
  tabType: EventTabType;
  filterCondition?: Record<eventCouponUsageType, string>;
  searchDate: SearchDate;
}

const EventDetailTable: FC<EventDetailTableProps> = ({ tabType, filterCondition, searchDate }) => {
  const { user } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useEventSearchText();
  const params = {
    f_code: user.fCode,
    from_date: tabType === EVENT_TAB_TYPE.COUPON_STATUS ? `${searchDate.fromDate}-01` : searchDate.fromDate,
    to_date: tabType === EVENT_TAB_TYPE.COUPON_STATUS ? `${searchDate.toDate}-01` : searchDate.toDate,
  };

  // Query
  const couponListRes = EVENT_SERVICE.useEventCouponList({ params, tabType });

  useHandlePageDataCnt(
    couponListRes,
    tabType === EVENT_TAB_TYPE.COUPON_USAGE ? filterCondition : undefined,
    tabType === EVENT_TAB_TYPE.COUPON_USAGE ? filterData : undefined,
  );

  return (
    <TableList
      queryRes={couponListRes}
      render={(datas) => {
        return tabType === EVENT_TAB_TYPE.COUPON_STATUS
          ? (datas as EventCouponStatusListItemType[])?.map(
              (
                {
                  insert_date,
                  title,
                  expiration_day,
                  insert_count,
                  not_print_cnt,
                  print_cnt,
                  coupon_use_count,
                  coupon_not_use_cnt,
                  end_coupon_not_use_cnt,
                  discount_charge,
                  use_coupon_charge,
                },
                idx,
              ) => (
                <tr key={idx} style={{ display: checkCurrentPageData(idx) ? '' : 'none' }}>
                  <td>{insert_date}</td>
                  <td>{title}</td>
                  <td>{expiration_day}일</td>
                  <td>{Utils.numberComma(insert_count)}개</td>
                  <td>{Utils.numberComma(not_print_cnt)}개</td>
                  <td>{Utils.numberComma(print_cnt)}개</td>
                  <td>{Utils.numberComma(coupon_use_count)}개</td>
                  <td>{Utils.numberComma(coupon_not_use_cnt)}개</td>
                  <td>{Utils.numberComma(end_coupon_not_use_cnt)}개</td>
                  <td>{print_cnt === 0 ? 0 : Math.ceil(coupon_use_count / print_cnt)}%</td>
                  <td>{Utils.numberComma(discount_charge)}원</td>
                  <td>
                    <strong>{Utils.numberComma(use_coupon_charge)}</strong>원
                  </td>
                </tr>
              ),
            )
          : (datas as EventCouponUsageListItemType[])
              ?.filter((detail) => filterData(filterCondition!, detail))
              .map(({ use_date, coupon_name, use_amt, print_date, coupon_code, expiration_date, phone }, idx) => (
                <tr key={idx} style={{ display: checkCurrentPageData(idx) ? '' : 'none' }}>
                  <td>{use_date}</td>
                  <td>{coupon_name}</td>
                  <td>{Utils.numberComma(use_amt)}원</td>
                  <td>{print_date}</td>
                  <td>{coupon_code}</td>
                  <td>{expiration_date}까지</td>
                  <td>{phone}</td>
                </tr>
              ));
      }}
    />
  );
};

export default EventDetailTable;

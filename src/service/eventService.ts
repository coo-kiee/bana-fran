import { useQuery } from 'react-query';
import { queryFn } from 'hooks/useQuery';

// type, constants
import {
  EventCouponStatusListItemType,
  EventCouponUsageListItemType,
  EventCouponListParams,
} from 'types/event/eventType';
import { EVENT_TAB_TYPE, EventTabType } from 'constants/event';

const useEventCouponList = ({ params, tabType }: { params: EventCouponListParams; tabType: EventTabType }) => {
  const queryKey = [...Object.values(params), tabType]; // [ params.f_code, params.from_date, params.to_date]
  const query =
    tabType === EVENT_TAB_TYPE.COUPON_STATUS ? '8D4F5EBA319A51168947B98AD1B25BB0' : 'CBBB51BFE0B069E5B1C42532E98D6793';

  const data = {
    ws: 'fprocess',
    query,
    params,
  };

  return useQuery<EventCouponStatusListItemType[] | EventCouponUsageListItemType[]>(
    queryKey,
    () => queryFn.getDataList(data),
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      retry: false,
      suspense: false,
      useErrorBoundary: true,
    },
  );
}; // web_fran_s_event_coupon_list, web_fran_s_event_coupon_use_list

export default {
  useEventCouponList,
};

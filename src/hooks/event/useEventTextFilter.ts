import { useState } from 'react';

// hook
import useOnChange from 'hooks/useOnChange';

// type, constants
import { EventCouponStatusListItemType, EventCouponUsageListItemType } from 'types/event/eventType';
import { EVENT_COUPON_USAGE_FILTER_TYPE, eventCouponUsageType } from 'constants/event';

// hook
import { useDebounce } from 'hooks/common/useDebounce';

const defaultFilterCondition = Object.entries(EVENT_COUPON_USAGE_FILTER_TYPE).reduce(
  (acc, [_, key]) => ({ ...acc, [key]: '' }),
  {} as Record<eventCouponUsageType, string>,
);

const useEventTextFilter = () => {
  const [filterCondition, setFilterCondition] = useState(defaultFilterCondition); // text filter
  const [debouncedFilterCondition, setDebouncedFilterCondition] = useState(defaultFilterCondition); // debounce
  useDebounce(() => setDebouncedFilterCondition(filterCondition), 300);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: EventCouponUsageListItemType | EventCouponStatusListItemType) =>
      Object.values(condition).every((item) => !item)
        ? true
        : (data as EventCouponUsageListItemType).coupon_name.includes(condition.coupon_name) &&
          (data as EventCouponUsageListItemType).coupon_code.includes(condition.coupon_code),
  );

  const handleFilterCondition = useOnChange(setFilterCondition);

  return { filterCondition, debouncedFilterCondition, handleFilterCondition, filterData };
};

export default useEventTextFilter;

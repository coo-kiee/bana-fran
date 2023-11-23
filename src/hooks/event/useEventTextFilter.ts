import { useEffect, useState } from 'react';

// hook
import useOnChange from 'hooks/useOnChange';

// type, constants
import { EventCouponStatusListItemType, EventCouponUsageListItemType } from 'types/event/eventType';
import { EVENT_COUPON_USAGE_FILTER_TYPE, eventCouponUsageType } from 'constants/event';

const defaultFilterCondition = Object.entries(EVENT_COUPON_USAGE_FILTER_TYPE).reduce(
  (acc, [_, key]) => ({ ...acc, [key]: '' }),
  {} as Record<eventCouponUsageType, string>,
);

const useEventTextFilter = () => {
  // text filter hook
  const [filterCondition, setFilterCondition] = useState(defaultFilterCondition);
  // debounced text filter hook
  const [debouncedFilterCondition, setDebouncedFilterCondition] = useState(defaultFilterCondition);

  const [filterData] = useState(
    () => (condition: typeof filterCondition, data: EventCouponUsageListItemType | EventCouponStatusListItemType) =>
      Object.values(condition).every((item) => !item)
        ? true
        : (data as EventCouponUsageListItemType).coupon_name.includes(condition.coupon_name) &&
          (data as EventCouponUsageListItemType).coupon_code.includes(condition.coupon_code),
  );

  const handleFilterCondition = useOnChange(setFilterCondition);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedFilterCondition(filterCondition), 300);

    return () => clearTimeout(timerId);
  }, [filterCondition]);

  return { filterCondition, debouncedFilterCondition, handleFilterCondition, filterData };
};

export default useEventTextFilter;

import { FC } from 'react';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import Select from 'pages/common/select';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Calander from 'pages/common/calander';
import DeliveryChargeDetailTable from './DeliveryChargeDetailTable';
import EtcDetailTableFallback from '../component/EtcDetailTableFallback';

// hook
import useDeliveryChargeOption from 'hooks/etc/useDeliveryChargeOption';
import useSearchDate from 'hooks/common/useSearchDate';

// constant
import { ETC_DELIVERY_CHARGE_FILTER_OPTION, ETC_DELIVERY_CHARGE_FILTER_TYPE } from 'constants/etc';

const DeliveryChargeDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate();
  const { filterCondition, handleFilterCondition } = useDeliveryChargeOption();

  return (
    <>
      <p className="title bullet">상세내역</p>
      <div className="search-wrap">
        <Calander
          fromDate={searchDate.fromDate}
          toDate={searchDate.toDate}
          render={({ fromDate, toDate }) => (
            <>
              <div className="select-wrap">
                <Select
                  name={ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE}
                  value={filterCondition[ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE]}
                  options={ETC_DELIVERY_CHARGE_FILTER_OPTION[ETC_DELIVERY_CHARGE_FILTER_TYPE.DELIVERY_PAY_TYPE]}
                  handleOnChange={handleFilterCondition}
                />
              </div>
              <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
        />
      </div>

      <PageInfoProvider fallbackComponent={() => <EtcDetailTableFallback tabType={tabType} />}>
        <DeliveryChargeDetailTable tabType={tabType} searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default DeliveryChargeDetail;

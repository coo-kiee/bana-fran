import { FC } from 'react';
import { subMonths } from 'date-fns';

// type
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// component
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import OrderDetailDetailTable from './OrderDetailDetailTable';
import OrderDetailExcelTable from './OrderDetailExcelTable';
import Select from 'pages/common/select';
import Calander from 'pages/common/calander';
import EtcDetailTableFallback from '../component/EtcDetailTableFallback';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import useOrderOption from 'hooks/etc/useOrderOption';

// type, constants
import { ETC_ORDER_FILTER_OPTION, ETC_ORDER_FILTER_TYPE } from 'constants/etc';

const OrderDetailDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    fromDate: subMonths(new Date(), 1),
    toDate: new Date(),
  });
  const { filterCondition, handleFilterCondition } = useOrderOption();

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
                  name={ETC_ORDER_FILTER_TYPE.STATE}
                  value={filterCondition[ETC_ORDER_FILTER_TYPE.STATE]}
                  options={ETC_ORDER_FILTER_OPTION[ETC_ORDER_FILTER_TYPE.STATE]}
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
        <OrderDetailDetailTable searchDate={searchDate} filterCondition={filterCondition} tabType={tabType} />
        <OrderDetailExcelTable searchDate={searchDate} filterCondition={filterCondition} />
      </PageInfoProvider>
    </>
  );
};

export default OrderDetailDetail;

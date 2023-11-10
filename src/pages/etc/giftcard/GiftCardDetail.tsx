import { FC } from 'react';
import { subMonths } from 'date-fns';

// component
import Calander from 'pages/common/calander';
import Select from 'pages/common/select';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import GiftCardDetailTable from './GiftCardDetailTable';

// hook
import useSearchDate from 'hooks/common/useSearchDate';
import useGiftcardOption from 'hooks/etc/useGiftcardOption';

// type, constants
import { ETC_TAB_TYPE } from 'types/etc/etcType';
import { ETC_GIFTCARD_FILTER_OPTION, ETC_GIFTCARD_FILTER_TYPE } from 'constants/etc';

const GiftCardDetail: FC<{ tabType: ETC_TAB_TYPE }> = ({ tabType }) => {
  const { searchDate, handleSearchDate } = useSearchDate({
    dateFormat: 'yyyy-MM',
    fromDate: subMonths(new Date(), 1), // 2022-10
    toDate: new Date(), // 2022-11
  });
  const { filterCondition, handleFilterCondition } = useGiftcardOption();

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
                  name={ETC_GIFTCARD_FILTER_TYPE.POINT}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.POINT]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.POINT]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.GIFTCARD_TYPE]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
                <Select
                  name={ETC_GIFTCARD_FILTER_TYPE.DEVICE}
                  value={filterCondition[ETC_GIFTCARD_FILTER_TYPE.DEVICE]}
                  options={ETC_GIFTCARD_FILTER_OPTION[ETC_GIFTCARD_FILTER_TYPE.DEVICE]}
                  handleOnChange={handleFilterCondition}
                />
                &nbsp;
              </div>
              <button type="button" className="btn-search" onClick={() => handleSearchDate({ fromDate, toDate })}>
                조회
              </button>
            </>
          )}
          dateFormat={'yyyy-MM'}
          showMonthYearPicker
        />
      </div>

      <PageInfoProvider>
        <GiftCardDetailTable filterCondition={filterCondition} searchDate={searchDate} tabType={tabType} />
      </PageInfoProvider>
    </>
  );
};

export default GiftCardDetail;

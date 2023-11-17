import { FC, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import Utils from 'utils/Utils';
import { etcOrderTotalSumFn } from 'utils/etc/sumEtcDetailTotalInfo';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { ETC_COL_THEAD_LIST, ETC_DETAIL_SUM_INFO, orderFilterOption } from 'constants/etc';
import { ETC_TAB_TYPE } from 'types/etc/etcType';

// hook
import useOrderOption from 'hooks/etc/useOrderOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';
import useModal from 'hooks/common/useModal';

// component
import Table from 'pages/common/table';
import Sticky from 'pages/common/sticky';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import TableTotalInfo from 'pages/common/table/TableTotalInfo';
import OrderDetailModal from './OrderDetailModal';

// service
import ETC_SERVICE from 'service/etcService';

interface OrderDetailDetailTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof orderFilterOption, string>;
  tabType: ETC_TAB_TYPE;
}
const OrderDetailDetailTable: FC<OrderDetailDetailTableProps> = ({ searchDate, filterCondition, tabType }) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const { openModal } = useModal();
  const { filterData } = useOrderOption();
  const { checkCurrentPageData } = usePageInfo();
  const thRef = useRef<HTMLTableRowElement>(null);
  const viewportTableRef = useRef<HTMLTableElement>(null);

  const { fromDate, toDate } = searchDate;
  const listData = ETC_SERVICE.useDetailList(
    ['etc_order_detail_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );
  useHandlePageDataCnt(listData, filterCondition, filterData);

  const openOrderDetailModal = (nOrderId: number) => {
    openModal({
      type: 'CUSTOM',
      component: <OrderDetailModal order_code={nOrderId} />,
    });
  };

  return (
    <>
      <TableTotalInfo
        fromDate={fromDate}
        toDate={toDate}
        queryRes={listData}
        initialDetailTotalInfo={ETC_DETAIL_SUM_INFO[tabType]}
        sumFn={etcOrderTotalSumFn}
      />

      <Sticky reference={thRef.current} contentsRef={viewportTableRef.current}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={viewportTableRef}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} trRef={thRef} />
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
          )}
        >
          <Table.TableList
            queryRes={listData}
            render={(datas) =>
              datas
                ?.filter((detail) => filterData(filterCondition, detail))
                .map(
                  (
                    {
                      nOrderID,
                      insert_date,
                      last_modify_date,
                      cancel_date,
                      staff_name,
                      last_modify_staff,
                      cancel_staff,
                      state_name,
                      order_count,
                      first_item,
                      supply_amt,
                      vat_amt,
                      amount,
                    },
                    index,
                  ) => (
                    <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                      <td className="align-center">{insert_date}</td>
                      <td className="align-center">{last_modify_date}</td>
                      <td className="align-center">{cancel_date}</td>
                      <td className="align-center">{staff_name}</td>
                      <td className="align-center">{last_modify_staff}</td>
                      <td className="align-center">{cancel_staff}</td>
                      <td className="align-center">{state_name}</td>
                      <td className="align-right">{Utils.numberComma(order_count)}</td>
                      <td className="align-left order-view" onClick={() => openOrderDetailModal(nOrderID)}>
                        {order_count > 1 ? `${first_item} 외 ${order_count - 1}건` : first_item}
                      </td>
                      <td className="align-right">{Utils.numberComma(supply_amt)}원</td>
                      <td className="align-right">{Utils.numberComma(vat_amt)}원</td>
                      <td className="align-right">{`${Utils.numberComma(amount)}원`}</td>
                    </tr>
                  ),
                )
            }
          />
        </ErrorBoundary>
      </Table>
    </>
  );
};

export default OrderDetailDetailTable;

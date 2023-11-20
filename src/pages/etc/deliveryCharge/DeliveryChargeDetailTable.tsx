import { useRef } from 'react';
import { useQueryErrorResetBoundary } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Utils from 'utils/Utils';
import { etcDeliveryChargeTotalSumFn } from 'utils/etc/sumEtcDetailTotalInfo';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { ETC_COL_THEAD_LIST, ETC_DETAIL_SUM_INFO, deliveryChargeFilterOption } from 'constants/etc';
import { DeliveryDetailListType, ETC_TAB_TYPE } from 'types/etc/etcType';

// hook
import useDeliveryChargeOption from 'hooks/etc/useDeliveryChargeOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';
import Pages from 'pages/common/pagination/Pages';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Sticky from 'pages/common/sticky';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import TableTotalInfo from 'pages/common/table/TableTotalInfo';

// service
import ETC_SERVICE from 'service/etcService';

interface DeliveryChargeDetailTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof deliveryChargeFilterOption, string>;
  tabType: ETC_TAB_TYPE;
}
const DeliveryChargeDetailTable = ({
  searchDate: { fromDate, toDate },
  filterCondition,
  tabType,
}: DeliveryChargeDetailTableProps) => {
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { reset } = useQueryErrorResetBoundary();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);

  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useDeliveryChargeOption();
  const listData = ETC_SERVICE.useEtcList<DeliveryDetailListType[]>(
    'YOCYKBCBC6MTUH9AXBM7',
    ['etc_delivery_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData, filterCondition, filterData);

  return (
    <>
      <TableTotalInfo
        fromDate={fromDate}
        toDate={toDate}
        queryRes={listData}
        initialDetailTotalInfo={ETC_DETAIL_SUM_INFO[tabType]}
        sumFn={etcDeliveryChargeTotalSumFn}
      >
        <div className="price-info">
          <p className="hyphen">
            <span>주문금액</span>
            <span className="colon" />
            배달비를 제외한 카드/현금/포인트/쿠폰 결제금액의 합계.
          </p>
          <p className="hyphen">
            <span>수수료 공급가</span>
            <span className="colon" />
            주문금액의 2% (부가세 별도.)
          </p>
        </div>
      </TableTotalInfo>
      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={ETC_COL_THEAD_LIST[tabType].colgroup} />
        <Table.TableHead thData={ETC_COL_THEAD_LIST[tabType].thead} />
      </Sticky>
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
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
                      dtRcp,
                      sItem,
                      total_charge,
                      nDeliveryCharge,
                      payment_type,
                      delivery_pay_type,
                      sPhone,
                      suply_fee,
                      suply_fee_tax,
                      total_fee,
                    },
                    index,
                  ) => (
                    <tr key={index} style={{ display: checkCurrentPageData(index) ? '' : 'none' }}>
                      <td className="align-center">{dtRcp}</td>
                      <td className="align-left">{sItem}</td>
                      <td className="align-right">{Utils.numberComma(total_charge)}</td>
                      <td className="align-right">{Utils.numberComma(nDeliveryCharge)}</td>
                      <td className="align-center">{payment_type}</td>
                      <td className="align-center">{delivery_pay_type}</td>
                      <td className="align-center">{Utils.phoneNumberEncryption(sPhone)}</td>
                      <td className="align-right">{Utils.numberComma(suply_fee)}</td>
                      <td className="align-right">{Utils.numberComma(suply_fee_tax)}</td>
                      <td className="align-right">
                        <strong>{Utils.numberComma(total_fee)}</strong>
                      </td>
                    </tr>
                  ),
                )
            }
          />
        </ErrorBoundary>
      </Table>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          sheetOption={{ origin: 'B3' }}
          colWidths={ETC_COL_THEAD_LIST[tabType].colgroup.map(({ width }) =>
            width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
          )}
          fileName={`${fromDate}~${toDate}_${fCodeName}_딜리버리수수료내역`}
          addRowColor={{ rowNums: [1, 2], colors: ['d3d3d3', 'd3d3d3'] }}
        />
        <Pages />
      </div>
    </>
  );
};

export default DeliveryChargeDetailTable;

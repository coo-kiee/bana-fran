import { FC, useRef } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { ETC_ORDER_EXCEL_COL_THEAD_LIST, orderFilterOption } from 'constants/etc';
import { OrderDetailListExcelTotalType } from 'types/etc/etcType';

// hook
import useOrderOption from 'hooks/etc/useOrderOption';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';
import ExcelButton from 'pages/common/excel/ExcelButton';
import Pages from 'pages/common/pagination/Pages';

interface OrderDetailExcelTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof orderFilterOption, string>;
}

const OrderDetailExcelTable: FC<OrderDetailExcelTableProps> = ({
  searchDate: { fromDate, toDate },
  filterCondition,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const {
    user: { fCode, fCodeName },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useOrderOption();
  const listData = ETC_SERVICE.useDetailListExcel(
    ['etc_order_detail_list_excel', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  return (
    <>
      <div className="result-function-wrap">
        <ExcelButton
          type={'table'}
          target={tableRef}
          tableRef={tableRef}
          colWidths={ETC_ORDER_EXCEL_COL_THEAD_LIST.colgroup.map(({ width }) =>
            width !== '*' ? { wpx: Number(width) } : { wpx: 400 },
          )}
          addRowColor={{ rowNums: [1], colors: ['d3d3d3'] }}
          fileName={`${fromDate}~${toDate}_${fCodeName}_발주내역`}
        />
        <Pages />
      </div>
      {/* 엑셀 데이터 테이블 */}
      <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef} style={{ display: 'none' }}>
        <Table.ColGroup colGroupAttributes={ETC_ORDER_EXCEL_COL_THEAD_LIST.colgroup} />
        <Table.TableHead thData={ETC_ORDER_EXCEL_COL_THEAD_LIST.thead} />
        <Table.TableList
          queryRes={listData}
          render={(datas) => {
            const data = datas?.reduce((acc, cur) => {
              if (Object.keys(acc).includes(String(cur.nOrderID)))
                acc[`${cur.nOrderID}`] = [...acc[cur.nOrderID], cur]; // nOrderID가 이미 존재 -> 추가
              else acc[`${cur.nOrderID}`] = [cur]; // nOrderID 존재 X -> 새로 추가
              return acc;
            }, {} as OrderDetailListExcelTotalType); // [1245: [{ ... }, { ... }, ...]]

            return Object.values(data!).map((el) => {
              return el
                .filter((detail) => filterData(filterCondition, detail))
                .map(
                  (
                    {
                      cancel_date,
                      cancel_staff,
                      delivery_volume,
                      delivery_unit,
                      fran_price,
                      insert_date,
                      last_modify_date,
                      last_modify_staff,
                      nEAPerPack,
                      order_count,
                      order_detail_cnt,
                      sGroup,
                      sItemShort,
                      staff_name,
                      state_name,
                      supply_amt,
                      total_amt,
                      vat_amt,
                    },
                    index,
                  ) => {
                    const display = checkCurrentPageData(index) ? '' : 'none';

                    return (
                      <tr key={index} style={{ display }}>
                        <>
                          {index === 0 ? (
                            <>
                              <td className="align-center" rowSpan={order_count}>
                                {insert_date}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {last_modify_date}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {cancel_date}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {staff_name}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {last_modify_staff}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {cancel_staff}
                              </td>
                              <td className="align-center" rowSpan={order_count}>
                                {state_name}
                              </td>
                              <td className="align-right" rowSpan={order_count}>
                                {Utils.numberComma(order_count)}
                              </td>
                            </>
                          ) : undefined}
                          <td className="align-left">
                            {sGroup}
                            <br />
                            {sItemShort} ({delivery_volume})<br />
                            배송단위/용량: 1{delivery_unit}/{nEAPerPack}
                          </td>
                          <td className="align-right">{Utils.numberComma(fran_price)}원</td>
                          <td className="align-right">{Utils.numberComma(order_detail_cnt)}개</td>
                          <td className="align-right">{Utils.numberComma(supply_amt)}원</td>
                          <td className="align-right">{Utils.numberComma(vat_amt)}원</td>
                          <td className="align-right">{Utils.numberComma(total_amt)}원</td>
                        </>
                      </tr>
                    );
                  },
                );
            });
          }}
        />
      </Table>
    </>
  );
};

export default OrderDetailExcelTable;

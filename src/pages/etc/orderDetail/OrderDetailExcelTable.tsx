import { FC } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { orderFilterOption } from 'constants/etc';
import { OrderDetailListExcelTotalType } from 'types/etc/etcType';

// hook
import useOrderOption from 'hooks/etc/useOrderOption';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface OrderDetailExcelTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof orderFilterOption, string>;
}

const OrderDetailExcelTable: FC<OrderDetailExcelTableProps> = ({
  searchDate: { fromDate, toDate },
  filterCondition,
}) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useOrderOption();
  const listData = ETC_SERVICE.useDetailListExcel(
    ['etc_order_detail_list_excel', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  return (
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
  );
};

export default OrderDetailExcelTable;

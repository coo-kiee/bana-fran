import { FC, useLayoutEffect } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { orderFilterOption } from 'constants/etc';
import { OrderDetailListType } from 'types/etc/etcType';

// hook
import useOrderOption from 'hooks/etc/useOrderOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface OrderDetailDetailTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof orderFilterOption, string>;
  setDetailTotalInfo: React.Dispatch<React.SetStateAction<OrderDetailListType[]>>;
  openOrderDetailModal: (nOrderId: number) => void;
}
const OrderDetailDetailTable: FC<OrderDetailDetailTableProps> = ({
  searchDate: { fromDate, toDate },
  filterCondition,
  setDetailTotalInfo,
  openOrderDetailModal,
}) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useOrderOption();
  const listData = ETC_SERVICE.useDetailList(
    ['etc_order_detail_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
    [fCode, fromDate, toDate],
  );

  useHandlePageDataCnt(listData, filterCondition, filterData);
  useLayoutEffect(() => {
    if (!listData?.data) return;

    setDetailTotalInfo(listData.data);
  }, [listData, setDetailTotalInfo]);

  return (
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
            ) => {
              const display = checkCurrentPageData(index) ? '' : 'none';

              return (
                <tr key={index} style={{ display }}>
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
              );
            },
          )
      }
    />
  );
};

export default OrderDetailDetailTable;

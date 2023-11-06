import { useLayoutEffect } from 'react';
import Utils from 'utils/Utils';

// type, constants
import { SearchDate } from 'constants/calculate/common';
import { deliveryChargeFilterOption } from 'constants/etc';
import { DeliveryDetailListType } from 'types/etc/etcType';

// hook
import useDeliveryChargeOption from 'hooks/etc/useDeliveryChargeOption';
import useHandlePageDataCnt from 'hooks/pagination/useHandlePageDataCnt';
import usePageInfo from 'hooks/pagination/usePageInfo';
import useUserInfo from 'hooks/user/useUser';

// component
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

interface DeliveryChargeDetailTableProps {
  searchDate: SearchDate;
  filterCondition: Record<keyof deliveryChargeFilterOption, string>;
  setDetailTotalInfo: React.Dispatch<React.SetStateAction<DeliveryDetailListType[]>>;
}
const DeliveryChargeDetailTable = ({
  searchDate: { fromDate, toDate },
  filterCondition,
  setDetailTotalInfo,
}: DeliveryChargeDetailTableProps) => {
  const {
    user: { fCode },
  } = useUserInfo();
  const { checkCurrentPageData } = usePageInfo();
  const { filterData } = useDeliveryChargeOption();
  const listData = ETC_SERVICE.useEtcList<DeliveryDetailListType[]>(
    'YOCYKBCBC6MTUH9AXBM7',
    ['etc_delivery_list', JSON.stringify({ fCode, from: fromDate, to: toDate })],
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
            ) => {
              const display = checkCurrentPageData(index) ? '' : 'none';

              return (
                <tr key={index} style={{ display }}>
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
              );
            },
          )
      }
    />
  );
};

export default DeliveryChargeDetailTable;

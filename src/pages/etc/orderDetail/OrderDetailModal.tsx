import { FC } from 'react';
import Utils from 'utils/Utils';

// component
import Table from 'pages/common/table';
import TableList from 'pages/common/table/TableList';

// hook
import useModal from 'hooks/common/useModal';

// service
import ETC_SERVICE from 'service/etcService';

// type, constants
import { ETC_ORDER_MODAL_COL_THEAD_LIST } from 'constants/etc';

const OrderDetailModal: FC<{ orderCode: number }> = ({ orderCode }) => {
  const { popModal } = useModal();
  const listData = ETC_SERVICE.useOrderDetailModal({ orderCode });

  return (
    <div className="alert-layer order-layer active" style={{ position: 'fixed' }}>
      <div className="msg-wrap">
        <p className="title">발주 품목 상세</p>
        <div style={{ overflowY: 'auto', maxHeight: 500, position: 'relative', marginTop: '30px' }}>
          <Table className="board-wrap" cellPadding="0" cellSpacing="0" style={{ marginTop: 0 }}>
            <Table.ColGroup colGroupAttributes={ETC_ORDER_MODAL_COL_THEAD_LIST.colgroup} />
            <Table.TableHead thData={ETC_ORDER_MODAL_COL_THEAD_LIST.thead} />
            <TableList
              queryRes={listData}
              render={(datas) =>
                datas?.map((el, idx) => (
                  <tr key={`etc_order_detail_item_${idx}`}>
                    {!el.nItem ? (
                      <>
                        <td className="result total etc-total" colSpan={5}>
                          <strong>합계</strong>
                        </td>
                        <td className="point result total etc-total">
                          <strong>{Utils.numberComma(el.total_amount)}</strong>
                        </td>
                        <td className="result total etc-total" />
                      </>
                    ) : (
                      <>
                        <td className="content">
                          <p>{el.sGroup}</p>
                          <strong>
                            {el.sItemShort} ({el.volume})
                          </strong>
                          <p>
                            배송단위/용량
                            <span className="colon" />1{el.sDeliveryUnit}/{el.nEAPerPack}개
                          </p>
                        </td>
                        <td>{Utils.numberComma(el.fran_price)}</td>
                        <td className="align-right">{el.fOrderCount}</td>
                        <td>{Utils.numberComma(el.suply_amount)}</td>
                        <td>{Utils.numberComma(el.tax_amount)}</td>
                        <td>
                          <strong>{Utils.numberComma(el.total_amount)}</strong>
                        </td>
                        <td>{el.sEtc}</td>
                      </>
                    )}
                  </tr>
                ))
              }
            />
          </Table>
        </div>
        <button className="btn-close order-close" onClick={() => popModal()} />
        <button className="cta-btn" onClick={() => popModal()}>
          확인
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;

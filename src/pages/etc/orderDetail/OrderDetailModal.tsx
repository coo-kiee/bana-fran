import React, { FC, Suspense, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import Utils from 'utils/Utils';

// hook
import useBodyScrollFix from 'hooks/useBodyScrollFix';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Sticky from 'pages/common/sticky';
import Table from 'pages/common/table';

// service
import ETC_SERVICE from 'service/etcService';

// type
import { OrderDetailModalItemType } from 'types/etc/etcType';
import { ETC_ORDER_MODAL_COL_THEAD_LIST } from 'constants/etc';

interface OrderDetailModalProps {
  showOrderDetail: { show: boolean; orderCode: number };
  closeOrderDetailModal: () => void;
}
const OrderDetailModal: FC<OrderDetailModalProps> = (props) => {
  const { closeOrderDetailModal } = props;
  const { reset } = useQueryErrorResetBoundary();

  useBodyScrollFix();

  /* sticky ref */
  const stickyRootRef = useRef<HTMLDivElement>(null); // sticky wrapper, viewport 역할 ref
  const stickyRef = useRef<HTMLTableRowElement>(null); // sticky 기준 ref
  const contentsRefRef = useRef<HTMLTableElement>(null); // 실제 data table ref (sticky 작동용)

  return (
    <div className="alert-layer order-layer active" style={{ position: 'fixed' }}>
      <div className="msg-wrap">
        <p className="title">발주 품목 상세</p>
        <div style={{ overflowY: 'auto', maxHeight: 500, position: 'relative', marginTop: '30px' }} ref={stickyRootRef}>
          <Sticky reference={stickyRef.current} root={stickyRootRef.current} contentsRef={contentsRefRef.current}>
            <Table.ColGroup colGroupAttributes={ETC_ORDER_MODAL_COL_THEAD_LIST.colgroup} />
            <Table.TableHead thData={ETC_ORDER_MODAL_COL_THEAD_LIST.thead} />
          </Sticky>
          <Table
            className="board-wrap"
            cellPadding="0"
            cellSpacing="0"
            style={{ marginTop: 0 }}
            tableRef={contentsRefRef}
          >
            <Table.ColGroup colGroupAttributes={ETC_ORDER_MODAL_COL_THEAD_LIST.colgroup} />
            <Table.TableHead thData={ETC_ORDER_MODAL_COL_THEAD_LIST.thead} trRef={stickyRef} />
            <Suspense
              fallback={
                <tbody>
                  <tr>
                    <td colSpan={7}>
                      <Loading />
                    </td>
                  </tr>
                </tbody>
              }
            >
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => (
                  <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable />
                )}
              >
                <EtcOrderDetailData {...props} />
              </ErrorBoundary>
            </Suspense>
          </Table>
        </div>
        <button className="btn-close order-close" onClick={closeOrderDetailModal}></button>
        <button className="cta-btn" onClick={closeOrderDetailModal}>
          확인
        </button>
      </div>
    </div>
  );
};

const EtcOrderDetailData: FC<OrderDetailModalProps> = ({ showOrderDetail: { orderCode } }) => {
  let orderDetailData: Array<OrderDetailModalItemType> = [];
  const { data, isSuccess } = ETC_SERVICE.useOrderDetailModal({ order_code: orderCode });
  if (isSuccess) {
    orderDetailData = [...data.filter(({ nItem }) => nItem), ...data.filter(({ nItem }) => !nItem)];
  }

  return (
    <tbody>
      {orderDetailData.map((el, idx) =>
        idx === orderDetailData.length - 1 ? (
          <tr key={`etc_order_detail_item_total_${idx}`}>
            <td className="result total etc-total" colSpan={5}>
              <strong>합계</strong>
            </td>
            <td className="point result total etc-total">
              <strong>{Utils.numberComma(el.total_amount)}</strong>
            </td>
            <td className="result total etc-total"></td>
          </tr>
        ) : (
          <EtcOrderDetailItem key={`etc_order_detail_item_${idx}`} {...el} />
        ),
      )}
    </tbody>
  );
};

const EtcOrderDetailItem: React.FC<OrderDetailModalItemType> = ({
  fOrderCount,
  fran_price,
  nEAPerPack,
  sDeliveryUnit,
  sEtc,
  sGroup,
  sItemShort,
  suply_amount,
  tax_amount,
  total_amount,
  volume,
}) => (
  <tr>
    <td className="content">
      <p>{sGroup}</p>
      <strong>
        {sItemShort} ({volume})
      </strong>
      <p>
        배송단위/용량<span className="colon"></span>1{sDeliveryUnit}/{nEAPerPack}개
      </p>
    </td>
    <td>{Utils.numberComma(fran_price)}</td>
    <td className="align-right">{fOrderCount}</td>
    <td>{Utils.numberComma(suply_amount)}</td>
    <td>{Utils.numberComma(tax_amount)}</td>
    <td>
      <strong>{Utils.numberComma(total_amount)}</strong>
    </td>
    <td>{sEtc}</td>
  </tr>
);

export default OrderDetailModal;

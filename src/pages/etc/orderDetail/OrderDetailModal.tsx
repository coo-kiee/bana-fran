import { FC, Suspense, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';
import Utils from 'utils/Utils';

// component
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import Sticky from 'pages/common/sticky';
import Table from 'pages/common/table';

// hook
import useModal from 'hooks/common/useModal';
import useCallbackRef from 'hooks/common/useCallbackRef';

// service
import ETC_SERVICE from 'service/etcService';

// type, constants
import { OrderDetailModalItemType } from 'types/etc/etcType';
import { ETC_ORDER_MODAL_COL_THEAD_LIST } from 'constants/etc';

const OrderDetailModal: FC<{ order_code: number }> = (props) => {
  const { reset } = useQueryErrorResetBoundary();
  const { popModal } = useModal();

  const stickyRootRef = useRef<HTMLDivElement>(null); // sticky wrapper, viewport 역할 ref
  const stickyRef = useRef<HTMLTableRowElement>(null); // sticky 기준 ref
  // const contentsRefRef = useRef<HTMLTableElement>(null); // 안잡힘
  const { element: contentsRef, ref: contentsRefRef } = useCallbackRef<HTMLTableElement>(null); // 실제 data table ref (sticky 작동용)

  return (
    <div className="alert-layer order-layer active" style={{ position: 'fixed' }}>
      <div className="msg-wrap">
        <p className="title">발주 품목 상세</p>
        <div style={{ overflowY: 'auto', maxHeight: 500, position: 'relative', marginTop: '30px' }} ref={stickyRootRef}>
          <Sticky reference={stickyRef.current} root={stickyRootRef.current} contentsRef={contentsRef}>
            <Table.ColGroup colGroupAttributes={ETC_ORDER_MODAL_COL_THEAD_LIST.colgroup} />
            <Table.TableHead thData={ETC_ORDER_MODAL_COL_THEAD_LIST.thead} />
          </Sticky>
          <table className="board-wrap" cellPadding="0" cellSpacing="0" style={{ marginTop: 0 }} ref={contentsRefRef}>
            <Table.ColGroup colGroupAttributes={ETC_ORDER_MODAL_COL_THEAD_LIST.colgroup} />
            <Table.TableHead thData={ETC_ORDER_MODAL_COL_THEAD_LIST.thead} trRef={stickyRef} />
            <Suspense
              fallback={
                <tbody>
                  <Loading isTable />
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
          </table>
        </div>
        <button className="btn-close order-close" onClick={() => popModal()} />
        <button className="cta-btn" onClick={() => popModal()}>
          확인
        </button>
      </div>
    </div>
  );
};

const EtcOrderDetailData: FC<{ order_code: number }> = ({ order_code }) => {
  let orderDetailData: Array<OrderDetailModalItemType> = [];
  const { data, isSuccess } = ETC_SERVICE.useOrderDetailModal({ order_code });
  if (isSuccess) {
    orderDetailData = data;
  }

  return (
    <tbody>
      {orderDetailData.map((el, idx) => (
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
                  배송단위/용량<span className="colon"></span>1{el.sDeliveryUnit}/{el.nEAPerPack}개
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
      ))}
    </tbody>
  );
};

export default OrderDetailModal;

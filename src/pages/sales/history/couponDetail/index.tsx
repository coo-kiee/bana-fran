import { Suspense } from 'react';
import { useRecoilState } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';
import styled from 'styled-components';

// global state
import { couponModalState } from 'state';

// Types
import { CouponUsageDetailContainerProps } from 'types/sales/salesType';

// Components
import Portal from 'pages/common/portal';
import Loading from 'pages/common/loading';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
import CouponUsage from './CouponUsage';

const CouponDetail = () => {
  const [couponModal, setCouponModal] = useRecoilState(couponModalState);

  const handleClose = () => {
    setCouponModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <Portal containerId="root">
      <ModalContainer posX={couponModal.posX} posY={couponModal.posY} clientY={couponModal.clientY}>
        <Table className="board-wrap" cellPadding={0} cellSpacing={0}>
          <colgroup>
            <col width="auto" />
            <col width="35%" />
          </colgroup>
          <thead>
            <tr>
              <th colSpan={2}>사용 쿠폰 상세</th>
            </tr>
          </thead>
          <tbody>
            <ErrorBoundary
              fallbackRender={({ resetErrorBoundary }) => (
                <SuspenseErrorPage isTable resetErrorBoundary={resetErrorBoundary} />
              )}
              onError={(e) => console.log('error on History CouponDetail: ', e)}
            >
              <Suspense fallback={<Loading width={16} height={16} marginTop={16} isTable />}>
                <CouponUsage />
              </Suspense>
            </ErrorBoundary>
          </tbody>
          <tfoot>
            <tr>
              <td className="button-cell" colSpan={2}>
                <button type="button" onClick={handleClose}>
                  확인
                </button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </ModalContainer>
    </Portal>
  );
};

export default CouponDetail;

const ModalContainer = styled.div<CouponUsageDetailContainerProps>`
  position: absolute;
  top: ${({ posY, clientY }) => (clientY > 650 ? posY - 230 : posY)}px;
  left: ${({ posX }) => posX}px;
  transform: translate(-100%, 20px);
  box-shadow: 1.2px 1.2px 3px 1px #d3d3d3;
  border-radius: 20px;
  overflow: hidden;
`;

const Table = styled.table`
  min-width: 360px;
  margin: 0 auto;
  border-radius: 0;
  th {
    background-color: #6c6c97;
    font-size: 18px;
  }
  td {
    padding: 10px 0;
    height: 37px;
    &.button-cell {
      padding: 7px 0 !important;
      button {
        background-color: #6c6c97;
        padding: 8px 28px;
        border-radius: 6px;
        color: #fff;
        font-size: 16px;
        &:hover {
          background-color: rgba(129, 129, 192, 0.8);
        }
      }
    }
    &.no-data {
      padding: 3px 0;
    }
  }
`;

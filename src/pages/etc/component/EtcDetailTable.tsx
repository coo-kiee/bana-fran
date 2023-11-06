import { ColHTMLAttributes, ThHTMLAttributes, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

// type, constants
import { IExcelDownload } from 'utils/excelDownload';

// component
import Table from 'pages/common/table';
import ExcelButton from 'pages/common/excel/ExcelButton';
import PageInfoProvider from 'pages/common/pagination/PageInfoProvider';
import Sticky from 'pages/common/sticky';
import Pages from 'pages/common/pagination/Pages';
import SuspenseErrorPage from 'pages/common/suspenseErrorPage';
interface EtcDetailTableProps {
  colgroup: ColHTMLAttributes<HTMLTableColElement>[];
  thead: (ThHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode })[][];
  children: React.ReactNode;
  excelOption?: Omit<IExcelDownload, 'type' | 'target'>;
}

const EtcDetailTable = ({ colgroup, thead, children, excelOption }: EtcDetailTableProps) => {
  const { reset } = useQueryErrorResetBoundary();
  const tableRef = useRef<HTMLTableElement>(null);
  const thRef = useRef<HTMLTableRowElement>(null);

  return (
    <>
      <Sticky reference={thRef.current} contentsRef={tableRef.current}>
        <Table.ColGroup colGroupAttributes={colgroup} />
        <Table.TableHead thData={thead} />
      </Sticky>
      <PageInfoProvider>
        <Table className="board-wrap" cellPadding="0" cellSpacing="0" tableRef={tableRef}>
          <Table.ColGroup colGroupAttributes={colgroup} />
          <Table.TableHead thData={thead} trRef={thRef} />
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ resetErrorBoundary }) => (
              <SuspenseErrorPage resetErrorBoundary={resetErrorBoundary} isTable={true} />
            )}
          >
            {children}
          </ErrorBoundary>
        </Table>
        <div className="result-function-wrap">
          <ExcelButton
            type={'table'}
            target={tableRef}
            tableRef={tableRef}
            sheetOption={{ origin: 'B3' }}
            colWidths={colgroup.map(({ width }) => (width !== '*' ? { wpx: Number(width) } : { wpx: 400 }))}
            {...excelOption}
          />
          <Pages />
        </div>
      </PageInfoProvider>
    </>
  );
};

export default EtcDetailTable;

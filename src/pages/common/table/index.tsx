import { FC, PropsWithChildren, RefObject, TableHTMLAttributes, useContext, useLayoutEffect } from 'react';
import { PageInfoContext } from '../pagination/PageInfoProvider';

// Component
import ColGroup from './ColGroup';
import TableHead from './TableHead';

interface ITable extends TableHTMLAttributes<HTMLTableElement>, PropsWithChildren {
  tableRef?: RefObject<HTMLTableElement>;
}

interface ITableComposition {
  ColGroup: typeof ColGroup;
  TableHead: typeof TableHead;
}

const Table: FC<ITable> & ITableComposition = ({ tableRef, children, ...tableAttributes }) => {
  const pageInfo = useContext(PageInfoContext);

  useLayoutEffect(() => {
    if (!tableRef?.current) return;

    window.scrollTo({ top: tableRef.current.offsetTop || 0, behavior: 'smooth' });
  }, [pageInfo.currentPage, tableRef]);

  return (
    <table ref={tableRef} {...tableAttributes}>
      {children}
    </table>
  );
};

export default Table;

Table.ColGroup = ColGroup;
Table.TableHead = TableHead;

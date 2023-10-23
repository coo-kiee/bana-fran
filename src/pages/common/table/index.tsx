import { FC, PropsWithChildren, RefObject, TableHTMLAttributes } from 'react';

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
  return (
    <table ref={tableRef} {...tableAttributes}>
      {children}
    </table>
  );
};

export default Table;

Table.ColGroup = ColGroup;
Table.TableHead = TableHead;

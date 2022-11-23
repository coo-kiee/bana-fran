import { useRef, forwardRef } from 'react';
// Types
import { SalesTable } from 'types/sales/salesType';
// Components
import Loading from 'pages/common/loading';
import Sticky from 'pages/common/sticky';
import TableColGroup from 'pages/sales/history/table/TableColGroup';
import TableHead from 'pages/sales/history/table/TableHead';
import TableBody from './TableBody';

const SalesHistoryTable = forwardRef(
	({ data, isLoading, rowPerPage, currentPage }: SalesTable, forwardRef: React.LegacyRef<HTMLTableElement>) => {
		/* sticky 기준 ref */
		const trRef = useRef<HTMLTableRowElement>(null);

		return (
			<>
				<Sticky reference={trRef.current}>
					<TableColGroup />
					<TableHead />
				</Sticky>

				<table className='board-wrap board-top' cellPadding='0' cellSpacing='0' ref={forwardRef}>
					<TableColGroup />
					<TableHead ref={trRef} />
					<tbody>
						{
							isLoading ? 
							<Loading width={100} height={100} marginTop={15} isTable={true} /> : 
							<TableBody data={data} rowPerPage={rowPerPage} currentPage={currentPage} />
						}
					</tbody>
				</table>
			</>
		);
	}
);

export default SalesHistoryTable;

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isSaturday, isSunday, addDays, isFuture } from 'date-fns';

// Utils
import Utils from 'utils/Utils';

const CalendarBody = ({ currentDate, onDateClick, salesData }: any) => {
	const startMonth = startOfMonth(currentDate); // 달의 시작일
	const endMonth = endOfMonth(startMonth); // 달의 말일
	const startWeek = startOfWeek(startMonth); // 주의 시작일
	const endWeek = endOfWeek(endMonth); // 주의
	const today = new Date();

	const rows = [];
	let days = [];
	let day = startWeek;
	let formattedDate = '';
	
	while (day <= endWeek) {
		for (let i = 0; i < 7; i++) {
			formattedDate = format(day, 'd');
			const cloneDay = day;
			const targetData = salesData?.filter((franData: any) => {
				return new Date(franData.std_date).getDate() === Number(format(cloneDay, 'd'));
			});

			days.push(
				<div
					className={`calendar-body-col day
                        ${isSaturday(day) ? 'sat' : ''}
                        ${isSunday(day) ? 'sun' : ''}
                        ${!isSameMonth(day, startMonth) ? 'disabled' : ''}
                        ${isSameDay(day, today) ? 'today' : ''}
                    `}
					key={Number(day)}
					// onClick={() => onDateClick(parse('yyyy-MM-dd', 'dd/MM/yyyy', cloneDay))}
				>
					<span className={'date-num'}>{formattedDate}</span>
					{
                        format(currentDate, 'M') === format(day, 'M') && !isFuture(day) ? 
                        <span className='date-sales'>
							{targetData && targetData[0].sales_charge !== 0 ? `${Utils.roundingDown10000(targetData[0]?.sales_charge)}만` : ''}
						</span> : null
                    }
				</div>
			);
			day = addDays(day, 1);
		}
		rows.push(
			<div className='calendar-body-row week' key={Number(day)}>
				{days}
			</div>
		);
		days = [];
	}
	return <div className='calendar-body'>{rows}</div>;
};

export default CalendarBody;
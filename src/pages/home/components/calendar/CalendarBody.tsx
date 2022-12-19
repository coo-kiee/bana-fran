import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isSaturday, isSunday, addDays, isFuture } from 'date-fns';
// Types
import { CalendarBodyProps } from 'types/home/homeType';
// Utils
import Utils from 'utils/Utils';

const CalendarBody = ({ selectedDate, data }: CalendarBodyProps) => {
	const startMonth = startOfMonth(selectedDate); 	// 달의 시작일
	const endMonth = endOfMonth(startMonth); 		// 달의 말일
	const startWeek = startOfWeek(startMonth); 		// 주의 시작일
	const endWeek = endOfWeek(endMonth); 			// 주의
	const today = new Date();

	// 초기값 설정
	const rows = [];
	let days = [];
	let day = startWeek;
	let formattedDate = '';
	
	while (day <= endWeek) {
		for (let i = 0; i < 7; i++) {
			formattedDate = format(day, 'd'); // 날짜 표시 형식 변환
			const dayCopy = day;
			const targetData = data?.filter((franData) => {
				return new Date(franData.std_date).getDate() === Number(format(dayCopy, 'd'));
			});

			days.push(
				<div
					className={`calendar-body-col day
                        ${isSaturday(day) ? 'sat' : ''}
                        ${isSunday(day) ? 'sun' : ''}
                        ${!isSameMonth(day, startMonth) ? 'disabled' : ''}
                        ${isSameDay(day, today) ? 'today' : ''}
                    `}
					key={Number(day)+'day'}
				>
					<span className={'date-num'}>{formattedDate}</span>
					{
                        format(selectedDate, 'M') === format(day, 'M') && !isFuture(day) ? // 같은 월이면서 미래가 아닐 때
                        <span className='date-sales'>
							{targetData && targetData[0].sales_charge !== 0 ? `${Utils.roundingDown10000(targetData[0]?.sales_charge)}만` : ''}
						</span> : null // 매출이 0원인 날은 표시 x
                    }
				</div>
			);
			day = addDays(day, 1);
		}
		rows.push(
			<div className='calendar-body-row week' key={Number(day)+'week'}>
				{days}
			</div>
		);
		days = []; // 1주 다 채우면 days 초기화
	}
	return <div className='calendar-body'>{rows}</div>;
};

export default CalendarBody;
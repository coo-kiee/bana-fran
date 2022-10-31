interface BoardProps {
	boardClass: string;     // className
	title: string;          // 제목
    suffix?: string;        // 총 매출, 누적
    
	children: React.ReactNode;
}

const Board = ({ boardClass, title, children, suffix }: BoardProps) => {
	return (
		<div className={`board ${boardClass}`}>
			<div className='title-wrap'>
				<p className='title'>
                    {title}{suffix ? <span>&nbsp;({suffix})</span> : null}
                </p>
				<p className='btn-more'>
					<a href=''>more</a>
				</p>
			</div>
			{children}
		</div>
	);
};

export default Board;

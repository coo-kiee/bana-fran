import { Link } from 'react-router-dom';

interface BoardProps {
	boardClass: string;     // className
	title: string;		    // 제목
	url: string;			// 게시판 url
    suffix?: string;        // 총 매출, 누적
    
	children: React.ReactNode;
}

const Board = ({ boardClass, title, children, url, suffix }: BoardProps) => {
	return (
		<div className={`board ${boardClass}`}>
			<div className='title-wrap'>
				<p className='title'>
                    {title}{suffix ? <span>&nbsp;({suffix})</span> : null}
                </p>
				<p className='btn-more'>
					<Link to={url}>more</Link>
				</p>
			</div>
			{children}
		</div>
	);
};

export default Board;

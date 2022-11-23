import { Link } from 'react-router-dom';
// Types
import { BoardProps } from 'types/home/homeType';

const Board = ({ boardClass, title, children, url, suffix, showLink = false }: BoardProps) => {
	return (
		<div className={`board ${boardClass}`}>
			<div className='title-wrap'>
				<p className='title'>
                    {title}{suffix ? <span>&nbsp;({suffix})</span> : null}
                </p>
				{ showLink ? null : <p className='btn-more'><Link to={url}>more</Link></p> }
			</div>
			{children}
		</div>
	);
};

export default Board;

import Loading from 'pages/common/loading';

interface DataLoaderProps {
	children: React.ReactNode;
	isFetching?: boolean;
	isData?: boolean;
	loader?: JSX.Element;
	noData?: JSX.Element | null;
}

// suspense 적용이 어려운 경우 fetching/noData 처리
const DataLoader = ({
	children,
	isData = true,
	isFetching = false,
	loader = <Loading width={100} height={100} marginTop={0} />,
	noData = null,
}: DataLoaderProps) => {
	return <>{isFetching ? loader : isData ? children : noData}</>;
};

export default DataLoader;

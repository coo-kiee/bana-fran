const TableColGroup = () => {
	const tableWidth = Array.from({ length: 18 }, () => '5.556%'); // origin width = '122'

	return (
		<colgroup>
			{tableWidth.map((width, idx) => <col width={width} key={width + idx} />)}
		</colgroup>
	);
};

export default TableColGroup;

import Utils from "utils/Utils";

const TableColGroup = ({ tableColGroup }: { tableColGroup: string[]}) => {
	const tableWidthSum = tableColGroup.reduce((acc, cur) => acc + Number(cur), 0);

	return (
		<colgroup>
			{tableColGroup.map((width, idx) => <col width={Utils.getPercent(Number(width), tableWidthSum)} key={`${width} ${idx}`} />)}
		</colgroup>
	);
};

export default TableColGroup;

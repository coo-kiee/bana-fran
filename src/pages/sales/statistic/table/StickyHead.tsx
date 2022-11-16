import StickyTableHead from "pages/common/tableStickyHead/StickyTableHead";
import TableColGroup from "./TableColGroup";
import TableHead from "./TableHead";

const StickyHead = () => {
		
	return (
		<StickyTableHead>
			<TableColGroup />
			<TableHead />
		</StickyTableHead>
	);
};

export default StickyHead;

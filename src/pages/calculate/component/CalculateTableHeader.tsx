interface CalculateTableHeaderProps<Width, ThInfo, TdInfo> {
    width: Width | string[],
    thInfo: ThInfo | { className: string, colSpan: number, rowSpan: number, text: string }[],
    tdInfo?: TdInfo | string[],
    stickyRef?: React.RefObject<HTMLTableRowElement>,
};
const CalculateTableHeader = <Width, ThInfo, TdInfo>(props:CalculateTableHeaderProps<Width, ThInfo, TdInfo>) => {
    
    const {width, thInfo, tdInfo} = props as HeaderType;

    return (
        <>
            {/* Column Width */}
            <colgroup>{width.map((wd, index) => <col width={wd} key={index} />)}</colgroup>
            {/* Table Header  */}
            <thead>
                <tr ref={props.stickyRef}>{thInfo.map((th, index) => <th key={index} className={th.className} colSpan={th.colSpan} rowSpan={th.rowSpan} >{th.text}</th>)}</tr>
                {tdInfo && <tr>{tdInfo.map((text, index) => <th key={index} className="price-area" >{text}</th>)}</tr>}
            </thead>
        </>
    );
}

export default CalculateTableHeader;



// Component Type
type HeaderType = {
    width: string[],
    thInfo: { className?: string, colSpan?: number, rowSpan?: number, text: string }[],
    tdInfo?: string[],
};
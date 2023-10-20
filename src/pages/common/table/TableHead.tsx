import { FC, HTMLAttributes, PropsWithChildren, ThHTMLAttributes } from "react";

interface ITHead extends HTMLAttributes<HTMLTableSectionElement> {
    thData: (ThHTMLAttributes<HTMLTableCellElement> & PropsWithChildren)[][]
}

const TableHead: FC<ITHead> = ({ thData, ...theadAttributes }) => {
    return (
        <thead {...theadAttributes}>
            {
                thData.map((thInfos, thDataIdx) =>
                    <tr key={thDataIdx}>{
                        thInfos.map(({ children, ...trAttributes }, index) =>
                            <th key={index} {...trAttributes}>{children}</th>
                        )}
                    </tr>
                )
            }
        </thead>
    );
}

export default TableHead;
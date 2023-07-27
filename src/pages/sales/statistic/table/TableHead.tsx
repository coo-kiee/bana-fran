import { forwardRef } from "react";

const TableHead = forwardRef((_, forwardRef: React.LegacyRef<HTMLTableRowElement>) => {
    return (
        <thead>
            <tr ref={forwardRef}>
                <th rowSpan={2}>일시</th>
                <th rowSpan={2} className='bg-a'>
                    총매출<br />(부가세 포함)
                </th>
                <th rowSpan={2} className='bg-b'>
                    앱 주문<br />배달매출<br />(배달비 포함)
                </th>
                <th rowSpan={2} className='bg_d'>
                    배달비<br />(앱 주문)
                </th>
                <th rowSpan={2} className='bg-e bg-e-right'>
                    유상매출<br />합계<br />(부가세 포함)
                </th>
                <th colSpan={9} className='bg-e bg-e-bottom'>
                    유상 매출 상세 (부가세 포함)
                </th>
                <th rowSpan={2} className='bg-right'>
                    무상서비스 비용 합계
                </th>
                <th colSpan={3} className='bg-bottom'>
                    무상서비스 비용 상세
                </th>
            </tr>
            <tr>
                <th className='bg-e height-63'>
                    카드매출<br />(키오스크/POS)
                </th>
                <th className='bg-e height-63'>
                    카드매출<br />(어플)
                </th>
                <th className='bg-e height-63'>
                    간편결제<br />(키오스크/POS)
                </th>
                <th className='bg-e height-63'>
                    간편결제<br />(어플)
                </th>
                <th className='bg-e height-63'>
                    현금매출<br />(배달/POS)
                </th>
                <th className='bg-e height-63'>
                    쿠팡/배민<br />(주문금액)
                </th>
                <th className='bg-e height-63'>
                    쿠팡/배민<br />(배달비)
                </th>
                <th className='bg-e height-63'>
                    유상포인트<br />매출
                </th>
                <th className='bg-e height-63'>
                    본사 쿠폰 매출<br />(보전)
                </th>
                <th>
                    바나포인트<br />사용금액
                </th>
                <th>
                    가맹점 쿠폰<br />사용금액
                </th>
                <th>
                    본사 쿠폰 매출<br />(미보전)
                </th>
            </tr>
        </thead>
    )
})

export default TableHead
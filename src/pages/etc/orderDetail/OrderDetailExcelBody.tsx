import NoData from "pages/common/noData";
import { ReactNode, useMemo } from "react";
import { ETC_ORDER_SEARCH_STATE_TYPE, OrderDetailListExcelTotalType, OrderDetailListExcelType } from "types/etc/etcType";
import Utils from "utils/Utils";

type Props = {
    data: OrderDetailListExcelType[],
    searchOptionValue: string | number,
}

const OrderDetailExcelBody = ({ data, searchOptionValue }: Props) => { 
    const renderExcelTableList: ReactNode[] | undefined = useMemo(() => {
        let filteredData = data;
        if (searchOptionValue !== ETC_ORDER_SEARCH_STATE_TYPE.STATE_ALL) {
            filteredData = filteredData?.filter((origData: any) => origData.state === Number(searchOptionValue))
        }; // 옵션 필터링

        // 필터링 한 데이터 가공
        let tempData = filteredData?.reduce((acc, cur) => { 
            // 만약 nOrderID가 이미 존재 -> 추가
            if(Object.keys(acc).includes(String(cur.nOrderID))) acc[`${cur.nOrderID}`] = [ ...acc[cur.nOrderID], cur];
            // 만약 nOrderID 존재 X -> 새로 추가
            else acc[`${cur.nOrderID}`] = [ cur ]; 
            return acc; 
        }, {} as OrderDetailListExcelTotalType);   

        const tableList: ReactNode[] | undefined  = Object.values(tempData as any).reduce((arr: ReactNode[], rowDataList, index: number) => { 
            (rowDataList as OrderDetailListExcelType[]).forEach((rowData, idx) => {
                const { 
                    cancel_date, cancel_staff, delivery_volume, delivery_unit, fran_price, insert_date, last_modify_date, last_modify_staff,
                    nEAPerPack, order_count, order_detail_cnt, sGroup, sItemShort, staff_name, state_name, supply_amt, total_amt, vat_amt  // nOrderID, state
                } = rowData; 
                arr.push (
                    <>
                        {idx === 0 ?
                            <>
                                <td className='align-center' rowSpan={order_count}>{insert_date}</td>
                                <td className='align-center' rowSpan={order_count}>{last_modify_date}</td>
                                <td className='align-center' rowSpan={order_count}>{cancel_date}</td> 
                                <td className='align-center' rowSpan={order_count}>{staff_name}</td>
                                <td className='align-center' rowSpan={order_count}>{last_modify_staff}</td>
                                <td className='align-center' rowSpan={order_count}>{cancel_staff}</td> 
                                <td className='align-center' rowSpan={order_count}>{state_name}</td> 
                                <td className='align-right' rowSpan={order_count}>{Utils.numberComma(order_count)}</td>
                            </> 
                            :
                            undefined}
                        <td className='align-left'>{sGroup}<br />{sItemShort} ({delivery_volume})<br />배송단위/용량:  1{delivery_unit}/{nEAPerPack}</td>
                        <td className='align-right'>{Utils.numberComma(fran_price)}원</td>
                        <td className='align-right'>{Utils.numberComma(order_detail_cnt)}개</td>
                        <td className='align-right'>{Utils.numberComma(supply_amt)}원</td>
                        <td className='align-right'>{Utils.numberComma(vat_amt)}원</td>
                        <td className='align-right'>{Utils.numberComma(total_amt)}원</td>
                    </>
                )
            })

            return arr;
        }, [] as ReactNode[]) 
        return tableList;
    }, [data, searchOptionValue]); 

    return ( 
        <tbody>
            {(!!renderExcelTableList && renderExcelTableList.length > 0) && renderExcelTableList.map((item: any, index: number) => <tr key={index}>{item}</tr>)}
            {!!renderExcelTableList && renderExcelTableList?.length === 0 && <NoData isTable={true} />}
        </tbody> 
    )
}

export default OrderDetailExcelBody
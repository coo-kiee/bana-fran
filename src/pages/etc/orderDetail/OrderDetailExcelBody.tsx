import Utils from "utils/Utils";

type Props = {
    data: any;
}

const OrderDetailExcelBody = ({data}: Props) => {

/* DUMMY COMPONENT 불 필요시 삭제 예정!!!!! */

// [
//     { nOrderID: [{  }, {  }] },
//     { nOrderID: [{  }, {  }] },
//     { nOrderID: [{  }, {  }] }
//   ]

//     const tableList = filteredData?.reduce((arr: ReactNode[], tbodyRow, index: number) => { 
//         const { 
//             cancel_date,
//             cancel_staff,
//             delivery_volume,
//             delivery_unit,
//             fran_price, 
//             insert_date,
//             last_modify_date,
//             last_modify_staff,
//             nEAPerPack,
//             // nOrderID,
//             order_count,
//             order_detail_cnt,
//             sGroup,
//             sItemShort,
//             staff_name,
//             // state,
//             state_name,
//             supply_amt,
//             total_amt,
//             vat_amt
//          } = tbodyRow; 
        
//         arr.push(
//             <>
//                 <td className='align-center' rowSpan={order_count}>{insert_date}</td>
//                 <td className='align-center' rowSpan={order_count}>{last_modify_date}</td>
//                 <td className='align-center' rowSpan={order_count}>{cancel_date}</td> 
//                 <td className='align-center' rowSpan={order_count}>{staff_name}</td>
//                 <td className='align-center' rowSpan={order_count}>{last_modify_staff}</td>
//                 <td className='align-center' rowSpan={order_count}>{cancel_staff}</td> 
//                 <td className='align-center' rowSpan={order_count}>{state_name}</td> 
//                 <td className='align-right' rowSpan={order_count}>{Utils.numberComma(order_count)}</td>
//                 <td className='align-left order-view'>{sGroup} {sItemShort} ({delivery_volume}) 배송단위/용량:  1{delivery_unit}/{nEAPerPack}</td>
//                 <td className='align-right'>{Utils.numberComma(fran_price)}원</td>
//                 <td className='align-right'>{Utils.numberComma(order_detail_cnt)}원</td>
//                 <td className='align-right'>{Utils.numberComma(supply_amt)}원</td>
//                 <td className='align-right'>{Utils.numberComma(vat_amt)}원</td>
//                 <td className='align-right'>{Utils.numberComma(total_amt)}원</td>
//             </>
//         )

//         return arr;
//     }, [] as ReactNode[])
//     return tableList;
// }, [excelQuery, searchOption]); 


  return (
    <tbody>
        {data.reduce((acc: any[], cur: any, idx: number) => {
            const { 
                cancel_date,
                cancel_staff,
                delivery_volume,
                delivery_unit,
                fran_price, 
                insert_date,
                last_modify_date,
                last_modify_staff,
                nEAPerPack,
                nOrderID,
                order_count,
                order_detail_cnt,
                sGroup,
                sItemShort,
                staff_name,
                // state,
                state_name,
                supply_amt,
                total_amt,
                vat_amt
            } = cur; 
            const tempObj = {
                [cur.nOrderID]: [
                    {...cur}
                ]
            }
            console.log(tempObj)
            return [...acc, tempObj];
            // const orderCount = Array.from({length: order_count}, (v, i) => {return {sGroup: sGroup, sItemShort: sItemShort, idx: i }})
            // console.log(orderCount)
            // nOrderID로 구분하기

            // return (
            //     <tr>
            //         <td className='align-center' rowSpan={order_count}>{insert_date}</td>
            //         <td className='align-center' rowSpan={order_count}>{last_modify_date}</td>
            //         <td className='align-center' rowSpan={order_count}>{cancel_date}</td> 
            //         <td className='align-center' rowSpan={order_count}>{staff_name}</td>
            //         <td className='align-center' rowSpan={order_count}>{last_modify_staff}</td>
            //         <td className='align-center' rowSpan={order_count}>{cancel_staff}</td> 
            //         <td className='align-center' rowSpan={order_count}>{state_name}</td> 
            //         <td className='align-right' rowSpan={order_count}>{Utils.numberComma(order_count)}</td>
            //         <td className='align-left order-view'>{sGroup} {sItemShort} ({delivery_volume}) 배송단위/용량:  1{delivery_unit}/{nEAPerPack}</td>
            //         <td className='align-right'>{Utils.numberComma(fran_price)}원</td>
            //         <td className='align-right'>{Utils.numberComma(order_detail_cnt)}원</td>
            //         <td className='align-right'>{Utils.numberComma(supply_amt)}원</td>
            //         <td className='align-right'>{Utils.numberComma(vat_amt)}원</td>
            //         <td className='align-right'>{Utils.numberComma(total_amt)}원</td>
            //     </tr>
            // )
        })}
    </tbody>
  )
}

export default OrderDetailExcelBody
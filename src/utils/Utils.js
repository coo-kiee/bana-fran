import * as xlsx from 'xlsx-js-style'

/* eslint-disable */
export default class Utils {
    static converDateFormat = (str, exp) => {
        let timestamp = Date.parse(str)
        if (isNaN(timestamp) === true) return str

        const strDate = new Date(str)
        const localDate = new Date(strDate.getTime() + strDate.getTimezoneOffset() * 60 * 1000)

        const year = localDate.getFullYear()
        const month = localDate.getMonth() + 1 < 10 ? '0' + (localDate.getMonth() + 1) : '' + (localDate.getMonth() + 1)
        const date = localDate.getDate() < 10 ? '0' + localDate.getDate() : '' + localDate.getDate()
        return year + exp + month + exp + date
    }

    static addClass = (e, c) => {
        let cn = e.className
        if (cn.indexOf(c) !== -1) return
        if (cn !== '') c = ' ' + c
        e.className = cn + c
    }

    static removeClass = (e, c) => {
        e.className = e.className.replace(new RegExp('(?:^|s)' + c + '(?!S)'), '')
    }

    static hasClass = (e, c) => {
        return (' ' + e.className + ' ').indexOf(' ' + c + ' ') > -1
    }

    // 숫자값 체크. (true : 숫자가 아닌값 포함됨.)
    static strNumberCheck = (str) => {
        let regexp = /^[0-9]*$/
        if (!regexp.test(str)) return true
        return false
    }

    // 연속된 숫자, 같은 숫자 체크. 123456 OR 111111 (true: 연속된 숫자 및 반복된 숫자열)
    static strValidCheck = (str, maxLen) => {
        if (!maxLen) maxLen = 6 // 글자수를 지정하지 않으면 6로 지정
        let i, j, x, y
        let buff = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
        let src,
            src2,
            ptn = ''
        for (i = 0; i < buff.length; i++) {
            src = buff[i] // 0123456789
            src2 = buff[i] + buff[i] // 01234567890123456789
            for (j = 0; j < src.length; j++) {
                x = src.substr(j, 1) // 0
                y = src2.substr(j, maxLen) // 0123
                ptn += '[' + x + ']{' + maxLen + ',}|' // [0]{4,}|0123|[1]{4,}|1234|...
                ptn += y + '|'
            }
        }
        ptn = new RegExp(ptn.replace(/.$/, '')) // 맨마지막의 글자를 하나 없애고 정규식으로 만든다.
        if (ptn.test(str)) return true
        return false
    }

    static getQueryVariable = (variable) => {
        let query = window.location.search.substring(1)
        let vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=')
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1])
            }
        }
    }

    // 숫자를 10000단위로 표시, 10000 이하는 소수점 첫째자리까지표시
    static roundingDown10000 = (number) => {
        if (number >= 10000) return Math.floor(number/10000);
        else if (number > 0) return (number/10000).toFixed(1);
        else return number;
    }

    static createFileName = function (preName, fileName) {
        function s4() {
            return '_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        let resultStr = preName + s4() + s4() + s4()
        resultStr += fileName.substring(fileName.lastIndexOf('.'))
        return resultStr
    }

    static webkitHandlersTitle = function (title) {
        // WebView 상단 타이틀 변경.
        let jsonData = { title: title }
        let strJsonData = JSON.stringify(jsonData)
        try {
            // AOS
            window.android.setTitle(title)
        } catch (error) {}
        try {
            // iOS
            window.webkit.messageHandlers.iOSClient.postMessage(strJsonData)
        } catch (error) {
            console.log(title, ' : ', error)
        }
    }

    static numberComma = function (x) {
        return x ? x.toString().replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,') : x
    }

    /**
     * 만 14세 미만 체크
     * @param birthDate yyyyMMdd
     * @param age 기준나이
     * @returns true: 만 {age}세 미만
     */
    static isAgeCheck = (birthDate, age) => {
        let today = new Date()
        let yyyy = today.getFullYear()
        let mm = today.getMonth() < 9 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
        let dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
        return parseInt(yyyy + mm + dd) - parseInt(birthDate) - age * 10000 < 0
    }

    //pc, mobile chack script (sample code)
    static checkPlatform(ua) {
        if (ua === undefined) {
            ua = window.navigator.userAgent
        }

        ua = ua.toLowerCase()
        let platform = {}
        let matched = {}
        let userPlatform = 'pc'
        let platform_match =
            /(ipad)/.exec(ua) ||
            /(ipod)/.exec(ua) ||
            /(windows phone)/.exec(ua) ||
            /(iphone)/.exec(ua) ||
            /(kindle)/.exec(ua) ||
            /(silk)/.exec(ua) ||
            /(android)/.exec(ua) ||
            /(win)/.exec(ua) ||
            /(mac)/.exec(ua) ||
            /(linux)/.exec(ua) ||
            /(cros)/.exec(ua) ||
            /(playbook)/.exec(ua) ||
            /(bb)/.exec(ua) ||
            /(blackberry)/.exec(ua) ||
            []

        matched.platform = platform_match[0] || ''

        if (matched.platform) {
            platform[matched.platform] = true
        }

        if (
            platform.android ||
            platform.bb ||
            platform.blackberry ||
            platform.ipad ||
            platform.iphone ||
            platform.ipod ||
            platform.kindle ||
            platform.playbook ||
            platform.silk ||
            platform['windows phone']
        ) {
            userPlatform = 'mobile'
        }

        if (platform.cros || platform.mac || platform.linux || platform.win) {
            userPlatform = 'pc'
        }

        return userPlatform
    }

    static loadScript(src) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script')
            script.src = src

            script.onload = () => resolve(script)
            script.onerror = () => reject(new Error(`${src}를 불러오는 도중에 에러가 발생함`))

            document.head.append(script)
        })
    }

    static setToken = (sToken) => {
        sessionStorage.setItem("login_token",sToken);
    }
     
    static getToken = () => {
        return sessionStorage.getItem("login_token");
    }
     
    static removeToken = () => {
        sessionStorage.removeItem("login_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("userNm");
        localStorage.removeItem("userNo");
    }
    
    static chkToken = () => {
        if(sessionStorage.getItem("login_token") === null || sessionStorage.getItem("login_token") === "null" || sessionStorage.getItem("login_token") === "") {
            return false;	    			
        } else {
            return true;
        } 
    }

    static calculateVat = (charge) => {
        
        const vatRate = 0.09;
        const vat = charge * vatRate;
        return [charge - vat, vat, charge];
    }

    static excelDownload = (downloadDatas, options, fileName) => {

        // 엑셀 워크북 생성
        const book = xlsx.utils.book_new();
        
        // 엑셀 워크시트 추가함수
        const addSheet = (index) => {
            let workSheet; // any

            let [downloadData, type, sheetOption = {}, colspan, workSheetName = '', header = {}, addRowColor = {}] = [downloadDatas, options.type, options.sheetOption, options.colspan, options.sheetName, options.header, options.addRowColor];
            // 워크시트 여러개인 경우
            if (index) [downloadData, type, sheetOption = {}, colspan, workSheetName = '', header = {}, addRowColor = {}] = [downloadDatas[index], options[index].type, options[index].sheetOption, options[index].colspan, options[index].sheetName, options[index].header, options[index].addRowColor];
            
            switch (type.toLowerCase()) {
                case 'table':
                    workSheet = xlsx.utils.table_to_sheet(downloadData, sheetOption);
                    // console.log('여기1', workSheet);
                    break;
                case 'array': // const file1 = [ ["이름", "나이"], ["장민우", "31"], ]
                    workSheet = xlsx.utils.aoa_to_sheet(downloadData, sheetOption);
                    break;
                case 'object': // const file2 = [ { A: "학과", B: "직급", C: "이름", D: "나이" }, { A: "흉부외과", B: "의사", C: "장민우", D: "31" }, ]
                    workSheet = xlsx.utils.json_to_sheet(downloadData, sheetOption);
                    break;
                default:
                    return;
            }

            // 병합할 셀 영역 설정
            if (options.merges) workSheet['!merges'] = { ...workSheet['!merges'], ...options.merges };

            const { origin = 'A1' } = sheetOption;
            const { c: originCol, r: originRow } = xlsx.utils.decode_cell(origin);
            // 셀 너비 설정
            if (!(origin === 'A1')) { // A1 셀에서 시작하지 않을 때 빈 셀 너비 설정 추가
                for (let index = 0; index < originCol; index++) {
                    workSheet['!cols'].push({ wpx: 40 });
                };
            };
            workSheet['!cols'] = [ ...workSheet['!cols'], ...colspan ];

            // 엑셀 테두리 설정 + addRowColor 행의 셀 이름 수집
            const defaultBorderStyle = { style: "thin", color: { rgb: "#000000" } };
            const border = { top: defaultBorderStyle, bottom: defaultBorderStyle, left: defaultBorderStyle, right: defaultBorderStyle };
            const cellRange = xlsx.utils.decode_range(workSheet["!ref"]);
            let addRowColorCell = [];
            const { rowNum, rowColor } = addRowColor;
            for (let col = originCol; col <= cellRange.e.c; col++) {
                for (let row = originRow; row <= cellRange.e.r; row++) {
                    const cellName = xlsx.utils.encode_cell({ c: col, r: row });
                    // console.log(cellName);
                    workSheet[cellName] = { ...workSheet[cellName], s: { border }, v:workSheet[cellName]?.v || ''  }; // 테두리 설정
                    if(rowNum && originCol <= col && (originRow + rowNum - 1) === row) addRowColorCell.push(cellName); // addRowColorCell 수집
                };
            };
            
            // 엑셀 정렬 스타일 추가 - 문자열: 가운데 정렬, 숫자: 오른쪽 정렬 + 3자리마다 ,표시
            const isSellAddress  = /[A-Z]{1,3}\d{1,5}/;
            const { checkHeader, color } = header;
            Object.entries(workSheet).reduce((res, cur) => {
                const key = cur[0];
                const value = cur[1];
                if (value.t && isSellAddress.test(key)) res[key] = value.t === 's' ? { ...value, s: { ...value.s, alignment: { vertical: "center", horizontal: "center" } } } : { ...value, z: "#,##0", s: { ...value.s, alignment: { vertical: "center", horizontal: "right" } } };
                if (checkHeader && checkHeader.length > 0 && checkHeader.includes(value.v) > 0) res[key].s = { ...res[key].s, fill: { fgColor: { rgb: color || 'd3d3d3' } }}; // 헤더 색상 추가
                if (addRowColorCell.length > 0 && addRowColorCell.includes(key) > 0) res[key].s = { ...res[key].s, fill: { fgColor: { rgb: rowColor || 'd3d3d3' } }}; // ddRowColor 행의 색상 추가
                return workSheet;
            }, workSheet);
            // console.log('addRowColorCell', addRowColorCell);
            
            // console.log('final', workSheet);
            xlsx.utils.book_append_sheet(book, workSheet, workSheetName);
        }

        // 워크시트 여러개 추가
        if (typeof types === Array && types.length > 1) {
            downloadDatas.forEach((downloadData, index) => {
                addSheet(index);
            })
        } else {
            addSheet();
        }
        xlsx.writeFile(book, fileName + '.xlsx');
    }
}

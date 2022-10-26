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
        localStorage.setItem("login_token",sToken);
    }
     
    static getToken = () => {
        return localStorage.getItem("login_token");
    }
     
    static removeToken = () => {
        localStorage.removeItem("login_token");
        localStorage.removeItem("userID");
        localStorage.removeItem("userNm");
    }
    static chkToken = () => {
        if(localStorage.getItem("login_token") === null || localStorage.getItem("login_token") === "null" || localStorage.getItem("login_token") === "") {
            return false;	    			
        } else {
            return true;
        } 
    }
}

//#region `hfnum: 넘버 관련 모듈`
export const hfnum = Object.seal({
    /**
     * 넘버가 맞는지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    isNum: (tv) => {
        return typeof tv === 'number';
    },


    /**
     * 넘버가 아닌지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    notNum: (tv) => {
        return typeof tv !== 'number';
    },


    /**
     * 넘버가 실수인지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    isFloat: (tv) => {
        return (tv % 1) !== 0;
    },


    /**
     * 넘버가 음수인지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    isMinus: (tv) => {
        return tv < 0;
    },


    /**
     * 난수 만들기 0~n
     * @param {number} tv
     * @returns {number}
     */
    random: (tv) => {
        return Math.round(Math.random() * (tv - 1));
    },


    /**
     * 난수 만들기 min~max
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    randRange: (min, max) => {
        return min + Math.round(Math.random() * (max - min));
    },


    /**
     * 넘버가 홀수인지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    isOdd: (tv) => {
        return (tv % 2) > 0;
    },


    /**
     * 넘버가 짝수인지 확인
     * @param {number} tv
     * @returns {boolean}
     */
    isEven: (tv) => {
        return (tv % 2) === 0;
    }
});
//#endregion



//#region `hfstr: 문자열 관련 모듈`
export const hfstr = Object.seal({
    /**
     * 문자열 유효성 확인
     * @param {string} str
     * @returns {boolean}
     */
    isStr: (str) => {
        if (typeof str === 'string')
            return str.trim() !== '';
        else
            return false;
    },


    /**
     * 이름에서 마지막 번호 확인
     * @param {string} str
     * @param {string} token
     * @returns {number}
     */
    getLastNum: (str, token = '_') => {
        const ti = str.lastIndexOf(token) + 1;
        return ~~str.substring(ti);
    },


    /**
     * 문자열 >> ArrayBuffer 변환
     * @param {string} str
     * @returns {Uint16Array}
     */
    str2Ab: (str) => {
        const l = str.length;
        let tab = new Uint16Array(new ArrayBuffer(l * 2));
        for (let i = 0; i < l; i++) {
            tab[i] = str.charCodeAt(i);
        }
        return tab;
    },


    /**
     * ArrayBuffer >> 문자열 변환
     * @param {Uint16Array} ab
     * @returns {string}
     */
    ab2Str: (ab) => {
        return String.fromCharCode.apply(null, ab);
    }
});
//#endregion



//#region `hfarr: 배열 관련 모듈`
export const hfarr = Object.seal({
    /**
     * 배열객체 유효성 확인
     * @param {array} arr
     * @returns {boolean}
     */
    notEmpty: (arr) => {
        return Array.isArray(arr) && (arr.length > 0);
    },


    /**
     * 배열에 요소 확인
     * @param {array} arr
     * @param {temp object} te
     * @returns {boolean}
     */
    contains: (arr, te) => {
        if (hfarr.notEmpty(arr) === false) return false;

        let tb = false;
        const l = arr.length
        for (let i = 0; i < l; i++) {
            if (arr[i] === te) {
                tb = true;
                break;
            }
        }
        return tb;
    },


    /**
     * 배열 섞기
     * @param {array} arr
     * @returns {void}
     */
    shuffle: (arr) => {
        if (hfarr.notEmpty(arr) === false) return;

        const l = arr.length;
        for (let i = 0; i < l; i++) {
            let te = arr[i];
            let ti = hfnum.randRange(0, l - 1);
            arr[i] = arr[ti];
            arr[ti] = te;
        }
    },


    /**
     * 배열 복사
     * @param {array} arr
     * @returns {array}
     */
    copy: (arr) => {
        if (hfarr.notEmpty(arr) === false) return null;
        return arr.slice();
    }
});
//#endregion



//#region `hfdtime: 날짜,시간 관련 유틸리티`
export const hfdtime = Object.seal({
    /**
     * 시간 스탬프 기본
     * @param {Date} td
     * @returns {string}
     */
    timeStamp: (td) => {
        const df1 = td.getFullYear().toString().substring(2);
        const df2 = (td.getMonth() + 1).toString().padStart(2, '0');
        const df3 = td.getDate().toString().padStart(2, '0');
        const df4 = td.getHours().toString().padStart(2, '0');
        const df5 = td.getMinutes().toString().padStart(2, '0');
        const df6 = td.getSeconds().toString().padStart(2, '0');
        const df7 = td.getMilliseconds().toString().padStart(3, '0');
        // return `${df1}${df2}${df3}${df4}${df5}${df6}${df7}`;
        // return `${df1}-${df2}-${df3} ${df4}:${df5}:${df6}.${df7}`;
        return `${df1}/${df2}/${df3} ${df4}:${df5}:${df6}.${df7}`;
    },


    /**
     * 시간 문자열 포맷으로 만들기
     * @param {string} fs1
     * @param {Date} td
     * @returns {string}
     */
    format: (fs1, td) => {
        const re1 = /\\./g;
        const mc1 = Array.from(fs1.matchAll(re1));

        const len = fs1.length - mc1.length;
        const buf1 = new Uint16Array(new ArrayBuffer(len * 2));

        let i = 0;
        for (const m1 of mc1) {
            const fi = m1.index - i;
            const tv = m1[0];
            const li = tv.length - 1;
            buf1[fi] = tv[li].charCodeAt(0);
            ++i;
        }

        const buf2 = new Uint16Array(new ArrayBuffer(len * 2));
        const ke = fs1.length - 1; i = 0;
        let bp = false;
        for (let k = 0; k <= ke; ++k) {
            const tc = fs1[k];
            if (bp) {
                bp = false;
                buf2[i++] = '\0'.charCodeAt(0);
            }
            else {
                bp = tc === '\\';
                if (bp && (k < ke))
                    continue;
                else
                    buf2[i++] = tc.charCodeAt(0);
            }
        }

        let mrs = String.fromCharCode.apply(null, buf2);
        const re2 = /y+|M+|d+|H+|m+|s+|f+/g;

        const fn_r = (tx, l1) => {
            const l2 = tx.length;
            if (l1 < l2)
                return tx.substring(l2 - l1);
            else if (l1 > l2)
                return tx.padStart(l1, '0');
            return tx;
        };
        const fn_me = (tx, td) => {
            const l1 = tx.length;
            if (tx[0] === 'y')
                return fn_r(td.getFullYear().toString(), l1);
            else if (tx[0] === 'M')
                return fn_r((td.getMonth() + 1).toString(), l1);
            else if (tx[0] === 'd')
                return fn_r(td.getDate().toString(), l1);
            else if (tx[0] === 'H')
                return fn_r(td.getHours().toString(), l1);
            else if (tx[0] === 'm')
                return fn_r(td.getMinutes().toString(), l1);
            else if (tx[0] === 's')
                return fn_r(td.getSeconds().toString(), l1);
            else if (tx[0] === 'f')
                return fn_r(td.getMilliseconds().toString(), l1);
            return tx;
        };

        mrs = mrs.replace(re2, (tx) => {
            return fn_me(tx, td);
        });

        for (i = 0; i < len; ++i) {
            const tc = String.fromCharCode(buf1[i]);
            if (tc === '\0')
                buf1[i] = mrs[i].charCodeAt(0);
        }

        const res = String.fromCharCode.apply(null, buf1);
        return res;
    }
});
//#endregion

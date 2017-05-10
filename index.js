/*!
 * NODE-GJS
 * Copyright(c) 2017 Lonvenode,Inc.
 */

"use strict";

// 是否为 undefined
function isUndef(x) {
    return typeof (x) === "undefined";
}

// 是否为错误
function isError(x) {
    return x instanceof Error;
}

// 是否为String
function isString(x) {
    return typeof x === "string";
}

// 是否布尔值 
function isBoolean(x) {
    return typeof x === 'boolean';
}

// 是否对象
function isObject(x) {
    return typeof x === 'object';
}

// 是否纯对象
function isPlainObject(x) {
    return x && toString.call(x) == '[object Object]' && ('isPrototypeOf' in x);
}

// 是否为空对象，x如果是非空字符串，返回true
function isEmptyObject(x) {
    for (var k in x) {
        return false;
    }
    return true;
}

// 是否函数
function isFunction(x) {
    return typeof x === 'function';
}

// 文本是否为空或空白
function isEmpty(str) {
    return isString(str) && str.trim() === "";
}

// 是否正则
function isRegExp(x) {
    return x instanceof RegExp;
}

// 是否整数
function isInt(x) {
    // n 传入undefined、null正常, 字符串数字不要求类型相同
    return parseInt(x) === x;
}

// 是否邮箱
function isMail(x) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(x);
}

// 是否数组
function isArray(x) {
    return x instanceof Array;
}

// 是否数字
function isNum(x) {
    var type = typeof x;
    return (type == "number" || type == "string") && !isNaN(x - parseFloat(x));
}

// 是否日期
function isDate(x) {
    // 文本转化为日期格式
    if (isString(x)) {
        x = new Date(x);
    }
    return x instanceof Date && !isNaN(x.valueOf());
}

// Array 遍历
function arrEach(arr, x) {
    for (var i = 0; i < arr.length; i++) {
        if (x.call(arr[i], i, arr[i]) === false) {  // 循环中返回false值，跳出循环
            break;
        }
    }
    return arr;
}

// Object 遍历
function objEach(obj, x) {
    for (var k in obj) {
        if (x.call(obj[k], k, obj[k]) === false) {  // 循环中返回false值，跳出循环
            break;
        }
    }
    return obj;
}

// 通用遍历
function each(x, fn) {
    return isArray(x) ? arrEach(x, fn) : objEach(x, fn);
}

// toUTF8()
// Buffer 转 UTF8 字符串
function toUTF8(buffer) {
    if (buffer) {
        // windows
        if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
            buffer = buffer.slice(3);
        }
    }
    return buffer.toString();
}

// 异步对象
function step() {
    var m = {
        then: function (fn) {
            m.then = fn;
            return m;
        },
        done: function (fn) {
            m.done = fn;
            return m;
        },
        progress: function (fn) {
            m.progress = fn;
            return m;
        },
        fail: function (fn) {
            m.fail = fn;
            return m;
        },
        always: function (fn) {
            m.always = fn;
            return m;
        }
    }
    return m;
}

// 对象合并
function extend() {
    var args = arguments,
        deep = args[0] === true || false,
        i = deep ? 1 : 0,
        target = args[i++],
        assignFix;
    if (!isObject(target) && !isFunction(target)) { // 必须是 object 或 function
        target = {};
        assignFix = 1; // 如果后面使用 assign 方法，标记参数需要修正
    }
    if (!deep) { // ES6 支持 Object.assign 方法，但不支持深复制
        var temp;
        if (assignFix) { // assign 方法 第一个值不能是 undefined 或 null，传入 修正后的 target
            var temp = slice.call(args, 1);
            temp.unshift(target);
        } else {
            temp = args;
        }
        return Object.assign.apply(null, temp);
    }
    for (; i < args.length; i++) {
        each(args[i], function (key, copy) { // 使用 each 方法，当数组时，不使用 for in 的方法，因为会遍历其中的 prototype
            if (copy !== undefined) {
                if (target !== copy) {
                    var copyIsArray;
                    if (deep && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) { // 深度复制（只支持 copy 为数组或纯对象）
                        var src = target[key];
                        copy = extend(deep, copyIsArray ? isArray(src) ? src : [] : isPlainObject(src) ? src : {}, copy); // 递归合并
                    }
                    target[key] = copy;
                }
            }
        });
    }
    return target;
}

module.exports = {
    each: each,
    arrEach: arrEach,
    objEach: objEach,
    toUTF8: toUTF8, // Buffer 转 UTF8 字符串
    step: step, // 异步对象
    extend: extend, // 对象合并
    isUndef: isUndef, // 是否为undefined
    isError: isError, // 是否为错误
    isString: isString, // 是否为String
    isBoolean: isBoolean, // 是否布尔值
    isObject: isObject, // 是否对象
    isPlainObject: isPlainObject, // 是否纯对象
    isEmptyObject: isEmptyObject, // 是否为空对象，x如果是非空字符串，返回true
    isFunction: isFunction, // 是否函数
    isEmpty: isEmpty, // 文本是否为空或空白
    isRegExp: isRegExp, // 是否正则
    isInt: isInt, // 是否整数
    isMail: isMail, // 是否邮箱
    isArray: isArray, // 是否数组
    isNum: isNum, // 是否数字
    isDate: isDate // 是否日期
};
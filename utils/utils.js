/*
 * @Description: 
 * @Author: yanxiao
 * @Github: https://github.com/yanxiaos
 * @Date: 2021-12-22 14:54:05
 * @LastEditors: yanxiao
 */
import { isArray, isObject } from "./getType";
import { deepClone } from "./clone";

/**
 * @name: 对象深层合并
 * @description: json中的对象数组采用逐个合并
 * @param {type} {*}
 * @return {type} {*}
 * @param {any} obj 被合并的对象
 * @param {any} diffObj 往前合并的对象
 */
export function deepMergeObj (obj, diffObj) {
  obj = deepClone(obj)
  diffObj = deepClone(diffObj)
  //如果obj不存在 或者diffObj不是对象也不是数组，直接返回
  if (!obj || (!isObject(diffObj) && !isArray(diffObj))) {
    return diffObj
  } else if ((isObject(obj) && isObject(diffObj)) || (isArray(obj) && isArray(diffObj))) {
    // 如果都是对象或 都是数组，则依次赋值
    for (const key in diffObj) {
      obj[key] = deepMergeObj(obj[key], diffObj[key])
    }
  } else if (isArray(obj) && isObject(diffObj)) {
    // 如果obj是数组，diffObj是对象，则将diffobj依次赋值给obj
    for (const key in obj) {
      obj[key] = deepMergeObj(obj[key], diffObj)
    }
  } else if (isObject(obj) && isArray(diffObj)) {
    // 如果obj是对象，diffObj是数组，则将diffobj依次赋值给obj
    obj = [obj]
    for (const key in diffObj) {
      obj[key] = deepMergeObj(obj[key] || {}, diffObj[key])
    }
  } else {
    // console.error('deepMergeObj err');
  }
  return obj
}

// 判断对象，数组的值和顺序完全相等
export function isObjEqual (obj, diffObj) {
  return JSON.stringify(obj) === JSON.stringify(diffObj)
}

// 对象合并
export function mergeObject (obj, diffObj) {
  return Object.assign(obj || {}, diffObj)
}



// 对象数组差量合并(最终是数组进行合并)
// mergeArray([a,b,c],[c,d]) => [a,b,c,d]
export function mergeArray (arr, diffArr) {
  let result = []
  if (isArray(diffArr)) {
    for (let i = 0; i < diffArr.length; i++) {
      let exist = false
      for (const arrItem of arr) {
        if (isObjEqual(diffArr[i], arrItem)) {
          exist = true
          break
        }
      }
      if (!exist) result.push(diffArr[i])

    }
  } else if (isObject(diffArr)) {
    let exist = false
    for (const arrItem of arr) {
      if (isObjEqual(diffArr, arrItem)) {
        exist = true
        break
      }
    }
    if (!exist) result.push(diffArr)
  } else {
    throw '函数mergeArray 的 参数 diffArr，不是 Array或Object'
  }

  return [...arr, ...result]
}

// ⬇️暂时没有被用到

/**
 * 对象数组逐项合并(数组与数组或数组与对象合并，最终是对象进行合并)
 * mergeArrayObj(
 * [{a:'a', b:'b'},{c:'c'}],
 * [{a:'aa'}]
 * )=>
 * [{a:'aa', b:'b'},{c:'c',a:'aa'}]
 */
export function mergeArrayObj (arr, diffArr) {
  if (!isArray(arr)) throw `[utils Function mergeArrayObj]第一个参数应该是Array，但得到了${typeof arr}`
  let result = []
  if (isArray(diffArr)) {
    let length = 0
    arr.length >= diffArr ? length = arr.length : length = diffArr.length
    for (let i = 0; i < length; i++) {
      result.push(Object.assign(arr[i] || {}, diffArr[i] || {}))
    }
  } else if (isObject(diffArr)) {
    for (let i = 0; i < arr.length; i++) {
      result.push(Object.assign(arr[i], diffArr))
    }
  }
  return result
}
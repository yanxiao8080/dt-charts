/**
 * @name: 返回一个防抖函数
 * @description: 例: this.handlerOption = debounce(this.optionHandler, 100)
 * @param {type} fn Function 函数
 * @param {type} delay Number 防抖时间
 * @return type Function 返回一个防抖函数
 */
export function debounce (fn, delay) {
  let timer = null
  return function () {
    const self = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(self, args)
    }, delay)
  }
}

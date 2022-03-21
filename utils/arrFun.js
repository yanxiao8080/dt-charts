// 返回arr数组中不等于diffItem的元素   返回新数组，不影响原数组
export function arrDelItem (arr, diffItem) {
  return arr.filter(item => diffItem !== item)
}

// 返回arr数组中不在diffArr数组中的元素   返回新数组，不影响原数组
export const arrDelArrItem = (arr, diffArr) => {
  return arr.filter(item => !~diffArr.indexOf(item))
}

// 返回一个每个item都唯一的数组    返回型数组，不影响原数组
export function unique (arr) {
  const result = []
  arr.forEach(item => {
    if (!~result.indexOf(item)) result.push(item)
  })
  return result
}

import { isObject, isArray } from './getType'

export function clone (v) {
  if (isObject(v)) return Object.assign({}, v)
  if (isArray(v)) return v.slice()
}

export function cloneDeep (v) {
  return JSON.parse(JSON.stringify(v))
}

export function deepClone (v) {
  if (!isObject(v) && !isArray(v)) {
    return v
  }
  let result = {}
  isObject(v) ? result = {} : result = []
  for (const key in v) {
    result[key] = deepClone(v[key])
  }
  return result
}
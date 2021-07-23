/* eslint-disable no-param-reassign */
/**
 * Generate random number in a range
 * @param {number}         min
 * @param {number}         max     [optional]
 * @param {number|boolean} float   [optional] default false
 * @returns {number}
 */
const random = (min: number, max?: number, float?: number | boolean): number => {
  if (min === undefined) {
    return Math.random()
  }
  if (max === undefined) {
    max = min
    min = 0
  }

  if (max < min) {
    const tmp = max
    max = min
    min = tmp
  }

  if (float) {
    const result = Math.random() * (max - min) + min
    if (float === true) {
      return result
    } else if (typeof float === 'number') {
      let str = result.toString()
      const index = str.indexOf('.')
      str = str.substr(0, index + 1 + float)
      if (str[str.length - 1] === '0') {
        str = str.substr(0, str.length - 1) + random(1, 9)
      }
      return parseFloat(str)
    }
  }

  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default random

import R from 'ramda'

const Diff = function (value = null, stack = {}) {
  return { stack, value }
}

const isComplexType = type => type === 'Object' || type === 'Array'
const isEmpty = val => val === '' || val === undefined || val === null

const buildUpdateDiff = pair => new Diff(pair[0], {
  __diffType: 'update',
  __newValue: pair[0],
  __oldValue: pair[1]
})

const buildAddDiff = value => new Diff(value, {
  __diffType: 'add',
  __newValue: value,
  __oldValue: null
})

const buildDeleteDiff = value => new Diff(value, {
  __diffType: 'delete',
  __newValue: null,
  __oldValue: value
})

// 将各类diff方法绑在一个对象上，好处是声明函数时不用关心顺序，调用时更方便；
// 坏处是，这个对象将一直存活在内存中
const d = {}

d.diffBase = pair => {
  const [ newValue, oldValue ] = pair
  const [ isEmptyNew, isEmptyOld ] = pair.map(isEmpty)
  if (isEmptyNew === isEmptyOld && isEmptyNew) {
    return new Diff()
  } else if (!isEmptyNew && !isEmptyOld) {
    return R.equals(...pair) ? new Diff() : buildUpdateDiff(pair)
  } else {
    return isEmptyNew ? buildDeleteDiff(oldValue) : buildAddDiff(newValue)
  }
}
/**
 *
 * @param {Array[newValue, oldValue]} pair: 对比的数据
 */
d.diffArray = pair => {
  const [ newArr, oldArr ] = pair
  // 都是空数组，返回无变化diff
  if (!newArr.length && !oldArr.length) {
    return new Diff()
  }
  const diffStack = []
  const diffValue = []
  for (let i = 0; i < newArr.length || i < oldArr.length; i++) {
    const newVal = newArr[i]
    const oldVal = oldArr[i]
    let diff = {}
    if (newVal !== undefined && oldVal !== undefined) { // 当两个值存在时
      diff = d.diffValue([newVal, oldVal])
    } else if (newVal !== undefined) {
      diff = buildAddDiff(newVal)
    } else {
      diff = buildDeleteDiff(oldVal)
    }
    diffValue[i] = diff.value
    if (!R.isEmpty(diff.stack)) {
      diffStack[i] = diff.stack
    }
  }
  return diffStack.length ? new Diff(diffValue, diffStack) : new Diff()
}

/**
 *
 * @param {Array[newValue, oldValue]} pair: 对比的数据
 */
d.diffObject = pair => {
  const [ newValue, oldValue ] = pair
  const diff = new Diff({ ...newValue })
  const propPair = pair.map(Object.keys)
  // 差集，存在不一样的prop，说明肯定是添加或者删除
  const difference = R.symmetricDifference(...propPair)
  difference.forEach(prop => {
    // 如果添加的属性值依旧为空值，或者删除的属性值原本也为空值，则不认为发生了改变
    if (isEmpty(newValue[prop]) && isEmpty(oldValue[prop])) {
      return
    }
    diff.stack[prop] = {
      __diffType: newValue[prop] ? 'add' : 'delete',
      __newValue: newValue[prop],
      __oldValue: oldValue[prop]
    }
    // 把被删除的key 合并到新值上
    if (!newValue[prop]) {
      diff.value[prop] = oldValue[prop]
    }
  })
  // 交集
  const intersection = R.intersection(...propPair)
  intersection.forEach(prop => {
    // 循环交集的prop，对比两个json的此prop属性值
    const { stack, value } = d.diffValue(pair.map(R.prop(prop)))
    // return diff && (diffStack[prop] = diff)
    if (!R.isEmpty(stack)) {
      diff.stack[prop] = stack
      diff.value[prop] = value
    }
  })
  return diff
}

/**
 *
 * @param {Array[newValue, oldValue]} pair: 对比的数据
 */
d.diffValue = pair => {
  const [ newType, oldType ] = pair.map(R.type)
  if (newType === oldType && isComplexType(newType)) {
    return d[`diff${newType}`](pair)
  } else {
    return d.diffBase(pair)
  }
}

/**
 *
 * @param {Object} stack: diff stack
 * @param {string} path: value path; example: options.params.query.0
 */
export const getDiffStack = (stack, path) =>
  R.path(
    path.split('.').map(p => (Number(p).toString() === p ? Number(p) : p)),
    stack
  )

export const getDiffStyle = (stack, path) => {
  if (!stack) return null
  const style = {
    diff: true
  }
  const diff = getDiffStack(stack, path)
  if (diff && diff.__diffType) style[`diff-${diff.__diffType}`] = true
  return style
}

export default d.diffObject

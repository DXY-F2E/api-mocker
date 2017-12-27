import R from 'ramda'

const Diff = function (value = null, stack = {}) {
  return { stack, value }
}

const d = {}
const typeEq = pair => R.equals(...pair.map(R.type))
const isBaseType = type => 'Boolean,String,Null,Number,Undefined'.indexOf(type) > -1
const isEmpty = val => val === '' || val === undefined || val === null

const buildUpdateDiff = pair => new Diff(R.clone(pair[0]), {
  __diffType: 'update',
  __newValue: R.clone(pair[0]),
  __oldValue: R.clone(pair[1])
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
    if (newVal !== undefined && oldVal !== undefined) { // 当两个值存在时
      const { stack, value } = d.diffValue([newVal, oldVal])
      if (!R.isEmpty(stack)) {
        diffStack[i] = stack
        diffValue[i] = value
      } else {
        diffValue[i] = R.clone(newVal)
      }
    } else if (newVal !== undefined) {
      diffValue[i] = R.clone(newVal)
      diffStack[i] = {
        __diffType: 'add',
        __newValue: diffValue[i],
        __oldValue: null
      }
    } else {
      diffValue[i] = R.clone(oldVal)
      diffStack[i] = {
        __diffType: 'delete',
        __newValue: null,
        __oldValue: diffValue[i]
      }
    }
  }
  return diffStack.length ? new Diff(diffValue, diffStack) : new Diff()
}
d.diffObject = pair => {
  const [ newValue, oldValue ] = pair
  const diff = new Diff({ ...newValue })
  const propPair = pair.map(Object.keys)
  // 差集，存在不一样的prop，说明肯定是添加或者删除
  const difference = R.symmetricDifference(...propPair)
  difference.forEach(prop => {
    diff.stack[prop] = {
      __diffType: newValue[prop] ? 'add' : 'delete',
      __newValue: R.clone(newValue[prop]),
      __oldValue: R.clone(oldValue[prop])
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

d.diffValue = pair => {
  if (typeEq(pair)) {
    const type = R.type(pair[0])
    return isBaseType(type) ? d.diffBase(pair) : d[`diff${type}`] && d[`diff${type}`](pair)
    // return R.type(pair[0]) === 'Object' ? d.diffObject(pair) : d.diffBase(pair)
  } else {
    return buildUpdateDiff(pair)
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

import R from 'ramda'

const d = {}
const typeEq = pair => R.equals(...pair.map(R.type))
// const isBaseType = type => 'Boolean,String,Null,Number,Undefined'.indexOf(type) > -1

const updateDiff = pair => ({
  __diffType: 'update',
  __newValue: R.clone(pair[0]),
  __oldValue: R.clone(pair[1])
})

d.diffBase = pair => !R.equals(...pair) && updateDiff(pair)

d.diffObject = pair => {
  const [ newValue, oldValue ] = pair
  const diffStack = {}
  const propPair = pair.map(Object.keys)
  // 差集，存在不一样的prop，说明肯定是添加或者删除
  const difference = R.difference(...propPair)
  difference.forEach(prop => {
    diffStack[prop] = {
      __diffType: newValue[prop] ? 'add' : 'delete',
      __newValue: R.clone(newValue[prop]),
      __oldValue: R.clone(oldValue[prop])
    }
  })
  // 交集
  const intersection = R.intersection(...propPair)
  intersection.forEach(prop => {
    // 循环交集的prop，对比两个json的此prop属性值
    const diff = d.diffValue(pair.map(R.prop(prop)))
    return diff && (diffStack[prop] = diff)
  })
  return Object.keys(diffStack).length ? diffStack : false
}

d.diffValue = pair => {
  if (typeEq(pair)) {
    // const type = R.type(pair[0])
    // return isBaseType(type) ? d.diffBase(pair) : d[`diff${type}`] && d[`diff${type}`](pair)
    return R.type(pair[0]) === 'Object' ? d.diffObject(pair) : d.diffBase(pair)
  } else {
    return updateDiff(pair)
  }
}

export default d.diffValue

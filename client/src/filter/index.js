import moment from 'moment'
const filter = {}
filter.install = (Vue) => {
  Vue.filter('dateFormat', (date, format = 'YYYY-MM-DD H:mm:ss') => {
    // 若是时间戳字符串则转换为时间戳
    const d = isFinite(date) ? Number(date) : date
    return moment(d).format(format)
  })
  Vue.filter('reverse', (array) => array.reverse())
}
export default filter

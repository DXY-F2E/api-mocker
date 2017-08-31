import moment from 'moment'
const filter = {}
filter.install = (Vue) => {
  Vue.filter('dateFormat', (date, format = 'YYYY-MM-DD H:mm:ss') => moment(date).format(format))
  Vue.filter('reverse', (array) => array.reverse())
}
export default filter

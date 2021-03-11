export default function (res, fileName) {
  let dataString = JSON.stringify(res, null, 2)
  let blob = new Blob([dataString], {type: 'application/json'})
  let a = document.createElement('a')
  a.download = `${fileName}.json`
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

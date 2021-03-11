
function copy (content, callback) {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', content)
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    callback()
  }
}

export default copy

export default (err) => {
  if (err.response && err.response.status === 401) {
    window.location.href = '#/login'
  }
    // console.log(err.response);
    // throw err;
  return Promise.reject({
    response: err.response,
    statusCode: err.response.status,
    statusText: err.response.statusText,
    msg: err.response.data.message
  })
}



export default (req, res, next) => {
  const send = res.json;
  res.json = function (data) {
    if (data.error) {
      data.message = data.error
      data.success = false
      data.error = undefined
      data.code = res.statusCode
    }
    else {
      data.success = true
    }
    send.call(res, data)
  };
  next();
}

module.exports = function (time) {
  if (isNaN(time)) time = 0;
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
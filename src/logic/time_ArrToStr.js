function time_ArrToStr(time_massive) {

  const time_string = PrependZeros(time_massive[0], 2) + "-" +
    PrependZeros(time_massive[1], 2) + "-" +
    PrependZeros(time_massive[2], 2) + " " +
    PrependZeros(time_massive[3], 2) + ":" +
    PrependZeros(time_massive[4], 2) + ":" +
    PrependZeros(time_massive[5], 2);
  return time_string;
}

let PrependZeros = function (str, len, seperator) {
  if (typeof str === 'number' || Number(str)) {
    str = str.toString();
    return (len - str.length > 0) ? new Array(len + 1 - str.length).join('0') + str : str;
  }
  else {
    var spl = str.split(seperator || ' ')
    for (var i = 0; i < spl.length; i++) {
      if (Number(spl[i]) && spl[i].length < len) {
        spl[i] = PrependZeros(spl[i], len)
      }
    }
    return spl.join(seperator || ' ');
  }
};

export default time_ArrToStr
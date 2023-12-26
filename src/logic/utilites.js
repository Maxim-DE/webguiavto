export const PrependZeros = function (str, len, seperator) {
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

export function dec2hexString(dec) {
  return '0x' + (dec + 0x10000).toString(16).substr(-4).toUpperCase();
}

export function filter_obj(obj, callback) {
  const asArray = Object.entries(obj),
        filtered = asArray.filter(([key, value]) => callback(key, value))

  return Object.fromEntries(filtered)
}

export function reload_page() {
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

export function device_status (status_props) {
  switch (status_props) {
    case 0:
      return 'ВЫКЛ.'
    case 1:
      return 'ВКЛ.'
    case 3: 
      return 'ЗАБЛОКИРОВАНО'
  
    default:
      return '...'
  }
}

export function deepKeyExists(obj, key) {
  if (!obj || (typeof obj !== "object" && !Array.isArray(obj))) {
    return false;
  }
  else if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return true;
  }
  else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = deepKeyExists(obj[i], key);
      if (result) {
        return result;
      }
    }
  }
  else {
    for (const k in obj) {
      const result = deepKeyExists(obj[k], key);
      if (result) {
        return result;
      }
    }
  }

  return false;
}

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const roundDigits = x => ((x.toString().includes('.')) ? (x.toString().split('.').pop().length) : (0))

export function getTime() {
  var currentdate = new Date();
  var date = 
  PrependZeros(currentdate.getFullYear(), 2) + "-"
  + PrependZeros((currentdate.getMonth() + 1), 2) + "-"
  + PrependZeros(currentdate.getDate(), 2)

  var time = PrependZeros(currentdate.getHours(), 2) + ":"
          + PrependZeros(currentdate.getMinutes(), 2) + ":"
          + PrependZeros(currentdate.getSeconds(), 2);

  return [date, time]
}


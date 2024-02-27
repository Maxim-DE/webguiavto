import _ from "lodash";

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
    case 2: 
      return 'ЗАБЛОКИРОВАНО'
    case 3:  
      return 'СОН'
    case 4:
      return 'ЗАПУСК'
    case 5:
      return 'ПЕРЕХОД В СОН'
  
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

export function walk_in_NodeTree(node, func) {
  var children = node.childNodes;
  for (var i = 0; i < children.length; i++)  // Children are siblings to each other
    walk_in_NodeTree(children[i], func);
  func(node);
}

export function allEventListenersInNode(target_node) {
  const eventNames = Object.keys(window).filter(key => /^on/.test(key))

  let elements = [];

  const check_element_on_event = (element) => {
    const event_names = eventNames

    for (let j = 0; j < event_names.length; j++) {
      if (typeof element[event_names[j]] === 'function') {
        elements.push({
          "node": element,
          "type": event_names[j],
          "func": element[event_names[j]].toString(),
        });
      }
    }
  }

  walk_in_NodeTree(target_node, check_element_on_event)

  console.log(elements)
}

export function move_svg_byOffset(element, offset_x, offset_y) {
  const transform_value = element.getAttribute('transform');
  if (!transform_value) return

  const parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform_value);
  const currentX = Number(parts[1]),
        currentY = Number(parts[2]);

  element.setAttribute('transform', `translate(${currentX + offset_x}, ${currentY + offset_y})`);
}


export const roundDigits = x => ((x.toString().includes('.')) ? (x.toString().split('.').pop().length) : (0))

export function getTime() {
  var currentdate = new Date();
  var date = PrependZeros(currentdate.getDate(), 2) + "-"
    + PrependZeros((currentdate.getMonth() + 1), 2) + "-"
    + PrependZeros(currentdate.getFullYear(), 2)
  var time = PrependZeros(currentdate.getHours(), 2) + ":"
    + PrependZeros(currentdate.getMinutes(), 2) + ":"
    + PrependZeros(currentdate.getSeconds(), 2);

  return [date, time]
}

export const toMSTimeString = (seconds) => {
  const date = new Date(seconds * 1000);
  return [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ].map(val => String(val).padStart(2, '0')).join(':').replace(/^00:/, '');
};

export const MMSStoSecs = (MMSSTimeString) => {
  if (typeof MMSSTimeString !== 'string') {
    if (MMSSTimeString.toString) MMSSTimeString = MMSSTimeString.toString();
    else throw ("Invalid input");
  }

  let parts = MMSSTimeString.split(':'), 
      n = parts.length, 
      s = 0, 
      i

  for (i = 0; i < parts.length; i++) {
    const part = parseInt(parts[n - 1 - i]);
    if (i === 0) {
      s += part;
    } else if (i === 1) {
      s += part * 6e1;
    } else if (i === 2) {
      s += part * 36e2;
    }
  }

  return s;
}


// Helper to return a value's internal object [[Class]]
// That this returns [object Type] even for primitives
function getClass(obj) {
  return Object.prototype.toString.call(obj);
}

/*
** @param a, b        - values (Object, RegExp, Date, etc.)
** @returns {boolean} - true if a and b are the object or same primitive value or
**                      have the same properties with the same values
*/
export function objectTester(a, b) {

  // If a and b reference the same value, return true
  if (a === b) return true;

  // If a and b aren't the same type, return false
  if (typeof a != typeof b) return false;

  // Already know types are the same, so if type is number
  // and both NaN, return true
  if (typeof a == 'number' && isNaN(a) && isNaN(b)) return true;

  // Get internal [[Class]]
  var aClass = getClass(a);
  var bClass = getClass(b)

  // Return false if not same class
  if (aClass != bClass) return false;

  // If they're Boolean, String or Number objects, check values
  if (aClass == '[object Boolean]' || aClass == '[object String]' || aClass == '[object Number]') {
    return a.valueOf() == b.valueOf();
  }

  // If they're RegExps, Dates or Error objects, check stringified values
  if (aClass == '[object RegExp]' || aClass == '[object Date]' || aClass == '[object Error]') {
    return a.toString() == b.toString();
  }

  // Otherwise they're Objects, Functions or Arrays or some kind of host object
  if (typeof a == 'object' || typeof a == 'function') {

    // For functions, check stringigied values are the same
    // Almost certainly false if a and b aren't trivial
    // and are different functions
    if (aClass == '[object Function]' && a.toString() != b.toString()) return false;

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    // If they don't have the same number of keys, return false
    if (aKeys.length != bKeys.length) return false;

    // Check they have the same keys
    if (!aKeys.every(function (key) { return Object.prototype.hasOwnProperty.call(b, key) })) return false;

    // Check key values - uses ES5 Object.keys
    return aKeys.every(function (key) {
      return objectTester(a[key], b[key])
    });
  }
  return false;
}

export function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true
}

export function isFocused(element) {
  return document.activeElement === element
}

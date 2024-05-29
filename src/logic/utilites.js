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
      return 'АВАРИЯ'
    case 4:
      return 'СОН'
    case 5:
      return 'ЗАПУСК'
    case 6:
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

export function makeSVG(tag, attrs) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);
  return el;
}

export const numberOfCharactersAfter = x => ((x.toString().includes('.')) ? (x.toString().split('.').pop().length) : (0));


export function isFocused(element) {
  return document.activeElement === element
}

export function recursvive_obj_handle(object, add_handle_callback) {
  for (const key in object) {
    if (typeof object[key] === 'object') {
      recursvive_obj_handle(object[key])
    } else if (add_handle_callback) {

      if (typeof object[key] === 'boolean') {
        object[key] = add_handle_callback(Number(object[key]), key)
      } else {
        object[key] = add_handle_callback(object[key], key)
      }
    }
  }

  return object
}

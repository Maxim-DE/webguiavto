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


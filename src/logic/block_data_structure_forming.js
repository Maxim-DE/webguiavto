function blockData_structure_forming(primary_items, additional_items, data_structure) {

  let blockData_structure = {};

  for (let k = 0; k < primary_items.length; k++) {
    switch (primary_items[k].type) {
      case 'custom': {
        break;
      }

      case 'group': {
        const group_items = primary_items[k].items;
        for (let m = 0; m < group_items.length; m++) {
          const input_name = group_items[m].id;
          if (/switch/g.test(input_name) ||
            /checkbox/g.test(input_name)) {
            blockData_structure[input_name] = false;
          } else {
            blockData_structure[input_name] = '';
          }
        }

        break;
      }
    
      default: {
        const input_name = primary_items[k].id;
        if (/switch/g.test(input_name) ||
          /checkbox/g.test(input_name)) {
          blockData_structure[input_name] = false;
        } else {
          blockData_structure[input_name] = '';
        }

        break;
      }
    }
  }

  if (additional_items) {
    for (let k = 0; k < additional_items.length; k++) {
      const input_name = additional_items[k].id;
      if (/switch/g.test(input_name)) {
        blockData_structure[input_name] = false;
      } else {
        blockData_structure[input_name] = '';
      }
    }
  }

  const block_custom_data_structure = data_structure;

  for (const key in block_custom_data_structure) {
    let custom_group_data_structure = block_custom_data_structure[key].data_structure;
    for (let k = 0; k < custom_group_data_structure.length; k++) {
      const input_name = custom_group_data_structure[k];
      if (/switch/g.test(input_name)) {
        blockData_structure[input_name] = false;
      } else {
        blockData_structure[input_name] = '';
      }
    }
  }

  return blockData_structure;
}

function flat_input_data(obj) {
  let newObj = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      Object.keys(obj[key]).forEach(innerKey => {
        newObj[`${key}_${innerKey}`] = obj[key][innerKey];
      });
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}

export { blockData_structure_forming, flat_input_data}
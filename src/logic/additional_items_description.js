const additional_items_description = (additional_items) => {
  let description_strng = '',
    visible_items = [],
    visible_border = 2,
    hidden_items = 0

  for (let k = 0; k < additional_items.length; k++) {
    if (k > visible_border) {
      hidden_items++;
    } else {
      visible_items.push(additional_items[k].name)
    }
  }

  hidden_items = (hidden_items === 0) ? '' : ` и еще ${hidden_items}`;

  description_strng = ` (${visible_items.join(', ')}${hidden_items})`;

  return description_strng
}  

export default additional_items_description
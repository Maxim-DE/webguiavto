
function updatePool(state, request_data) {
  if (request_data) {
    return {
      pool: state.pool.concat(request_data),
    };
  }
}

function sectionData_format(state, section_name, data) {
  let data_entries = Object.entries(data);
  state[section_name] = data_entries;
}

export {updatePool, sectionData_format};

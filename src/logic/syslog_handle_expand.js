const find_log_pos = (log_data, log_id) => {
  for (let log = 0; log < log_data.length; log++) {
    if (log_data[log][0] == log_id) {
      return log
    }
  }
}

export const syslog_handle_expand = (expand_info, log_data, log_id) => {
  let log_num = Number(log_id),
      log_to_expand = log_data.filter(log => log[0] == log_num)[0],
      log_pos = find_log_pos(log_data, log_id),
      log_info = expand_info.log || expand_info.extend_info || expand_info

  if (!log_to_expand[5]) {
    log_to_expand.push(log_info)
  }
  
  log_data[log_pos] = log_to_expand

  return log_data
}

const set_expand_state = (log_data, expand_state) => {
  if (log_data === undefined) {
    return 'none'
  } else {

    switch (log_data) {
      case 0:
        return 'none'

      case 1:
        if (expand_state === 'none') {
          return false
        } else if (typeof expand_state == 'boolean') {
          return expand_state
        }
        break;

      default:
        break;
    }
  }
}
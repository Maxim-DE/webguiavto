export const syslog_handle_expand = (expand_info, log_data) => {
  let log_num = expand_info.log_num,
      log_to_expand = log_data[log_num-1],
      log_info = expand_info.extend_info

  log_to_expand.push(log_info)
  log_data[log_num - 1] = log_to_expand

  return log_data
}
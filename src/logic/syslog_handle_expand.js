import { status_colors } from '../components/graph_blocks';
import { reducers } from '../store/reducers/calib_forms_reducers';
import { LabelReplaceText } from '../components/status_logs_block';

const find_log_pos = (log_data, log_id) => {
  for (let log = 0; log < log_data.length; log++) {
    if (log_data[log][0] == log_id) {
      return log
    }
  }
}

export const set_logs_id = (log_data) => {
  if (!log_data) return {}

  for (let log = 0; log < log_data.length; log++) {
    let log_item = log_data[log],
        log_unique_id = `f${(~~(Math.random()*1e8)).toString(16)}`
    
    log_item[log_item.length + 1] = log_unique_id
  }

  return log_data
}

export const syslog_handle_expand = (expand_info, log_data, log_id) => {
  let log_num = Number(log_id),
      log_to_expand = log_data.filter(log => log[0] == log_num)[0],
      log_pos = find_log_pos(log_data, log_id),
      log_info = expand_info.log || expand_info.extend_info || expand_info

  if (!log_to_expand[6]) {
    log_to_expand[6] = log_info
  }
  
  log_data[log_pos] = log_to_expand

  return log_data
}

export const handle_logExpand_request = (update_handler, log_type, log_num, expand_bool) => {
  let request_obj

  if (expand_bool) {
    request_obj = {
      address: 'get_expanded_log.cgi',
      data: `${log_type}$1;log_num$${log_num}`,
      reducer: reducers.get_expanded_syslog,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }
  }

  update_handler(request_obj)
}

export const set_expand_state = (log_data, expand_state) => {
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

export function set_expand_value_status(status) {
  let style_obj = {}

  if (status != 0) {
    style_obj.fontWeight = '500'
    style_obj.color = status_colors[status]
  } else {
    style_obj.fontWeight = '400'
    style_obj.color = '#202020'
  }

  return style_obj
}

export function param_label_translate(label, LabelReplaceText) {
  if (Object.hasOwn(LabelReplaceText, label)) {
    return LabelReplaceText[label]
  } else {
    return label
  }
}
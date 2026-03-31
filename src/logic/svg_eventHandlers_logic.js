import { reducers } from "../store/reducers/status_settings_reducers"
import { filter_obj } from "./utilites"

export default function svg_eventHandler_logic(svg, data_svg, device_type, clickHandler) {
  switch (true) {

    case (device_type == "УРЦ-2000" || 
          device_type == "УСТ-500"):
      return re_amp_svg_event_editing(svg, data_svg, clickHandler)

    case (device_type == "СТ-1000" || 
          device_type == "РЦ-4000"):
      return re_amp_svg_event_editing(svg, data_svg)

    case (device_type == "АВР-1000"):
      return avr_svg_event_editing(svg, clickHandler)
  
    default:
      return svg
  }
}

function re_amp_svg_event_editing(svg, data_svg, clickHandler) {

  const output_buttons_list = svg.querySelectorAll(`#output g[id$="button"]`)

  output_buttons_list.forEach(button => {
    let button_callback = re_amp_buttons_actions[button.id.replace('_button', '')]

    if (!button.onclick) {
      button.addEventListener("click", function () {
        button_callback(clickHandler)
      })
    }
  })

  return svg
}

function avr_svg_event_editing(svg, clickHandler) {

  const pwr_buttons_list = svg.querySelectorAll(`g[id$="power_button"]`)

  if (pwr_buttons_list) {
    const power_handling_callback = avr_buttons_actions.status_settings_handler
    pwr_buttons_list.forEach(button => {
      const device_type = button.id.replace(`_power_button`, '')

      if (!button.onclick) {
        button.addEventListener("click", function () {
          power_handling_callback(device_type, "supply", clickHandler)
        })
      }
    });
  }

  const res_exiter_conf_buttons_list = svg.querySelectorAll(`#exiter_0 g[id*="set_ex"]`)

  if (res_exiter_conf_buttons_list) {
    const res_handling_callback = avr_buttons_actions.set_ex_conf_handler

    res_exiter_conf_buttons_list.forEach(button => {
      const target_device_regex = /ex\d+/,
            target_device_index = button.id.match(target_device_regex)[0].replace('ex', '');

      if (!button.onclick) {
        button.addEventListener("click", function () {
          res_handling_callback(target_device_index, clickHandler)
        })
      }
    });

  }

  return svg
}

const re_amp_buttons_actions = {
  output_plus_val: (clickHandler) => {
    const request_obj = {
      address: 'status_output.cgi',
      data: `plus$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  },
  output_minus_val: (clickHandler) => {
    const request_obj = {
      address: 'status_output.cgi',
      data: `minus$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  },
  output_save_val: (clickHandler) => {
    const request_obj = {
      address: 'status_output.cgi',
      data: `save$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  },
}

const avr_buttons_actions = {
  status_settings_handler: (device_type, action, clickHandler) => {
    const request_obj = {
      address: 'status_graph_settings.cgi',
      data: `${device_type}$1;${action}$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  },

  set_ex_conf_handler: (device_type, clickHandler) => {
    const request_obj = {
      address: 'status_graph_settings.cgi',
      data: `set_ex_conf$${device_type}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      reducer: reducers.transmitter,
    }

    clickHandler(request_obj)
  },

  // switch_test_signal_mode: (signal_mode, clickHandler) => {
  //   const request_obj = {
  //     address: 'status_graph_settings.cgi',
  //     data: `set_test_signal_mode$${signal_mode}`,
  //     notifications: {
  //       good: 'default',
  //       bad: 'default'
  //     },
  //   }

  //   clickHandler(request_obj)
  // },

  switch_input_mode: (device_index, clickHandler) => {
    const request_obj = {
      address: 'status_graph_settings.cgi',
      data: `switch_input_mode$${device_index}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }
}
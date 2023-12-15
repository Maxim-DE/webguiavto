import { reducers } from "../store/reducers/status_settings_reducers"
import { filter_obj } from "./utilites"

export default function svg_eventHandler_logic(svg, data_svg, device_type, clickHandler) {
  switch (true) {

    case (device_type == "УРЦ-2000" || 
          device_type == "УСТ-500"):
      return re_amp_svg_event_editing(svg, data_svg, clickHandler)

    case (device_type == "СТ-1000" || 
          device_type == "РЦ-4000"):
      return block_control_svg_event_editing(svg, data_svg, clickHandler)
  
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

function block_control_svg_event_editing(svg, data_svg, clickHandler) {

  const exiter_buttons_list = svg.querySelectorAll(`#exiter g[id$="control_buttons"] g[id$="button"]`),
        amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
        amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`),
        exiter_pwr_button = svg.querySelector(`#exiter g#exiter_power_button`)

  

  exiter_buttons_list.forEach(button => {
    const pwr_handling_callback = block_control_buttons_actions.plusMinusHandler,
          pwr_save_callback = block_control_buttons_actions.save_power_handler

    if (!button.onclick) {
      if (button.id.includes("save_val")){
        button.addEventListener("click", function () {
          pwr_save_callback(clickHandler)
        })
      } else {
        const action_type = button.id.replace("exiter_", '').replace("_val_button", '')
        button.addEventListener("click", function () {
          pwr_handling_callback(action_type, clickHandler)
        })
      }
    }
  })

  const supply_handling_callback = block_control_buttons_actions.supply_handler

  if (amp_1_buttons_list) amp_1_buttons_list.forEach(button => {
    const voltage_handling_callback = block_control_buttons_actions.status_settings_handler,
          button_params = button.id.replace('_val_button', '').split("_"),
          action_type = button_params[button_params.length - 1],
          device_type = button.id.replace(`_${action_type}_val_button`, '')

    if (!button.onclick) {
      button.addEventListener("click", function () {
        voltage_handling_callback(device_type, action_type, clickHandler)
      })
    }
  })

  if (amp_2_buttons_list) amp_2_buttons_list.forEach(button => {
    const voltage_handling_callback = block_control_buttons_actions.status_settings_handler,
          button_params = button.id.replace('_val_button', '').split("_"),
          action_type = button_params[button_params.length - 1],
          device_type = button.id.replace(`_${action_type}_val_button`, '')

    if (!button.onclick) {
      button.addEventListener("click", function () {
        voltage_handling_callback(device_type, action_type, clickHandler)
      })
    }
  })
        
  exiter_pwr_button.addEventListener("click", function () {
    supply_handling_callback(clickHandler)
  })

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

const block_control_buttons_actions = {
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

  supply_handler: (clickHandler) => {
    const request_obj = {
      address: 'status_graph_settings.cgi',
      data: `exiter$1;supply$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      reducer: reducers.transmitter,
    }

    clickHandler(request_obj)
  },

  plusMinusHandler: (action_type, clickHandler) => {
    const name = action_type

    let output_string = `power_${name}$0`

    const request_obj = {
      address: 'transmitter.cgi',
      data: output_string,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    clickHandler(request_obj)
  },

  save_power_handler: (clickHandler) => {
    const request_obj = {
      address: 'transmitter.cgi',
      data: `save_power$1`,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }
}
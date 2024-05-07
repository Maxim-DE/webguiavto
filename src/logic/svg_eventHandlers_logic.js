import { reducers } from "../store/reducers/status_settings_reducers"
import { SVG_inputElement } from "./svg_inputHandling_logic"
import { filter_obj, makeSVG, numberOfCharactersAfter } from "./utilites"

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
        exiter_pwr_button = svg.querySelector(`#exiter g#exiter_power_button`),
        exiter_input_list = svg.querySelectorAll(`#exiter g[id*="val_wrap"]`),
        ping_input_list = svg.querySelectorAll(`g[id*="check_amp_network"]`)

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

  if (exiter_input_list.length > 0) exiter_input_list.forEach(input_wrap => {
    let inner_text = input_wrap.childNodes[0].firstChild

    const svg_input_class = new SVG_inputElement()

    const input_describe_arr = input_wrap.id.split("_"),
          input_id = `${input_describe_arr[0]}_${input_describe_arr[1]}_${input_describe_arr[2]}_input`,
          input_action_type = `${input_describe_arr[1]}_${input_describe_arr[2]}`

    let input_params = {}

    if (input_action_type.includes("freq")) {
      input_params = {
        label_l_offset: 94,
        label_h_offset: 15,
        styles: {
          width: "60px",
          height: "19px",
          fontSize: "14px",
          textAlign: "right",
        },
        label: "МГц"
      }
    } else if (input_action_type.includes("channel")) {
      input_params = {
        label_l_offset: 37,
        label_h_offset: 14,
        styles: {
          width: "40px",
          height: "19px",
          fontSize: "14px",
          textAlign: "right",
        },
        label: ""
      }
    }

    var el = inner_text,
    x = el.getAttribute('x'),
    y = el.getAttribute('y')

    let text_input = svg_input_class.createInputElement(x - input_params.label_l_offset, y - input_params.label_h_offset, "text", {
      id: `${input_id}_text`
    }, input_params.styles, "", input_params.label, function (input_value) {

      const multiplier_power = numberOfCharactersAfter(input_value)

      const output_string = `set_${input_action_type}$${input_value * Math.pow(10, multiplier_power)}`

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
    })

    input_wrap.append(text_input)
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

  if (ping_input_list) ping_input_list.forEach(button => {
    const ping_dest_device = button.id.replace('_check_amp_network_button', '')

    if (!button.onclick) {
      button.addEventListener("click", function () {
        block_control_buttons_actions.network_ping_handler(ping_dest_device, clickHandler)
      })
    }
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
  },

  network_ping_handler: (dest_device, clickHandler) => {
    const request_obj = {
      address: 'status_graph_settings.cgi',
      data: `${dest_device}$1;ping$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  }
}
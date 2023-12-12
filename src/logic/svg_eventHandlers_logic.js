import { filter_obj } from "./utilites"

export default function svg_eventHandler_logic(svg, data_svg, device_type, clickHandler) {
  switch (true) {

    case (device_type == "УРЦ-2000" || 
          device_type == "УСТ-500"):
      return re_amp_svg_event_editing(svg, data_svg, clickHandler)

    case (device_type == "СТ-1000" || 
          device_type == "РЦ-4000"):
      return re_amp_svg_event_editing(svg, data_svg)
  
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
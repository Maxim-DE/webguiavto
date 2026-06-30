import { reducers } from "../store/reducers/status_settings_reducers"
import { SVG_inputElement } from "./svg_inputHandling_logic"
import { filter_obj, makeSVG, numberOfCharactersAfter } from "./utilites"

export default function svg_eventHandler_logic(svg, data_svg, device_type, is_exist_avr, active_control_mode, clickHandler) {
  switch (true) {

    case (device_type == "УРЦ-2000" || 
          device_type == "УСТ-500"):
      return re_amp_svg_event_editing(svg, data_svg, clickHandler)             
    case (device_type == "СТ-1000"):
      return block_control_svg_event_editing(svg, data_svg, clickHandler)      

    case (device_type == "РЦ-4000"):
      if(is_exist_avr == 1){
        return block_control_avr_svg_event_editing(svg, data_svg, active_control_mode, clickHandler)
      }
      if(is_exist_avr == 0){
        return block_control_svg_event_editing(svg, data_svg, clickHandler) 
      }
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


function block_control_avr_svg_event_editing(svg, data_svg, active_control_mode, clickHandler) {

  const cap_buttons_list = svg.querySelectorAll(`#cap g[id$="control_buttons"] g[id$="button"]`),
        exiter_1_buttons_list = svg.querySelectorAll(`#exiter_1 g[id$="control_buttons"] g[id$="button"]`),
        exiter_2_buttons_list = svg.querySelectorAll(`#exiter_2 g[id$="control_buttons"] g[id$="button"]`),
        amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
        amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`),
        exiter_1_pwr_button = svg.querySelector(`#exiter_1 g#exiter_1_power_button`),
        exiter_2_pwr_button = svg.querySelector(`#exiter_2 g#exiter_2_power_button`),
        exiter_1_input_list = svg.querySelectorAll(`#exiter_1 g[id*="val_wrap"]`),
        exiter_2_input_list = svg.querySelectorAll(`#exiter_2 g[id*="val_wrap"]`),
        ping_input_list = svg.querySelectorAll(`g[id*="check_amp_network"]`),
        output_buttons_list = svg.querySelectorAll(`#output g[id$="button"]`)
      
  // Функция для создания запроса
  const create_CAPModeRequest = (mode_num, clickHandler) => {
    const request_obj = {
      address: `set_cap_control_mode.cgi`,
      data: `mode$${Number(mode_num)};`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }
    clickHandler(request_obj)
  }

  // Функция для подсветки активного режима на SVG
  const setActiveCAPModeOnSVG = (active_mode) => {
    if (!cap_buttons_list || cap_buttons_list.length === 0) return
    
    console.log('setActiveCAPModeOnSVG called with:', active_mode)
    
    cap_buttons_list.forEach(button => {
      const mode_num = button.getAttribute('data-mode') || 
                      (button.id.includes('auto') ? 0 : 1)
      
      // Находим все графические элементы внутри кнопки
      const rects = button.querySelectorAll('rect')
      
      if (Number(mode_num) === Number(active_mode)) {
        // Активная кнопка - закрашиваем в зеленый
        rects.forEach(rect => {
          rect.setAttribute('fill', '#abe188')
          rect.setAttribute('fill-opacity', '1')
        })
        button.style.opacity = '1'
        button.style.filter = 'brightness(1)'
      } else {
        // Неактивная кнопка - возвращаем исходный цвет
        rects.forEach(rect => {
          rect.removeAttribute('fill')
          rect.removeAttribute('fill-opacity')
        })
        button.style.opacity = '0.5'
        button.style.filter = 'brightness(0.7)'
      }
    })
  }

  // Обработчик кликов для SVG кнопок CAP
  const handle_CAPModeChange = (event, clickHandler) => {
    const target = event.currentTarget,
          mode_num = target.getAttribute('data-mode') || 
                     (target.id.includes('auto') ? 0 : 1)
    
    if (mode_num !== null && mode_num !== undefined) {
      create_CAPModeRequest(mode_num, clickHandler)
      // Обновляем подсветку после клика
      setActiveCAPModeOnSVG(Number(mode_num))
    }
  }

  // Инициализация обработчиков для CAP кнопок
  if (cap_buttons_list && cap_buttons_list.length > 0) {
    cap_buttons_list.forEach(button => {
      if (!button.onclick) {
        button.addEventListener("click", function(event) {
          handle_CAPModeChange(event, clickHandler)
        })
        button.style.cursor = 'pointer'
      }
    })
    
    // НАЧАЛЬНАЯ ПОДСВЕТКА - используем active_control_mode из параметров
    console.log('Initial active_control_mode:', active_control_mode)
    if (active_control_mode !== undefined && active_control_mode !== null) {
      setActiveCAPModeOnSVG(active_control_mode)
    } else {
      setActiveCAPModeOnSVG(0)
    }
  }

  // Обработчики для exiter кнопок
  exiter_1_buttons_list.forEach(button => {
    const pwr_handling_callback = block_control_buttons_actions.plusMinusHandler_1,
          pwr_save_callback = block_control_buttons_actions.save_power_handler_1

    if (!button.onclick) {
      if (button.id.includes("save_val")){
        button.addEventListener("click", function () {
          pwr_save_callback(clickHandler)
        })
      } else {
        const action_type = button.id.replace("exiter_1", '').replace("_val_button", '')
        button.addEventListener("click", function () {
          pwr_handling_callback(action_type, clickHandler)
        })
      }
    }
  })

  exiter_2_buttons_list.forEach(button => {
    const pwr_handling_callback_1 = block_control_buttons_actions.plusMinusHandler_2,
          pwr_save_callback = block_control_buttons_actions.save_power_handler_2

    if (!button.onclick) {
      if (button.id.includes("save_val")){
        button.addEventListener("click", function () {
          pwr_save_callback(clickHandler)
        })
      } else {
        const action_type = button.id.replace("exiter_2", '').replace("_val_button", '')
        button.addEventListener("click", function () {
          pwr_handling_callback_1(action_type, clickHandler)
        })
      }
    }
  })

  // Обработчики для input полей
  if (exiter_1_input_list.length > 0) exiter_1_input_list.forEach(input_wrap => {

    // Находим элемент text среди дочерних узлов
    let inner_text = null;
    for (let i = 0; i < input_wrap.childNodes.length; i++) {
        const node = input_wrap.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'text') {
            inner_text = node;
            break;
        }
    }
    
    if (!inner_text) {
        console.error('Text element not found in', input_wrap);
        return;
    }

    // Проверяем наличие firstChild перед получением атрибутов
    if (!inner_text.firstChild) {
        console.error('firstChild not found in text element');
        return;
    }
    
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

    // Получаем координаты из tspan (firstChild), а не из самого text
    let x = null, y = null;
    
    // Пробуем получить координаты из tspan
    if (inner_text.firstChild && inner_text.firstChild.getAttribute) {
        x = inner_text.firstChild.getAttribute('x');
        y = inner_text.firstChild.getAttribute('y');
    }
    
    // Если в tspan нет координат, пробуем получить из самого text
    if ((!x || !y) && inner_text.getAttribute) {
        x = inner_text.getAttribute('x');
        y = inner_text.getAttribute('y');
    }
    
    // Проверяем, что координаты получены
    if (!x || !y) {
        console.error('Could not get coordinates from text element or tspan');
        return;
    }
    
    let text_input = svg_input_class.createInputElement(parseFloat(x) - input_params.label_l_offset, parseFloat(y) - input_params.label_h_offset, "text", {
      id: `${input_id}_text`
    }, input_params.styles, "", input_params.label, function (input_value) {

      const multiplier_power = numberOfCharactersAfter(input_value),
            result_value = input_value * Math.pow(10, multiplier_power)

      const output_string = `set_${input_action_type}$${result_value.toFixed(0)}`

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

    if (exiter_2_input_list.length > 0) exiter_2_input_list.forEach(input_wrap => {

    // Находим элемент text среди дочерних узлов
    let inner_text = null;
    for (let i = 0; i < input_wrap.childNodes.length; i++) {
        const node = input_wrap.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'text') {
            inner_text = node;
            break;
        }
    }
    
    if (!inner_text) {
        console.error('Text element not found in', input_wrap);
        return;
    }

    // Проверяем наличие firstChild перед получением атрибутов
    if (!inner_text.firstChild) {
        console.error('firstChild not found in text element');
        return;
    }
    
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

    // Получаем координаты из tspan (firstChild), а не из самого text
    let x = null, y = null;
    
    // Пробуем получить координаты из tspan
    if (inner_text.firstChild && inner_text.firstChild.getAttribute) {
        x = inner_text.firstChild.getAttribute('x');
        y = inner_text.firstChild.getAttribute('y');
    }
    
    // Если в tspan нет координат, пробуем получить из самого text
    if ((!x || !y) && inner_text.getAttribute) {
        x = inner_text.getAttribute('x');
        y = inner_text.getAttribute('y');
    }
    
    // Проверяем, что координаты получены
    if (!x || !y) {
        console.error('Could not get coordinates from text element or tspan');
        return;
    }
    
    let text_input = svg_input_class.createInputElement(parseFloat(x) - input_params.label_l_offset, parseFloat(y) - input_params.label_h_offset, "text", {
      id: `${input_id}_text`
    }, input_params.styles, "", input_params.label, function (input_value) {

      const multiplier_power = numberOfCharactersAfter(input_value),
            result_value = input_value * Math.pow(10, multiplier_power)

      const output_string = `set_${input_action_type}$${result_value.toFixed(0)}`

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

  const supply_handling_callback_1 = block_control_buttons_actions.supply_handler_1
  const supply_handling_callback_2 = block_control_buttons_actions.supply_handler_2

    // console.log('supply_handling_callback',supply_handling_callback)
    // console.log('______________________________________--')
  // Обработчики для amp_1 кнопок
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

  // Обработчики для amp_2 кнопок
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
  
  // Обработчики для output кнопок
  output_buttons_list.forEach(button => {
    let button_callback = re_amp_buttons_actions[button.id.replace('_button', '')]

    if (!button.onclick) {
      button.addEventListener("click", function () {
        button_callback(clickHandler)
      })
    }
  })
        
  // Обработчик для exiter_1_pwr кнопки
  if (exiter_1_pwr_button) {
    exiter_1_pwr_button.addEventListener("click", function () {
      supply_handling_callback_1(clickHandler)
    })
  }

  if (exiter_2_pwr_button) {
    exiter_2_pwr_button.addEventListener("click", function () {
      supply_handling_callback_2(clickHandler)
    })
  }

  // Обработчики для ping кнопок
  if (ping_input_list) ping_input_list.forEach(button => {
    const ping_dest_device = button.id.replace('_check_amp_network_button', '')

    if (!button.onclick) {
      button.addEventListener("click", function () {
        block_control_buttons_actions.network_ping_handler(ping_dest_device, clickHandler)
      })
    }
  })
  
  const primary_input_blocks_list = svg.querySelectorAll('#layer_1 > g[id*="input"]:not(g[id*="input_0"])')

  if (primary_input_blocks_list) {
    const input_mode_handling_callback = avr_buttons_actions.switch_input_mode
    
    primary_input_blocks_list.forEach((block, index) => {
      const input_mode_switch = block.querySelector('g[id*="mode_switch"]')
  
      if (!input_mode_switch.onclick) {
        input_mode_switch.addEventListener("click", function () {
          input_mode_handling_callback(index, clickHandler)
        })
      }
    })
  }
  
  return svg
}

const avr_buttons_actions = {
  switch_input_mode: (device_index, clickHandler) => {
    const request_obj = {
      address: 'switch_input_sound.cgi',
      data: `switch_input_mode$${device_index}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }
    clickHandler(request_obj)
  }
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
    supply_handler_1: (clickHandler) => {
    const request_obj = {
      address: 'radio_exiter_control.cgi',
      data: `exiter_1$1;supply$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      reducer: reducers.transmitter,
    }

    clickHandler(request_obj)
  },
    supply_handler_2: (clickHandler) => {
    const request_obj = {
      address: 'radio_exiter_control.cgi',
      data: `exiter_2$1;supply$1`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      reducer: reducers.transmitter,
    }

    clickHandler(request_obj)
  },

  plusMinusHandler_1: (action_type, clickHandler) => {
    const name = action_type

    let output_string = `exiter_main_power${name}$0`

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

    plusMinusHandler_2: (action_type, clickHandler) => {
    const name = action_type

    let output_string = `exiter_res_power${name}$0`

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

  save_power_handler_1: (clickHandler) => {
    const request_obj = {
      address: 'transmitter.cgi',
      data: `exiter_main_save_power$1`,
      reducer: reducers.transmitter,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj)
  },

    save_power_handler_2: (clickHandler) => {
    const request_obj = {
      address: 'transmitter.cgi',
      data: `exiter_res_save_power$1`,
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

// без авр(САР)
function block_control_svg_event_editing(svg, data_svg, clickHandler) {

  const exiter_buttons_list = svg.querySelectorAll(`#exiter g[id$="control_buttons"] g[id$="button"]`),
        amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
        amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`),
        exiter_pwr_button = svg.querySelector(`#exiter g#exiter_power_button`),
        exiter_input_list = svg.querySelectorAll(`#exiter g[id*="val_wrap"]`),
        ping_input_list = svg.querySelectorAll(`g[id*="check_amp_network"]`),
        output_buttons_list = svg.querySelectorAll(`#output g[id$="button"]`),
        cap_buttons_list = svg.querySelectorAll(`#cap g[id$="control_buttons"] g[id$="button"]`)

  exiter_buttons_list.forEach(button => {
    const pwr_handling_callback = block_control_buttons_actions.plusMinusHandler_1,
          pwr_save_callback = block_control_buttons_actions.save_power_handler_1

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
    
    // Находим элемент text среди дочерних узлов
    let inner_text = null;
    for (let i = 0; i < input_wrap.childNodes.length; i++) {
        const node = input_wrap.childNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'text') {
            inner_text = node;
            break;
        }
    }
    
    if (!inner_text) {
        console.error('Text element not found in', input_wrap);
        return;
    }

    // Проверяем наличие firstChild перед получением атрибутов
    if (!inner_text.firstChild) {
        console.error('firstChild not found in text element');
        return;
    }
    
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

    // Получаем координаты из tspan (firstChild), а не из самого text
    let x = null, y = null;
    
    // Пробуем получить координаты из tspan
    if (inner_text.firstChild && inner_text.firstChild.getAttribute) {
        x = inner_text.firstChild.getAttribute('x');
        y = inner_text.firstChild.getAttribute('y');
    }
    
    // Если в tspan нет координат, пробуем получить из самого text
    if ((!x || !y) && inner_text.getAttribute) {
        x = inner_text.getAttribute('x');
        y = inner_text.getAttribute('y');
    }
    
    // Проверяем, что координаты получены
    if (!x || !y) {
        console.error('Could not get coordinates from text element or tspan');
        return;
    }
    
    let text_input = svg_input_class.createInputElement(parseFloat(x) - input_params.label_l_offset, parseFloat(y) - input_params.label_h_offset, "text", {
      id: `${input_id}_text`
    }, input_params.styles, "", input_params.label, function (input_value) {

      const multiplier_power = numberOfCharactersAfter(input_value),
            result_value = input_value * Math.pow(10, multiplier_power)

      const output_string = `set_${input_action_type}$${result_value.toFixed(0)}`

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
  

  output_buttons_list.forEach(button => {
    let button_callback = re_amp_buttons_actions[button.id.replace('_button', '')]

    if (!button.onclick) {
      button.addEventListener("click", function () {
        button_callback(clickHandler)
      })
    }
  })
        
  if (exiter_pwr_button) {
    exiter_pwr_button.addEventListener("click", function () {
      supply_handling_callback(clickHandler)
    })
  }

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
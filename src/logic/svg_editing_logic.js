import { status_colors } from "../components/graph_blocks"
import { filter_obj } from "./utilites"
import { store } from "../store/store"

export default function svg_editing_logic(svg, data_svg, device_type, is_exist_avr, clickHandler, auth_access) {
  switch (true) {
    case device_type == 'st_250':
      return st_250_svg_editing(svg, data_svg)

    case (device_type == "УРЦ-2000" || 
          device_type == "УСТ-500"):
      return re_amp_svg_editing(svg, data_svg)

    case (device_type == "СТ-1000"):
      return block_control_svg_editing(svg, data_svg, auth_access)      

    case (device_type == "РЦ-4000"):
      if(is_exist_avr==1){
        return block_control_avr_svg_editing(svg, data_svg, auth_access,clickHandler)
      }
      if(is_exist_avr==0){
        return block_control_svg_editing(svg, data_svg, auth_access)
      }
  
    default:
      return svg
  }
}

function st_250_svg_editing(svg, data_svg) {
  const amplifier_data = {
    amplifier_1: data_svg.amplifier_1,
    amplifier_2: data_svg.amplifier_2
  }

  const output_data = data_svg.output

  for (const key in amplifier_data) {
    let amp_current_data = filter_obj(amplifier_data[key], (key, values) => key.includes('current'))

    let current_1_group = svg.querySelector(`#${key}_current1_value`),
        current_2_group = svg.querySelector(`#${key}_current2_value`),
        svg_rect = svg.querySelector(`#${key} > rect`)

    if (current_2_group === null) continue

    if (Object.keys(amp_current_data).length < 2) {
      current_2_group.parentNode.style.display = 'none'

      if (key === 'amplifier_2') {
        svg.querySelector(`#${key}_current1_label`).innerHTML = 'Ток 2'
      }

      const rect_height = svg_rect.height.baseVal.value
      if (rect_height > 134) {
        svg_rect.setAttribute('height',rect_height - 21)
      }

    } else {
      current_2_group.parentNode.style.display = ''

      if (key === 'amplifier_2') {
        svg.querySelector(`#${key}_current1_label`).innerHTML = 'Ток 3'
        svg.querySelector(`#${key}_current2_label`).innerHTML = 'Ток 4'
      }

      const rect_height = svg_rect.height.baseVal.value
      if (rect_height < 154) {
        svg_rect.setAttribute('height',rect_height + 21)
      }
    }
  }

  let ballast_group = svg.querySelector(`#output_ballast_value`),
      output_svg_rect = svg.querySelector(`#output > rect`)


  if (ballast_group === null) return svg

  if (!Object.prototype.hasOwnProperty.call(output_data, 'ballast')) {
    ballast_group.parentNode.style.display = 'none'

    const rect_height = Math.round(output_svg_rect.height.baseVal.value)
    if (rect_height > 112) {
      output_svg_rect.setAttribute('height',rect_height - 18)
    }
  } else {
    ballast_group.parentNode.style.display = ''

    const rect_height = output_svg_rect.height.baseVal.value
    if (rect_height < 130) {
      output_svg_rect.setAttribute('height',rect_height + 18)
    }
  }

  return svg
}

function re_amp_svg_editing(svg, data_svg, auth_access) {
  const output_data = data_svg?.output,
        output_svg_list = svg.querySelectorAll(`text[id*="swr_value"]`)

  output_svg_list.forEach(output_svg => {
    try {
      if (output_data.swr[2] == 3 && output_svg != undefined) {
        output_svg.children[0].innerHTML = '--'
        output_svg.children[0].style.fill = '#202020';
        output_svg.children[0].style.fontWeight = "300";
      }
    } catch (error) {
      console.log(`Произошла ошибка при обработке данных картинки: ${error}`);
    }
  });

  return svg
}
// меняй здесь !!!
function block_control_avr_svg_editing(svg, data_svg, auth_access,clickHandler) {

  const exiter_1_buttons_list = svg.querySelectorAll(`#exiter_1 g[id$="control_buttons"] g[id$="button"]`),
        exiter_2_buttons_list = svg.querySelectorAll(`#exiter_2 g[id$="control_buttons"] g[id$="button"]`),
        amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
        amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`),
        exiter_1_input_list = svg.querySelectorAll(`#exiter_1 g[id*="val_wrap"]`),
        exiter_2_input_list = svg.querySelectorAll(`#exiter_2 g[id*="val_wrap"]`),
        ping_input_list = svg.querySelectorAll(`g[id*="check_amp_network"]`),
        output_buttons_list = svg.querySelectorAll(`#output g[id$="button"]`),
        cap_buttons_list = svg.querySelectorAll(`#cap g[id$="control_buttons"] g[id$="button"]`)

  // Функция для подсветки активного режима CAP
  const setActiveCAPModeOnSVG = (active_control_mode) => {
    if (!cap_buttons_list || cap_buttons_list.length === 0) return
    
    cap_buttons_list.forEach(button => {
      const mode_num = button.getAttribute('data-mode') || 
                      (button.id.includes('auto') ? 0 : 1)
      
      const rects = button.querySelectorAll('rect')
      
      if (Number(mode_num) === Number(active_control_mode)) {
        rects.forEach(rect => {
          rect.setAttribute('fill', '#abe188')
          rect.setAttribute('fill-opacity', '1')
        })
        button.style.opacity = '1'
        button.style.filter = 'brightness(1)'
      } else {
        rects.forEach(rect => {
          rect.removeAttribute('fill')
          rect.removeAttribute('fill-opacity')
        })
        button.style.opacity = '0.5'
        button.style.filter = 'brightness(0.7)'
      }
    })
  }
  

 const temp_group_list = svg.querySelector(`#cap g#cap_temp`)
const exiter_type = data_svg?.cap?.input_exiter_type

if (temp_group_list) {
  const groups = temp_group_list.querySelectorAll('g')
  groups.forEach(group => {
    group.style.visibility = "hidden"
  })
  
  switch (exiter_type) {
    case 0:
      const mainGroup = temp_group_list.querySelector('g[id*="main"]')
      if (mainGroup) mainGroup.style.visibility = "visible"
      break;
    case 1:
      const resGroup = temp_group_list.querySelector('g[id*="res"]')
      if (resGroup) resGroup.style.visibility = "visible"
      break;    
    default:
      break;
  }
}

  // Получаем активный режим из data_svg.cap
  const active_control_mode = data_svg?.cap?.active_control_mode
  const auth_level = store.getState().authStore.auth_data.auth_level
  // Применяем подсветку для CAP кнопок
  if (cap_buttons_list && cap_buttons_list.length > 0 && active_control_mode !== undefined) {
    setActiveCAPModeOnSVG(active_control_mode)
  }
        
  if (amp_1_buttons_list) {
    amp_1_buttons_list.forEach((button) => {
      if(active_control_mode !== undefined) {
        if (auth_level < 2 || active_control_mode == 0) {
          button.classList.add("disabled_svg_button");
          button.style.opacity = "0.5";
          button.style.pointerEvents = "none";
        } else {
          button.classList.remove("disabled_svg_button");
          button.style.opacity = "";
          button.style.pointerEvents = "";
        }
      }
    })
  }

  if (cap_buttons_list) {
    cap_buttons_list.forEach((button) => {
      if (auth_level < 1) {
        button.classList.add("disabled_svg_button");
        button.style.opacity = "0.5";
        button.style.pointerEvents = "none";
      } else {
        button.classList.remove("disabled_svg_button");
        button.style.opacity = "";
        button.style.pointerEvents = "";
      }
    })
  }

  if (amp_2_buttons_list) {
    amp_2_buttons_list.forEach((button) => {
      if(active_control_mode !== undefined) {
        if (auth_level < 2 || active_control_mode == 0) {
          button.classList.add("disabled_svg_button");
          button.style.opacity = "0.5";
          button.style.pointerEvents = "none";
        } else {
          button.classList.remove("disabled_svg_button");
          button.style.opacity = "";
          button.style.pointerEvents = "";
        }
      }
    })
  }

  if (output_buttons_list) {
    output_buttons_list.forEach((button) => {
       if(active_control_mode !== undefined) {
        if (auth_level < 1 || active_control_mode == 0) {
          button.classList.add("disabled_svg_button");
          button.style.opacity = "0.5";
          button.style.pointerEvents = "none";
        } else {
          button.classList.remove("disabled_svg_button");
          button.style.opacity = "";
          button.style.pointerEvents = "";
        }
      }
    })
  }
  const exiter_1_status = data_svg?.exiter_1?.status,
        exiter_2_status = data_svg?.exiter_2?.status

  exiter_1_buttons_list.forEach((button) => {
      if(active_control_mode !== undefined) {
        if (auth_level < 2 || active_control_mode == 0 || exiter_1_status == 0) {
          button.classList.add("disabled_svg_button");
          button.style.opacity = "0.5";
          button.style.pointerEvents = "none";
        } else {
          button.classList.remove("disabled_svg_button");
          button.style.opacity = "";
          button.style.pointerEvents = "";
        }
      }
  })

    exiter_2_buttons_list.forEach((button) => {
      if(active_control_mode !== undefined) {
        if (auth_level < 2 || active_control_mode == 0||exiter_2_status == 0) {
          button.classList.add("disabled_svg_button");
          button.style.opacity = "0.5";
          button.style.pointerEvents = "none";
        } else {
          button.classList.remove("disabled_svg_button");
          button.style.opacity = "";
          button.style.pointerEvents = "";
        }
      }
  })

  const pwr_buttons_list = svg.querySelectorAll(`g[id$="power_button"]`)

  if (pwr_buttons_list) {
    pwr_buttons_list.forEach(button => {
      const device_type = button.id.replace(`_power_button`, ''),
            button_cover = button.querySelector(`path[id*="btn_cover"]`)

      const exiter_status = data_svg?.[device_type]?.status

      // Меняем цвет кнопки в зависимости от статуса питания
      if (exiter_status == 1) {
        button_cover.style.fill = status_colors[0]
      } else {
        button_cover.style.fill = status_colors[2]
      }

      // Убираем любые блокировки с кнопок питания
      button.style.opacity = "";
      button.style.pointerEvents = "";
      button.classList.remove("disabled_svg_button");
      
      // Только скрываем/показываем в зависимости от режима управления и уровня авторизации
      if (active_control_mode == 0 || auth_level < 1) {
        button.style.display = 'none'
      } else {
        button.style.display = ''
      }
    });
  }  

  if (ping_input_list) {
    ping_input_list.forEach((button) => {
      if (auth_access.calib == 0) {
        button.classList.add("disabled_svg_button");
        button.classList.add("invisible");
      } else {
        button.classList.remove("disabled_svg_button");
        button.classList.remove("invisible");
      }
    })
  }

    const primary_input_blocks_list = svg.querySelectorAll('#layer_1 > g[id*="input"]:not(g[id*="input_0"])')

    primary_input_blocks_list.forEach((block, index) => {
      const signal_primary_group_list = block.querySelectorAll('g[id*="primary_secondary_info"] > g[id*="group"]'),
            signal_res_group_list = block.querySelectorAll('g[id*="res_secondary_info"] > g[id*="group"]'),
            signal_type = data_svg[`input_${index+1}`]?.input_signal_type,
            res_signal_type = data_svg[`input_${index+1}`]?.input_res_signal_type

    signal_primary_group_list.forEach(group => {
      group.style = "visibility: hidden"
    })

    switch (signal_type) {
      case "L":
        signal_primary_group_list[0].style = "visibility: visible"
        break;
      case "R":
        signal_primary_group_list[1].style = "visibility: visible"
          break;
      case "STEREO":
        signal_primary_group_list[0].style = "visibility: visible"
        signal_primary_group_list[1].style = "visibility: visible"
        break;
      case "КСС":
        signal_primary_group_list[2].style = "visibility: visible"
        break;
      case "AES":
        signal_primary_group_list[3].style = "visibility: visible"
        signal_primary_group_list[4].style = "visibility: visible"
      break;
      default:
        break;
    }
 
    signal_res_group_list.forEach(group => {
      group.style = "visibility: hidden"
    })

    switch (res_signal_type) {
      case "L":
        signal_res_group_list[0].style = "visibility: visible"
        break;
      case "R":
        signal_res_group_list[1].style = "visibility: visible"
        break;
      case "STEREO":
        signal_res_group_list[0].style = "visibility: visible"
        signal_res_group_list[1].style = "visibility: visible"
        break;
      case "КСС":
        signal_res_group_list[2].style = "visibility: visible"
        break;
      case "AES":
        signal_res_group_list[3].style = "visibility: visible"
        signal_res_group_list[4].style = "visibility: visible"
        break;
      default:
        break;
    }
     const input_switch_button = block.querySelector('g[id*="mode_switch"]')

    if (active_control_mode == 0 || auth_access < 0) {
      input_switch_button.style = "visibility: hidden"
    } else {
      input_switch_button.style = "visibility: visible"
    }

    const switch_background = block.querySelector('path[id*="mode_switch_background"]'),
          input_mode_device_icon = block.querySelectorAll('path[id*="device_icon"]'),
          input_res_path = block.querySelector('path[id*="reserve_path"]'),
          input_primary_path = block.querySelector('path[id*="primary_path"]'),
          input_mode = data_svg[`input_${index + 1}`]?.mode

    if (input_mode == "1") {
      switch_background.style = "fill: #7ADC47"
      input_mode_device_icon[1].style = "fill: #7ADC47"
      input_mode_device_icon[0].style = "fill: #e74c3c"
      input_res_path.style.visibility = 'hidden'
      input_primary_path.style.visibility = "visible"

    } else if (input_mode == "2") {
      switch_background.style = "fill: #e74c3c"
      input_mode_device_icon[1].style = "fill: #e74c3c"
      input_mode_device_icon[0].style = "fill: #7ADC47"
      input_res_path.style.visibility = 'visible'
      input_primary_path.style.visibility = 'hidden'
    } else {
      input_res_path.style.visibility = "hidden"
      input_primary_path.style.visibility = "hidden"
    }

  })

  const current_signal_path = store.getState().globalStore.global_data.status_data.status_info?.current_signal_path
   const signal_paths_list = svg.querySelectorAll(`g[id*="signal_path"]`)
  const input_blocks_list = svg.querySelectorAll('#layer_1 > g[id*="input"]')

  signal_paths_list.forEach(path => {
    path.style.display = 'none'
  })

  const signal_path_layer = svg.querySelector(`g[id*="layer_3"]`),
        signal_path_colors = [
          "#FE5F55",
          "#7D83FF",
          "#6C534E",
          "#0A2463",
          "#F49F0A"
        ]

  if (Array.isArray(current_signal_path)) {
    current_signal_path.forEach((path, index) => {
      handlePathDisplay(signal_path_layer, path, index)
      handlePathColor(signal_path_layer, path, signal_path_colors[index])

      const path_input_descr = path[0],
      required_input = input_blocks_list[path_input_descr]
      if (!required_input) {
        return;
      }
      const input_path_display_list = required_input.querySelectorAll('path[id*="path_display"]')

      input_path_display_list.forEach(path => {
        path.style.stroke = signal_path_colors[index]
      })
    });
  } else {
    handlePathDisplay(signal_path_layer, current_signal_path)
  }

  return svg
}

function block_control_svg_editing(svg, data_svg, auth_access) {
  const output_data = data_svg?.output,
    output_svg_list = svg.querySelectorAll(`text[id*="swr_value"]`)

  output_svg_list.forEach(output_svg => {
    try {
      if (output_data.swr[2] == 3 && output_svg != undefined) {
        output_svg.children[0].innerHTML = '--'
        output_svg.children[0].style.fill = '#202020';
        output_svg.children[0].style.fontWeight = "300";
      }
    } catch (error) {
      console.log(`Произошла ошибка при обработке данных картинки: ${error}`);
    }
  });

  const exiter_buttons_list = svg.querySelectorAll(`#exiter g[id$="control_buttons"] g[id$="button"]`),
        amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
        amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`),
        exiter_input_list = svg.querySelectorAll(`#exiter g[id*="val_wrap"]`),
        ping_input_list = svg.querySelectorAll(`g[id*="check_amp_network"]`),
        output_buttons_list = svg.querySelectorAll(`#output g[id$="button"]`)

  if (amp_1_buttons_list) {
    amp_1_buttons_list.forEach((button) => {
      if (auth_access.calib == 0) {
        button.classList.add("disabled_svg_button");
      } else {
        button.classList.remove("disabled_svg_button");
      }
    })
  }

  if (amp_2_buttons_list) {
    amp_2_buttons_list.forEach((button) => {
      if (auth_access.calib == 0) {
        button.classList.add("disabled_svg_button");
      } else {
        button.classList.remove("disabled_svg_button");
      }
    })
  }

  if (output_buttons_list) {
    output_buttons_list.forEach((button) => {
      if (auth_access.calib == 0) {
        button.classList.add("disabled_svg_button");
      } else {
        button.classList.remove("disabled_svg_button");
      }
    })
  }

  exiter_buttons_list.forEach((button) => {
    if (auth_access.settings == 0) {
      button.classList.add("disabled_svg_button");
    } else {
      button.classList.remove("disabled_svg_button");
    }
  })

  const exiter_pwr_button = svg.querySelector(`#exiter g#exiter_power_button`),
        exiter_status = data_svg?.exiter?.status

  if (exiter_status == 1) {
    exiter_pwr_button.querySelector('#power_btn_cover').style.fill = status_colors[0]
  } else {
    exiter_pwr_button.querySelector('#power_btn_cover').style.fill = status_colors[2]
  }

  if (exiter_input_list.length > 0) exiter_input_list.forEach(input_wrap => {
    let inner_input = input_wrap.querySelector(`input`)

    if (inner_input) {
      if (auth_access.settings == 0) {
        inner_input.disabled = true;
      } else {
        inner_input.disabled = false;
      }
    }
  })

  if (ping_input_list) {
    ping_input_list.forEach((button) => {
      if (auth_access.calib == 0) {
        button.classList.add("disabled_svg_button");
        button.classList.add("invisible");
      } else {
        button.classList.remove("disabled_svg_button");
        button.classList.remove("invisible");
      }
    })
  }

  return svg
}

function handlePathDisplay(signal_paths_list, current_signal_path, index) {
  if (signal_paths_list && current_signal_path) {
    const current_path_str = current_signal_path

    const required_path = signal_paths_list.querySelector(`g[id *= "${current_path_str}"]`)
    if (required_path) {
      required_path.style.display = 'block'
    }
  }
}

function handlePathColor(signal_paths_list, current_signal_path, path_color) {
  if (current_signal_path) {

    const current_path_str = current_signal_path
    const required_path = signal_paths_list.querySelector(`g[id *= "${current_path_str}"]`)
    
    if (required_path) {
      required_path.children[0].style.stroke = path_color
      required_path.children[1].style.stroke = path_color
    }
  }
}
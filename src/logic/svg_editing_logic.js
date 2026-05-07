import React from 'react'
import { status_colors } from "../components/graph_blocks"
import { store } from "../store/store"
import { filter_obj, getRandomColor } from "./utilites"
import useGlobalStore from './auth_store';

export default function svg_editing_logic(svg, data_svg, device_type) {
  switch (device_type) {
    case 'st_250':
      return st_250_svg_editing(svg, data_svg)

    case 'УРЦ-2000':
      return re_amp_svg_editing(svg, data_svg)

    case 'АВР 1+1':
      return avr_svg_editing(svg, data_svg)
  
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
        output_svg = svg.querySelector(`#output_swr_value`)

  try {
    if (output_data.swr[0] == 0 && output_svg != undefined) {
      output_svg.children[0].innerHTML = '--'
      output_svg.children[0].style.fill = '#202020';
      output_svg.children[0].style.fontWeight = "300";
    }
  } catch (error) {
    console.log(`Произошла ошибка при обработке данных картинки: ${error}`);
  }
  

  return svg
}

function avr_svg_editing(svg, data_svg) {
  const active_control_mode = store.getState().globalStore.global_data.status_data.status_info?.active_control_mode,
        current_signal_path = store.getState().globalStore.global_data.status_data.status_info?.current_signal_path
const auth_store = store.getState().authStore.auth_data

const res_exiter_conf_buttons_list = svg.querySelectorAll(`#exiter_0 g[id$="button"]`)

if (res_exiter_conf_buttons_list) {
  const active_conf = data_svg?.exiter_0?.active_conf
  const exiter_status = data_svg?.exiter_0?.status  // Получаем статус питания
  
  res_exiter_conf_buttons_list.forEach(button => {
    if (button.id.includes(`ex${active_conf}`)) {
      button.classList.add("active_ex_conf");
    } else {
      button.classList.remove("active_ex_conf");
    }

    // Проверка на питание и режим управления для кнопок конфигурации
    if (active_control_mode == 0 || exiter_status != 1 || auth_store == 0) {
      button.classList.add("disabled_svg_button");
      button.style.opacity = "0.5";
      button.style.pointerEvents = "none";
    } else {
      button.classList.remove("disabled_svg_button");
      button.style.opacity = "";
      button.style.pointerEvents = "";
    }
  });
}

// Кнопки конфигурации для exiter_1 (основной) - делаем неактивными при отсутствии питания
const main_exiter_conf_buttons_list = svg.querySelectorAll(`#exiter_1 g[id$="button"]`)

if (main_exiter_conf_buttons_list) {
  const active_conf = data_svg?.exiter_1?.active_conf
  const exiter_status = data_svg?.exiter_1?.status  // Получаем статус питания
  
  main_exiter_conf_buttons_list.forEach(button => {
    if (button.id.includes(`ex${active_conf}`)) {
      button.classList.add("active_ex_conf");
    } else {
      button.classList.remove("active_ex_conf");
    }

    // Проверка на питание и режим управления для кнопок конфигурации
    if (active_control_mode == 0 || exiter_status != 1) {
      button.classList.add("disabled_svg_button");
      button.style.opacity = "0.5";
      button.style.pointerEvents = "none";
    } else {
      button.classList.remove("disabled_svg_button");
      button.style.opacity = "";
      button.style.pointerEvents = "";
    }
  });
}

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
    
    // Только скрываем/показываем в зависимости от режима управления
    if (active_control_mode == 0) {
      button.style.display = 'none'
    } else {
      button.style.display = ''
    }
  });
}

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
        // console.log(`Пропускаем path ${index}: required_input не найден для ${path_input_descr}`);
        return; // Переходим к следующей итерации
      }
      // console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\')
      // console.log(path_input_descr)
      // console.log("----------------------------------------------")
      // console.log(input_blocks_list)
      const input_path_display_list = required_input.querySelectorAll('path[id*="path_display"]')

      input_path_display_list.forEach(path => {
        path.style.stroke = signal_path_colors[index]
      })
    });
  } else {
    handlePathDisplay(signal_path_layer, current_signal_path)
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

    if (active_control_mode == 0) {
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
      input_mode_device_icon[0].style = "fill: #e74c3c" // цвет звука 
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
  
  return svg
}

function handlePathDisplay(signal_paths_list, current_signal_path, index) {
  if (signal_paths_list && current_signal_path) {
    const current_path_str = current_signal_path

    const required_path = signal_paths_list.querySelector(`g[id *= "${current_path_str}"]`)
    if (required_path) {
      required_path.style.display = 'block'
  
        // if (index && index > 0) {
        //   const path_color = getRandomColor()
        //   required_path.children[0].style.stroke = path_color
        //   required_path.children[1].style.stroke = path_color
        // }
    }
    // })
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

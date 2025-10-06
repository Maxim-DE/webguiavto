import { status_colors } from "../components/graph_blocks"
import { store } from "../store/store"
import { filter_obj, getRandomColor } from "./utilites"

export default function svg_editing_logic(svg, data_svg, device_type) {
  switch (device_type) {
    case 'st_250':
      return st_250_svg_editing(svg, data_svg)

    case 'УРЦ-2000':
      return re_amp_svg_editing(svg, data_svg)

    case 'АВР-1000':
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

function avr_svg_editing(svg, data_svg, auth_access) {
  const active_control_mode = store.getState().globalStore.global_data.status_data.status_info?.active_control_mode,
        current_signal_path = store.getState().globalStore.global_data.status_data.status_info?.current_signal_path

  const swr_span_list = svg.querySelectorAll(`text[id*="swr_value"]`)

  swr_span_list.forEach(swr_span => {
    const device_type = swr_span.id.replace(`_swr_value`, ''),
          output_data = data_svg[device_type]

    try {
      if (output_data.swr[2] == 3 && swr_span != undefined) {
        swr_span.children[0].innerHTML = '--'
        swr_span.children[0].style.fill = '#202020';
        swr_span.children[0].style.fontWeight = "300";
      }
    } catch (error) {
      console.log(`Произошла ошибка при обработке данных картинки: ${error}`);
    }
  });

  // const exiter_buttons_list = svg.querySelectorAll(`#exiter g[id$="control_buttons"] g[id$="button"]`),
  //       amp_1_buttons_list = svg.querySelectorAll(`#amplifier_group_1 g[id$="control_buttons"] g[id$="button"]`),
  //       amp_2_buttons_list = svg.querySelectorAll(`#amplifier_group_2 g[id$="control_buttons"] g[id$="button"]`)

  const pwr_buttons_list = svg.querySelectorAll(`g[id$="power_button"]`)

  if (pwr_buttons_list) {
    pwr_buttons_list.forEach(button => {
      const device_type = button.id.replace(`_power_button`, ''),
            button_cover = button.querySelector(`path[id*="btn_cover"]`)

      const exiter_status = data_svg?.[device_type]?.status

      if (exiter_status == 1) {
        button_cover.style.fill = status_colors[0]
      } else {
        button_cover.style.fill = status_colors[2]
      }

      if (active_control_mode == 0) {
        button.style.display = 'none'
      } else {
        button.style.display = ''
      }
    });
  }

  const res_exiter_conf_buttons_list = svg.querySelectorAll(`#exiter_0 g[id$="button"]`)

  if (res_exiter_conf_buttons_list) {
    const active_conf = data_svg?.exiter_0?.active_conf
    res_exiter_conf_buttons_list.forEach(button => {
      if (button.id.includes(`ex${active_conf}`)) {
        button.classList.add("active_ex_conf");
      } else {
        button.classList.remove("active_ex_conf");
      }

      if (active_control_mode == 0) {
        button.classList.add("disabled_svg_button");
      } else {
        button.classList.remove("disabled_svg_button");
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

      //primary input display
      input_mode_device_icon[1].style = "fill: #7ADC47"
      input_mode_device_icon[0].style = "fill: #e74c3c"
      //res input display
      // input_mode_device_icon[0].firstElementChild.firstChild.innerHTML = 'ВЫКЛ'
      // input_mode_device_icon[0].lastElementChild.style = "fill: #e74c3c"
        
      // switch_label.innerHTML = 'О'
      input_res_path.style.visibility = 'hidden'
      input_primary_path.style.visibility = "visible"

    } else if (input_mode == "2") {
      switch_background.style = "fill: #e74c3c"

      //primary input display
      input_mode_device_icon[1].style = "fill: #e74c3c"
      input_mode_device_icon[0].style = "fill: #7ADC47"
      //res input display
      // input_mode_status_display[0].firstElementChild.firstChild.innerHTML = 'ВКЛ'
      // input_mode_status_display[0].lastElementChild.style = "fill: #7ADC47"
      // zswitch_label.innerHTML = 'Р'
      input_res_path.style.visibility = 'visible'
      input_primary_path.style.visibility = 'hidden'
    } else {
      input_res_path.style.visibility = "hidden"
      input_primary_path.style.visibility = "hidden"
    }

  })

  const test_input_block = svg.querySelector('#layer_1 > g[id*="input_0"]')
        
  if (test_input_block) {
    const test_input_signal_buttons_list = svg.querySelectorAll(`#input_0_control_buttons g[id*="set"]`),
          test_input_availability = data_svg[`input_0`]?.is_available


    if (test_input_block) {
      const signal_type = data_svg[`input_0`]?.input_signal_type

      test_input_signal_buttons_list.forEach(button => {
        const signal_type_regex = /set_\w+_/,
              signal_type_index = button.id.match(signal_type_regex)[0].replace('set_', '').replace("_", "")

        switch (signal_type) {
          case "L":
            if (button.id.includes('l')) {
              button.classList.add("active_ex_conf");
            } else {
              button.classList.remove("active_ex_conf");
            }

            break;
          
          case "R":
            if (button.id.includes('r')) {
              button.classList.add("active_ex_conf");
            } else {
              button.classList.remove("active_ex_conf");
            }

            break;
          
          case "STEREO":
            if (button.id.includes('stereo')) {
              button.classList.add("active_ex_conf");
            } else {
              button.classList.remove("active_ex_conf");
            }

            break;

          case "MPX":
            if (button.id.includes('mpx')) {
              button.classList.add("active_ex_conf");
            } else {
              button.classList.remove("active_ex_conf");
            }

            break;

          case "AES":
            if (button.id.includes('aes')) {
              button.classList.add("active_ex_conf");
            } else {
              button.classList.remove("active_ex_conf");
            }

            break;

          default:
            break;
        }

        if (active_control_mode == 0) {
          button.style.display = 'none'
        } else {
          button.style.display = ''
        }
      })
    }

    if (test_input_availability) {
      test_input_block.style = "visibility: visibility"
    } else {
      test_input_block.style = "visibility: hidden"
    }
  }

  const test_output_block = svg.querySelector('#layer_1 > g[id*="output_0"]'),
        test_output_availability = data_svg[`output_0`]?.is_available

  if (test_output_block) {
    if (test_output_availability) {
      test_output_block.style = "visibility: visibility"
    } else {
      test_output_block.style = "visibility: hidden"
    }
  }
  // if (amp_1_buttons_list) {
  //   amp_1_buttons_list.forEach((button) => {
  //     if (auth_access.calib == 0) {
  //       button.classList.add("disabled_svg_button");
  //     } else {
  //       button.classList.remove("disabled_svg_button");
  //     }
  //   })
  // }

  // if (amp_2_buttons_list) {
  //   amp_2_buttons_list.forEach((button) => {
  //     if (auth_access.calib == 0) {
  //       button.classList.add("disabled_svg_button");
  //     } else {
  //       button.classList.remove("disabled_svg_button");
  //     }
  //   })
  // }

  // exiter_buttons_list.forEach((button) => {
  //   if (auth_access.settings == 0) {
  //     button.classList.add("disabled_svg_button");
  //   } else {
  //     button.classList.remove("disabled_svg_button");
  //   }
  // })

  // const exiter_pwr_button = svg.querySelector(`#exiter g#exiter_power_button`),
  //       exiter_status = data_svg?.exiter?.status

  // if (exiter_status == 1) {
  //   exiter_pwr_button.querySelector('#power_btn_cover').style.fill = status_colors[0]
  // } else {
  //   exiter_pwr_button.querySelector('#power_btn_cover').style.fill = status_colors[2]
  // }


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

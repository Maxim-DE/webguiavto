import { status_colors } from "../components/graph_blocks"
import { filter_obj } from "./utilites"

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
    });
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
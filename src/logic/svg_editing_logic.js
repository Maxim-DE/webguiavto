import { filter_obj } from "./utilites"

export default function svg_editing_logic(svg, data_svg, device_type) {
  switch (device_type) {
    case 'st_250':
      return st_250_svg_editing(svg, data_svg)
  
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
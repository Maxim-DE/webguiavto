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
        svg.querySelector(`#${key}_current3_label`).innerHTML = 'Ток 2'
      }

      const rect_height = svg_rect.height.baseVal.value
      if (rect_height > 134) {
        svg_rect.setAttribute('height',rect_height - 21)
      }

    } else {
      current_2_group.parentNode.style.display = ''

      if (key === 'amplifier_2') {
        svg.querySelector(`#${key}_current3_label`).innerHTML = 'Ток 3'
      }

      const rect_height = svg_rect.height.baseVal.value
      if (rect_height < 154) {
        svg_rect.setAttribute('height',rect_height + 22)
      }
    }
  }

  let ballast_group = svg.querySelector(`#output_ballast_value`)

  if (ballast_group === null) return svg

  if (!Object.hasOwn(output_data, 'ballast')) {
    ballast_group.parentNode.style.display = 'none'
  } else {
    ballast_group.parentNode.style.display = ''
  }

  return svg
}
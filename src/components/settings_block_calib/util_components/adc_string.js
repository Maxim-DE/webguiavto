import React from 'react'

import '../index.css'

export const ADCString = ({adc_value, label, ...props}) => {
  let adc_final_value

  if (adc_value) {
    adc_final_value = Array.isArray(adc_value) ? 
      (adc_value[0] / adc_value[1]).toFixed(Math.log10(adc_value[1])) :
      adc_value
  } else {
    adc_final_value = ''
  }

  return (
    <span className='item_adc_value'>
      {label}: {adc_final_value}
    </span>
  )
}

import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_double_array_conversion } from '../../../logic/calib_state_conversion';

function CurrentThresholdCalibSettings(props) {

  const [thresholdCalibState, setThresholdCalibState] = React.useState({
    I1_threshold_input: '',
    I2_threshold_input: '',
    I3_threshold_input: '',
    I4_threshold_input: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        let value_array = [],
            divident,
            divider,
            digits
            
        let low_value,
            high_value
        
        divident = props.calib_data[key].low[0]
        divider = props.calib_data[key].low[1] == 0 ? 1 : props.calib_data[key].low[1]
        digits = Math.log10(divider)
        low_value = (divident / divider).toFixed(digits)
        value_array.push(low_value)

        divident = props.calib_data[key].high[0]
        divider = props.calib_data[key].high[1] == 0 ? 1 : props.calib_data[key].high[1]
        digits = Math.log10(divider)
        high_value = (divident / divider).toFixed(digits)
        value_array.push(high_value)

        calib_state_copy[`${key}_threshold_input`] = value_array
      }

      setThresholdCalibState(calib_state_copy)

    }
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    
    let range_input = event.target.parentElement;

    let name = range_input.id;
    let value = [range_input.children[1].value, range_input.children[3].value];

    setThresholdCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target
    const id = `${target.name}_input`
    const name = `${target.name}`
    const calib_data_name = name.replace('_threshold', '')
    const state_value = thresholdCalibState[id]
    const multipier_low = props.calib_data ? props.calib_data[calib_data_name].low[1] : 10
    const multipier_high = props.calib_data ? props.calib_data[calib_data_name].high[1] : 10

    let state_obj = { [calib_data_name]: state_value },
        converted_state = calib_double_array_conversion(state_obj, props.calib_data)


    const value = `${name}_low$${state_value[0] * multipier_low};${name}_high$${state_value[1] * multipier_high};`
    
    const request_obj = {
      address: 'calib_current_threshold.cgi',
      data: value,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_current: {
          threshold: converted_state
        }
      }
    }

    props.clickHandler(request_obj);

  }
  
  return (
  <Settings_block_calib header={`калибровка порогов токов`}
                        settings_type={`current_calib`}
                        save_handler={handleClick_save}>
    <li
      key='I1_threshold'
      id='I1_threshold'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`I1_threshold_input`}
          className="settings_itemLabel">
          Порог I1
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {props.adc_data.I1}
        </span>
        <div
          className="text_range_container"
          id={`I1_threshold_input`}
          name={`I1_threshold`}>
          <span>от</span>
          <input
            type="text"
            className="text_range"
            data-threshold="low"
            value={thresholdCalibState.I1_threshold_input[0]}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className="text_range"
            data-threshold="high"
            value={thresholdCalibState.I1_threshold_input[1]}
            onChange={handleChange}
          />
        </div>
        <FormInput
          id={`I1_threshold_save`}
          name={`I1_threshold`}
          clickHandler={handleClick_save}
          label='Сохранить'
          type="button" />
      </div>
    </li>
    <li
      key='I2_threshold'
      id='I2_threshold'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`I2_threshold_input`}
          className="settings_itemLabel">
          Порог I2
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {props.adc_data.I2}
        </span>
        <div
          className="text_range_container"
          id={`I2_threshold_input`}
          name={`I2_threshold`}>
          <span>от</span>
          <input
            type="text"
            className="text_range"
            data-threshold="low"
            value={thresholdCalibState.I2_threshold_input[0]}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className="text_range"
            data-threshold="high"
            value={thresholdCalibState.I2_threshold_input[1]}
            onChange={handleChange}
          />
        </div>
        <FormInput
          id={`I2_threshold_save`}
          name={`I2_threshold`}
          clickHandler={handleClick_save}
          label='Сохранить'
          type="button" />
      </div>
    </li>
    <li
      key='I3_threshold'
      id='I3_threshold'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`I3_threshold_input`}
          className="settings_itemLabel">
          Порог I3
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {props.adc_data.I3}
        </span>
        <div
          className="text_range_container"
          id={`I3_threshold_input`}
          name={`I3_threshold`}>
          <span>от</span>
          <input
            type="text"
            className="text_range"
            data-threshold="low"
            value={thresholdCalibState.I3_threshold_input[0]}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className="text_range"
            data-threshold="high"
            value={thresholdCalibState.I3_threshold_input[1]}
            onChange={handleChange}
          />
        </div>
        <FormInput
          id={`I3_threshold_save`}
          name={`I3_threshold`}
          clickHandler={handleClick_save}
          label='Сохранить'
          type="button" />
      </div>
    </li>
    <li
      key='I4_threshold'
      id='I4_threshold'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`I4_threshold_input`}
          className="settings_itemLabel">
          Порог I4
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {props.adc_data.I4}
        </span>
        <div
          className="text_range_container"
          id={`I4_threshold_input`}
          name={`I4_threshold`}>
          <span>от</span>
          <input
            type="text"
            className="text_range"
            data-threshold="low"
            value={thresholdCalibState.I4_threshold_input[0]}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className="text_range"
            data-threshold="high"
            value={thresholdCalibState.I4_threshold_input[1]}
            onChange={handleChange}
          />
        </div>
        <FormInput
          id={`I4_threshold_save`}
          name={`I4_threshold`}
          clickHandler={handleClick_save}
          label='Сохранить'
          type="button" />
      </div>
    </li>
  </Settings_block_calib>
  )
}

export default CurrentThresholdCalibSettings
import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

import { calib_double_array_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function CurrentThresholdCalibSettings_AMP(props) {
  const calibCurrentThreshold_store = useSelector((store) => {
    if (deepKeyExists(store, 'threshold')) {
      return store.globalStore.global_data.calib_state.data?.calib_current?.threshold
    } else return ''
  }),
        adcCurrentThreshold_store = useSelector((store) => {
          if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'current_threshhold_calib')) {
            return store.globalStore.global_data.status_data.calib_adc?.current_threshhold_calib
          } else return ''
        }),
        info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info),
        auth_store = useSelector((store) => store.authStore.auth_data)

  const device_type = Object.keys(info_section_data).length > 0 ? info_section_data.info_general.model : 0

  const [thresholdCalibState, setThresholdCalibState] = React.useState({
    I1_threshold_input: '',
    I2_threshold_input: '',
    I3_threshold_available: 0,
    I3_threshold_input: '',
    I4_threshold_available: 0,
    I4_threshold_input: '',
    current_num: 0
  })

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!calibCurrentThreshold_store) return

    if (Object.keys(calibCurrentThreshold_store).length != 0) {
      let calib_state_copy = thresholdCalibState

      for (const key in calibCurrentThreshold_store) {
        let value_array = [],
            divident,
            divider,
            digits
            
        let low_value,
            high_value
        
        divident = calibCurrentThreshold_store[key].low[0]
        divider = calibCurrentThreshold_store[key].low[1] == 0 ? 1 : calibCurrentThreshold_store[key].low[1]
        digits = Math.log10(divider)
        low_value = (divident / divider).toFixed(digits)
        value_array.push(low_value)

        divident = calibCurrentThreshold_store[key].high[0]
        divider = calibCurrentThreshold_store[key].high[1] == 0 ? 1 : calibCurrentThreshold_store[key].high[1]
        digits = Math.log10(divider)
        high_value = (divident / divider).toFixed(digits)
        value_array.push(high_value)

        calib_state_copy[`${key}_threshold_input`] = value_array

        if (Object.prototype.hasOwnProperty.call(calibCurrentThreshold_store[key], 'availability')) {
          calib_state_copy[`${key}_threshold_available`] = calibCurrentThreshold_store[key].availability
        }
      }

      setThresholdCalibState(calib_state_copy)

    }
  }, [calibCurrentThreshold_store])

  React.useEffect(() => {
    let current_num = 0

    switch (device_type) {
      case 0:
        current_num = 1
        break;

      case 1:
        current_num = 3
        break;

      case 2:
        current_num = 2
        break;

      case 3:
        current_num = 4
        break;

      default:
        current_num = 0
        break;
    }

    setThresholdCalibState(prevState => ({
      ...prevState,
      current_num: current_num
    }))

  }, [device_type])

  const handleChange = (event) => {
    const target = event.target;

    let name, value

    if (target.type === 'checkbox') {
      name = target.name.replace('_calib', '')
      value = Number(target.checked)

      setThresholdCalibState(prevState => ({
        ...prevState,
        [name]: value
      }))

      return
    }
    
    let range_input = event.target.parentElement.parentElement;

    name = range_input.id;
    
    const from_value = range_input.children[1].children[0].value,
          to_value = range_input.children[3].children[0].value

    value = [from_value, to_value];

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
    const multipier_low = calibCurrentThreshold_store ? calibCurrentThreshold_store[calib_data_name].low[1] : 10
    const multipier_high = calibCurrentThreshold_store ? calibCurrentThreshold_store[calib_data_name].high[1] : 10

    let state_obj = { [calib_data_name]: state_value },
        converted_state = calib_double_array_conversion(state_obj, calibCurrentThreshold_store)


    const value = `${name}_low$${state_value[0] * multipier_low};${name}_high$${state_value[1] * multipier_high};`
    
    const request_obj = {
      address: 'calib_current_threshold.cgi',
      data: value,
      reducer: reducers.calibration_form,
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

  const handleAvaliablility_save = (event) => {
    const target = event.target,

          target_name = target.name.replace('_calib', ''),
          target_value = Number(target.checked),

          threshold_name = target_name.replace('available', 'input'),
          threshold_value = thresholdCalibState[threshold_name],

          stateCopy_name = threshold_name.replace('_threshold_input', '')

    let state_obj = { [stateCopy_name]: threshold_value },
        converted_state = calib_double_array_conversion(state_obj, calibCurrentThreshold_store)

    converted_state[stateCopy_name].available = target_value

    const request_obj = {
      address: 'calib_current_threshold.cgi',
      data: `${target_name}$${target_value}`,
      reducer: reducers.calibration_form,
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

  let threshold_rows = []

  for (let i = 1; i < thresholdCalibState.current_num + 1; i++) {
    threshold_rows.push(
      <li
        key={`I${i}_threshold`}
        id={`I${i}_threshold`}
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`I${i}_threshold_input`}
            className="settings_itemLabel">
            Порог I{i}
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcCurrentThreshold_store[`I${i}`]}
          </span>
          <div
            className="text_range_container"
            id={`I${i}_threshold_input`}
            name={`I${i}_threshold`}>
            <span>от</span>
            <FormInput
              type="text"
              class="text_range"
              input_value={thresholdCalibState[`I${i}_threshold_input`][0]}
              changeHandler={handleChange}
            />
            <span>до</span>
            <FormInput
              type="text"
              class="text_range"
              input_value={thresholdCalibState[`I${i}_threshold_input`][1]}
              changeHandler={handleChange}
            />
          </div>
          <FormInput
            id={`I${i}_threshold_save`}
            name={`I${i}_threshold`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    )
  }
  
  return (
  <Settings_block_calib header={`калибровка порогов токов`}
                        settings_type={`current_calib`}
                        save_handler={handleClick_save}>
    {threshold_rows}
  </Settings_block_calib>
  )
}

export default CurrentThresholdCalibSettings_AMP
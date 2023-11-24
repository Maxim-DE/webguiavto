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
    
    let range_input = event.target.parentElement;

    name = range_input.id;
    value = [range_input.children[1].value, range_input.children[3].value];

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
            <input
              type="text"
              className="text_range"
              data-threshold="low"
              value={thresholdCalibState[`I${i}_threshold_input`][0]}
              onChange={handleChange}
            />
            <span>до</span>
            <input
              type="text"
              className="text_range"
              data-threshold="high"
              value={thresholdCalibState[`I${i}_threshold_input`][1]}
              onChange={handleChange}
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
    {/* <li
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
          АЦП: {adcCurrentThreshold_store.I1}
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
          АЦП: {adcCurrentThreshold_store.I2}
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
    <li className="group_divider" />
    <li
      key='I3_threshold'
      id='I3_threshold'
      className="settings_item calib">
      <div className='item_header'>
        {auth_store.auth_access.calib_extend &&
        <FormInput
            id={`I3_threshold_available_calib_input`}
            name={`I3_threshold_available_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleAvaliablility_save(e)
            }}
            input_value={thresholdCalibState.I3_threshold_available}
            type="checkbox" />
        }
        <label
          htmlFor={`I3_threshold_input`}
          className="settings_itemLabel">
          Порог I3
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {adcCurrentThreshold_store.I3}
        </span>
        <div
          className="text_range_container"
          id={`I3_threshold_input`}
          name={`I3_threshold`}>
          <span>от</span>
          <input
            type="text"
            className={`text_range ${
              thresholdCalibState.I3_threshold_available ? '' : 'disabled_input'}`}
            data-threshold="low"
            disabled={!thresholdCalibState.I3_threshold_available}
            value={thresholdCalibState.I3_threshold_input[0]}
            placeholder={'X.X А'}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className={`text_range ${
              thresholdCalibState.I3_threshold_available ? '' : 'disabled_input'}`}
            data-threshold="high"
            disabled={!thresholdCalibState.I3_threshold_available}
            value={thresholdCalibState.I3_threshold_input[1]}
            placeholder={'X.X А'}
            onChange={handleChange}
          />
        </div>
        <input
          id={`I3_threshold_save`}
          name={`I3_threshold`}
          className={`button_input ${
              thresholdCalibState.I3_threshold_available ? '' : 'disabled_input'}`}
          type="button"
          value={'Сохранить'}
          disabled={!thresholdCalibState.I3_threshold_available}
          onClick={handleClick_save} />
      </div>
    </li>
    <li
      key='I4_threshold'
      id='I4_threshold'
      className="settings_item calib">
      <div className='item_header'>
        {auth_store.auth_access.calib_extend &&
        <FormInput
            id={`I4_threshold_available_calib_input`}
            name={`I4_threshold_available_calib`}
            changeHandler={(e) => {
              handleChange(e);
              handleAvaliablility_save(e)
            }}
            input_value={thresholdCalibState.I4_threshold_available}
            type="checkbox" />
        }
        <label
          htmlFor={`I4_threshold_input`}
          className="settings_itemLabel">
          Порог I4
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {adcCurrentThreshold_store.I4}
        </span>
        <div
          className="text_range_container"
          id={`I4_threshold_input`}
          name={`I4_threshold`}>
          <span>от</span>
          <input
            type="text"
            className={`text_range ${
              thresholdCalibState.I4_threshold_available ? '' : 'disabled_input'}`}
            data-threshold="low"
            value={thresholdCalibState.I4_threshold_input[0]}
            disabled={!thresholdCalibState.I4_threshold_available}
            onChange={handleChange}
          />
          <span>до</span>
          <input
            type="text"
            className={`text_range ${
              thresholdCalibState.I4_threshold_available ? '' : 'disabled_input'}`}
            data-threshold="high"
            value={thresholdCalibState.I4_threshold_input[1]}
            disabled={!thresholdCalibState.I4_threshold_available}
            onChange={handleChange}
          />
        </div>
        <input
          id={`I4_threshold_save`}
          name={`I4_threshold`}
          className={`button_input ${
              thresholdCalibState.I4_threshold_available ? '' : 'disabled_input'}`}
          type="button"
          value={'Сохранить'}
          disabled={!thresholdCalibState.I4_threshold_available}
          onClick={handleClick_save} />
      </div>
    </li> */}
  </Settings_block_calib>
  )
}

export default CurrentThresholdCalibSettings_AMP
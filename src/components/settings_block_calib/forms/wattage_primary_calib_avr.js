import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';
import { cloneDeep } from 'lodash';
import { reducers } from '../../../store/reducers/avr_control_reducers';

function PowerCalibSettings_AVR({ calib_state, adc_store, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => {
  //   if (deepKeyExists(store, 'calib_power')) {
  //     return store.globalStore.global_data.calib_state.data.calib_power
  //   } else return ''
  // }),
  // const adc_store = useSelector((store) => {
  //     if (deepKeyExists(store.globalStore.global_data.status_data.calib_adc, 'power_calib')) {
  //       return store.globalStore.global_data.status_data.calib_adc?.power_calib
  //     } else return ''
  //   })

  const [powerCalibState, setPowerCalibState] = React.useState({
    dac_value: '',
    output_power: '',
    output_power_threshold: '',
    coupling_coeff: '',
    power_threshold_reserved_value: 0,
    threshold_type: 0,
    threshold_0_value: 0,
    threshold_1_value: 1
  })

  React.useEffect(() => {
    if (!calib_state) return

    if (Object.keys(calib_state).length != 0) {
      let calib_state_copy = cloneDeep(powerCalibState)

      for (const key in calib_state) {
        if (calib_state[key] == undefined) continue

        if (Array.isArray(calib_state[key])) {
          const divident = calib_state[key][0],
                divider = calib_state[key][1] == 0 ? 1 : calib_state[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calib_state[key]
        }

      }

      setPowerCalibState(calib_state_copy)
    } 
  }, [calib_state])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setPowerCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value, state_to_save

    if (calib_state != undefined && calib_state[name] != undefined) {
      if (Array.isArray(calib_state[name])) {
        value = powerCalibState[name] * 10
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = powerCalibState[name]
        state_to_save = { [name]: value }
      }
    } else {
      value = powerCalibState[name]
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_power.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_power: state_to_save
      }
    }

    clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {

    const request_obj = {
      address: 'calib_output_power_zeros.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка мощности`}
                          settings_type={`power_calib`}
                          save_handler={handleClick_save}>
      <li
        key='output_power_calib'
        id='output_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`output_power_calib_input`}
            className="settings_itemLabel">
            Калибровка вых. мощности
          </label>
          <FormInput
            id={`output_power_zero_calib_input`}
            name={`output_power_zero_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adc_store?.output_power}
          </span>
          <FormInput
            id={`output_power_calib_input`}
            name={`output_power_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.output_power}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`output_power_calib_save`}
            name={`output_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>    
      {/* <li className="group_divider"></li>
      <li
        key='power_threshold_reserved_calib'
        id='power_threshold_reserved_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`output_power_calib_input`}
            className="settings_itemLabel">
            Порог для перехода на резерв
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`power_threshold_reserved_calib_input`}
            name={`power_threshold_reserved_value_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.power_threshold_reserved_value}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`power_threshold_reserved_calib_save`}
            name={`power_threshold_reserved_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='signal_recovery_threshold_calib'
        id='signal_recovery_threshold_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`signal_type_recovery_calib`}
            className="settings_itemLabel">
            Порог для перехода на резерв. АФУ
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`threshold_type_calib`}
            name={`threshold_type_calib`}
            type='select'
            input_value={powerCalibState.threshold_type}
            title='Тип порога'
            variants={[
              'По абс. отр. мощн.'
            ]}
            changeHandler={handleChange} />
          <FormInput
            id={`signal_recovery_threshold_calib_input`}
            name={`threshold_${powerCalibState.threshold_type}_value_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState[`threshold_${powerCalibState.threshold_type}_value`]}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`signal_recovery_threshold_calib_save`}
            name={`threshold_${powerCalibState.threshold_type}_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li> */}
      <li className="group_divider"></li>
      <li
        key='сoupling_coeff_calib'
        id='сoupling_coeff_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`сoupling_coeff_calib_input`}
            className="settings_itemLabel">
            Коэфициент связи P<sub>отр</sub>
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value' title='АЦП(отр) -x%*АЦП(вых)'>
            АЦП<sub>отр. после комп.</sub>: {adc_store?.coupling_coeff}
          </span>
          <FormInput
            id={`сoupling_coeff_calib_input`}
            name={`coupling_coeff_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.coupling_coeff}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`сoupling_coeff_calib_save`}
            name={`coupling_coeff_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      
    </Settings_block_calib>
  )
}

export default PowerCalibSettings_AVR
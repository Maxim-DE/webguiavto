import React from 'react';
import Settings_block_calib from '..';
import FormInput from '../../form_input';
import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { cloneDeep } from 'lodash';
import { reducers } from '../../../store/reducers/avr_control_reducers';

function MainsVoltageCalib_AVR({ calib_state, adc_store, clickHandler, ...props }) {

  const [voltageCalibState, setVoltageCalibState] = React.useState({
    voltage_adc_power: '',
    voltage_power: ''
  })

  React.useEffect(() => {
    console.log('MainsVoltageCalib - calib_state:', calib_state)
    console.log('MainsVoltageCalib - adc_store:', adc_store)
    if (!calib_state) return

    if (Object.keys(calib_state).length !== 0) {
      let calib_state_copy = cloneDeep(voltageCalibState)

      for (const key in calib_state) {
        if (calib_state[key] === undefined) continue

        if (Array.isArray(calib_state[key])) {
          const divident = calib_state[key][0],
                divider = calib_state[key][1] === 0 ? 1 : calib_state[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calib_state[key]
        }
      }

      setVoltageCalibState(calib_state_copy)
    } 
  }, [calib_state])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setVoltageCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value, state_to_save

    if (calib_state !== undefined && calib_state[name] !== undefined) {
      if (Array.isArray(calib_state[name])) {
        if (typeof calib_state[name][1] === 'number' &&
          calib_state[name][1] > 0) {
          value = parseFloat(voltageCalibState[name]) * calib_state[name][1]
        } else {
          value = parseFloat(voltageCalibState[name])
        }
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calib_state)
      } else {
        value = parseFloat(voltageCalibState[name])
        state_to_save = { [name]: value }
      }
    } else {
      value = parseFloat(voltageCalibState[name])
      state_to_save = { [name]: [value * 10, 10] } // сохраняем в формате [значение, делитель]
    }

    const request_obj = {
      address: 'calib_mains_voltage.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_mains_voltage: state_to_save  // правильный ключ
      }
    }

    clickHandler(request_obj);
  }

  // Проверка, что adc_store содержит нужные данные
  // Из JSON: calib_mains_voltage.voltage_adc_power = 2500
  const adcValue = calib_state?.voltage_adc_power || adc_store?.voltage_adc_power || 'Нет данных'

  return (
    <Settings_block_calib header={`Калибровка напряжения сети`}
                          settings_type={`voltage_power_calib`}
                          save_handler={handleClick_save}>
      <li
        key='voltage_power_calib'
        id='voltage_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`voltage_power_calib_input`}
            className="settings_itemLabel">
            Калибровка напряжения сети
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {adcValue}
          </span>
          <FormInput
            id={`voltage_power_calib_input`}
            name={`voltage_power_calib`}
            changeHandler={handleChange}
            input_value={voltageCalibState.voltage_power}
            style={{ margin: '0', maxWidth: '75px' }}
            type="text" />
          <FormInput
            id={`voltage_power_calib_save`}
            name={`voltage_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>    
    </Settings_block_calib>
  )
}

export default MainsVoltageCalib_AVR
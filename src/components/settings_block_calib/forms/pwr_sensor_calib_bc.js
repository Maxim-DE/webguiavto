import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import cloneDeep from 'lodash/cloneDeep';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import useGlobalStore from '../../../logic/auth_store';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';
import { ADCString } from '../util_components/adc_string';

function PWRSensorCalibSettings_BC(props) {
  const calibPWRSensor_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_pwr_sensor')) {
      return store.globalStore.global_data.calib_state.data?.calib_pwr_sensor
    } else return ''
  }),
  adcPwrSensor_store = useSelector((store) => {
    if (deepKeyExists(store, 'pwr_sensor_calib')) {
      return store.globalStore.global_data.status_data.calib_adc?.pwr_sensor_calib
    } else return ''
  }),
  auth_store = useSelector((store) => store.authStore.auth_data)

  const [PWRSensorCalibState, setPWRSensorCalibState] = React.useState({
    'coeff': 0,
    'coeff_ball': 0,
    'coeff_avaliable': 0,    // Добавлено поле для галочки coeff
    'coeff_ball_avaliable': 0 // Добавлено поле для галочки coeff_ball
  })

  React.useEffect(() => {
    if (!calibPWRSensor_store) return

    if (Object.keys(calibPWRSensor_store).length != 0) {
      let calib_state_copy = cloneDeep(PWRSensorCalibState)

      for (const key in calibPWRSensor_store) {
        if (key == 'fan_pwm') {
          let state_array = []

          if (calibPWRSensor_store[key] == 0) {
            state_array = [1, 0]
          } else {
            state_array = [0, 1]
          }

          calib_state_copy[key] = state_array
          
        } else if (Array.isArray(calibPWRSensor_store[key])) {
          const divident = calibPWRSensor_store[key][0],
                divider = calibPWRSensor_store[key][1] == 0 ? 1 : calibPWRSensor_store[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calibPWRSensor_store[key]
        }
      }

      setPWRSensorCalibState(calib_state_copy)

    }
  }, [calibPWRSensor_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '')

    setPWRSensorCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // Обработчик для сохранения с чекбоксом
  const handleChange_avaliable_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = target.type === 'checkbox' ? Number(target.checked) : target.value

    const request_obj = {
      address: 'calib_pwr_sensor.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      update_data: PWRSensorCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_pwr_sensor: { [name]: value }
      } 
    }

    props.clickHandler(request_obj);
  }

  const handleClick_save = (event) => {
    console.log(PWRSensorCalibState);
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value, state_to_save, save_str

    if (calibPWRSensor_store[name]) {
      if (Array.isArray(calibPWRSensor_store[name])) {
        value = PWRSensorCalibState[name]
        let state_obj = { [name]: value }
        state_to_save = calib_state_conversion(state_obj, calibPWRSensor_store)
        save_str = `${name}$${state_to_save[name][0]}`

      } else {
        value = PWRSensorCalibState[name]
        state_to_save = { [name]: value }
        save_str = `${name}$${state_to_save[name]}`
      }
    } else {
      value = PWRSensorCalibState[name]
      state_to_save = { [name]: value }
      save_str = `${name}$${state_to_save[name]}`
    }
    
    const request_obj = {
      address: 'calib_pwr_sensor.cgi',
      data: save_str,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_pwr_sensor: state_to_save
      }
    }

    props.clickHandler(request_obj);

  }

  const handleChange_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')
          
    let value = target.type === 'checkbox' ? Number(target.checked) : PWRSensorCalibState[name],
        state_to_save = {}

    if (calibPWRSensor_store[name]) {
      if (Array.isArray(calibPWRSensor_store[name])) {
        value = PWRSensorCalibState[name]
        state_to_save = { [name]: [
          value,
          calibPWRSensor_store[name][1]
        ]}
      } else {
        value = target.type === 'checkbox' ? Number(target.checked) : PWRSensorCalibState[name]
        state_to_save = { [name]: value }
      }
    } else {
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_pwr_sensor.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      save_data: {
        calib_pwr_sensor: state_to_save
      }
    }

    props.clickHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`калибровка датчика по`}
                          settings_type={`pwr_sensor_calib`}
                          save_handler={handleClick_save}>
      <li
        key='coeff_calib'
        id='coeff_calib'
        className="settings_item calib">
        <div className='item_header'>
          {auth_store.auth_access.calib_extend &&
            <FormInput
              id={`coeff_avaliable_calib_input`}
              name={`coeff_avaliable_calib`}
              changeHandler={(e) => {
                handleChange(e);
                handleChange_avaliable_save(e)
              }}
              input_value={PWRSensorCalibState.coeff_avaliable}
              type="checkbox" />
          }
          <label
            htmlFor={`coeff_input`}
            className="settings_itemLabel">
            Коэффициент АЧХ вых. мощности
          </label>
        </div>
        <div className='item_input'>
          <ADCString
            label={'K'}
            adc_value={adcPwrSensor_store?.coeff} />
          <FormInput
            id={`coeff_input`}
            name={`coeff`}
            class="calib_input"
            changeHandler={handleChange}
            input_value={PWRSensorCalibState.coeff}
            placeholder={'%'}
            type="text"
            disabled={!PWRSensorCalibState.coeff_avaliable} />
          <FormInput
            id={`coeff_save`}
            name={`coeff`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button"
            disabled={!PWRSensorCalibState.coeff_avaliable} />
        </div>
      </li>

      <li
        key='coeff_ball_calib'
        id='coeff_ball_calib'
        className="settings_item calib">
        <div className='item_header'>
          {auth_store.auth_access.calib_extend &&
            <FormInput
              id={`coeff_ball_avaliable_calib_input`}
              name={`coeff_ball_avaliable_calib`}
              changeHandler={(e) => {
                handleChange(e);
                handleChange_avaliable_save(e)
              }}
              input_value={PWRSensorCalibState.coeff_ball_avaliable}
              type="checkbox" />
          }
          <label
            htmlFor={`coeff_ball_input`}
            className="settings_itemLabel">
            Коэффициент АЧХ балласта
          </label>
        </div>
        <div className='item_input'>
          <ADCString
            label={'K'}
            adc_value={adcPwrSensor_store?.coeff_ball} />
          <FormInput
            id={`coeff_ball_input`}
            name={`coeff_ball`}
            class="calib_input"
            changeHandler={handleChange}
            input_value={PWRSensorCalibState.coeff_ball}
            placeholder={'%'}
            type="text"
            disabled={!PWRSensorCalibState.coeff_ball_avaliable} />
          <FormInput
            id={`coeff_ball_save`}
            name={`coeff_ball`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button"
            disabled={!PWRSensorCalibState.coeff_ball_avaliable} />
        </div>
      </li>

    </Settings_block_calib>
  )
}

export default PWRSensorCalibSettings_BC
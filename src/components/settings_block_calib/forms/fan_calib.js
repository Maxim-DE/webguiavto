import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import cloneDeep from 'lodash/cloneDeep';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import useGlobalStore from '../../../logic/auth_store';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function FanCalibSettings(props) {
  const calibFan_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_fan')) {
      return store.globalStore.global_data.calib_state.data?.calib_fan
    } else return ''
  }),
        auth_store = useSelector((store) => store.authStore.auth_data)
      // (store) => store.globalStore.global_data.calib_state.data.calib_fan

  const [fanCalibState, setFanCalibState] = React.useState({
    'fan_pwm': [1, 0],
    'fan_temp_threshold_on': '',
    'fan_temp_threshold_max': '',
    'fan_pwm_control': 0,
    'fan_pwm_value': 0
  })

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!calibFan_store) return

    if (Object.keys(calibFan_store).length != 0) {
      let calib_state_copy = cloneDeep(fanCalibState)

      for (const key in calibFan_store) {
        if (key == 'fan_pwm') {
          let state_array = []

          if (calibFan_store[key] == 0) {
            state_array = [1, 0]
          } else {
            state_array = [0, 1]
          }

          calib_state_copy[key] = state_array
          
        } else if (Array.isArray(calibFan_store[key])) {
          const divident = calibFan_store[key][0],
                divider = calibFan_store[key][1] == 0 ? 1 : calibFan_store[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        } else {
          calib_state_copy[key] = calibFan_store[key]
        }
      }

      setFanCalibState(calib_state_copy)

    }
  }, [calibFan_store])

  const fan_pwm_handleChange = (event) => {
    const target = event.target;
    const name = target.name.replace('_calib', '');

    let state_array = [0, 0]

    if (/200/gi.test(name)) {
      state_array[0] = 1;     
    } else if (/25/gi.test(name)) {
      state_array[1] = 1
    }

    setFanCalibState(prevState => ({
      ...prevState,
      'fan_pwm': state_array
    }))
  }

  const fan_pwm_save = (event) => {
    const state_array = fanCalibState.fan_pwm,
          name = 'fan_pwm'
    
    let output_value,
        data_string = ''

    if (state_array[0] == 1) {
      output_value = 0
    } else {
      output_value = 1
    }

    data_string = `${name}$${output_value}`
    
    const request_obj = {
      address: 'calib_fan.cgi',
      data: data_string,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_fan: {
          fan_pwm: output_value
        }
      }
    }

    props.clickHandler(request_obj);
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name.replace('_calib', '')

    setFanCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    console.log(fanCalibState);
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value, state_to_save, save_str
          // value = target.type != 'text' ? fanCalibState[name] : fanCalibState[name] * 10
    
    if (Array.isArray(calibFan_store[name])) {
      value = fanCalibState[name]
      let state_obj = { [name]: value }
      state_to_save = calib_state_conversion(state_obj, calibFan_store)
      save_str = `${name}$${state_to_save[name][0]}` // берем значение с конветрированного состояния

    } else {
      value = fanCalibState[name]
      state_to_save = { [name]: value }
      save_str = `${name}$${state_to_save[name]}`
    }
    

    const request_obj = {
      address: 'calib_fan.cgi',
      data: save_str,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_fan: state_to_save
      }
    }

    props.clickHandler(request_obj);

  }

  const handleChange_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')
          
    let value = target.type === 'checkbox' ? Number(target.checked) : fanCalibState[name],
        state_to_save = {}

    if (calibFan_store[name]) {
      if (Array.isArray(calibFan_store[name])) {
        value = fanCalibState[name]
        state_to_save = { [name]: [
          value,
          calibFan_store[name][1]
        ]}
      } else {
        value = target.type === 'checkbox' ? Number(target.checked) : fanCalibState[name]
        state_to_save = { [name]: value }
      }
    } else {
      state_to_save = { [name]: value }
    }

    const request_obj = {
      address: 'calib_fan.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
      save_data: {
        calib_fan: state_to_save
      }
    }

    props.clickHandler(request_obj)
  }

  return (
    <Settings_block_calib header={`калибровка вентиляторов`}
                          settings_type={`fan_calib`}
                          save_handler={handleClick_save}>

      <li
        key='fan_pwm_calib'
        id='fan_pwm_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`fan_pwm_calib_input`}
            className="settings_itemLabel">
            Частота ШИМ
          </label>
        </div>
        <div className='item_input'>
          200 КГц
          <FormInput
            id={`fan_pwm_200_calib_input`}
            name={`fan_pwm_200_calib`}
            type='checkbox'
            changeHandler={fan_pwm_handleChange}
            input_value={fanCalibState.fan_pwm[0]} />
          25 КГц
          <FormInput
            id={`fan_pwm_25_calib_input`}
            name={`fan_pwm_25_calib`}
            type='checkbox'
            changeHandler={fan_pwm_handleChange}
            input_value={fanCalibState.fan_pwm[1]} />
          <FormInput
            id={`fan_pwm_calib_save`}
            name={`fan_pwm_calib`}
            clickHandler={fan_pwm_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='fan_temp_threshold_on_calib'
        id='fan_temp_threshold_on'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`fan_temp_threshold_on_input`}
            className="settings_itemLabel">
            Порог температуры на вкл.
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`fan_temp_threshold_on_input`}
            name={`fan_temp_threshold_on`}
            class="calib_input"
            changeHandler={handleChange}
            input_value={fanCalibState.fan_temp_threshold_on}
            type="text" />
          <FormInput
            id={`fan_temp_threshold_on_save`}
            name={`fan_temp_threshold_on`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='fan_temp_threshold_max_calib'
        id='fan_temp_threshold_max'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`fan_temp_threshold_max_input`}
            className="settings_itemLabel">
            Порог температуры на макс.
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`fan_temp_threshold_max_input`}
            name={`fan_temp_threshold_max`}
            class="calib_input"
            changeHandler={handleChange}
            input_value={fanCalibState.fan_temp_threshold_max}
            type="text" />
          <FormInput
            id={`fan_temp_threshold_max_save`}
            name={`fan_temp_threshold_max`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      {auth_store.auth_access.calib_extend &&
       <>
        <li
          key='fan_pwm_control'
          id='fan_pwm_control'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`fan_pwm_control_input`}
              className="settings_itemLabel">
              Управление ШИМ вент.
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`fan_pwm_control_input`}
              name={`fan_pwm_control_calib`}
              changeHandler={(e) => {
                handleChange(e);
                handleChange_save(e)
              }}
              input_value={!!fanCalibState.fan_pwm_control}
              type="switch" />
          </div>
        </li>
        {!!fanCalibState.fan_pwm_control &&
         <li
          key='fan_pwm_value'
          id='fan_pwm_value'
           className="settings_item">
           <div className='item_header'>
             <label
               htmlFor={`fan_pwm_value_input`}
               className="settings_itemLabel">
               Значение ШИМ
             </label>
           </div>
           <div className='item_input'>
             <FormInput
               id={`fan_pwm_value_input`}
               name={`fan_pwm_value_calib`}
               changeHandler={handleChange}
               mouseupHandler={handleClick_save}
               input_value={fanCalibState.fan_pwm_value}
               type="slider"
               min={1}
               max={100}
               step={1} />
           </div>
         </li>
         }
       </>
      }
    </Settings_block_calib>
  )
}

export default FanCalibSettings
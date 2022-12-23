import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

function FanCalibSettings(props) {

  const [fanCalibState, setFanCalibState] = React.useState({
    'fan_pwm': [1, 0],
    'fan_temp_threshold_on': '',
    'fan_temp_threshold_max': '',
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        if (key == 'fan_pwm') {
          let state_array = []

          if (props.calib_data[key] == 0) {
            state_array = [1, 0]
          } else {
            state_array = [0, 1]
          }

          calib_state_copy[key] = state_array
          
        } else {
          const divident = props.calib_data[key][0],
                divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
                digits = Math.log10(divider)
          calib_state_copy[key] = (divident / divider).toFixed(digits)
        }
      }

      setFanCalibState(calib_state_copy)

    }
  }, [props.calib_data])

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
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setFanCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = fanCalibState[name]

    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, props.calib_data)

    const request_obj = {
      address: 'calib_fan.cgi',
      data: `${name}$${value * 10}`,
      save_data: {
        calib_fan: converted_state
      }
    }

    props.clickHandler(request_obj);

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

    </Settings_block_calib>
  )
}

export default FanCalibSettings
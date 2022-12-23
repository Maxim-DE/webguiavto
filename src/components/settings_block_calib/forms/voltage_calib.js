import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

function VoltageCalibSettings(props) {

  const [voltageCalibState, setVoltageCalibState] = React.useState({
    U1: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        const divident = props.calib_data[key][0],
              divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1]
        calib_state_copy[key] = (divident / divider).toFixed(1)
      }

      setVoltageCalibState(calib_state_copy)

    }
  }, [props.calib_data])

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
          name = target.name.replace('_calib', ''),
          value = voltageCalibState[name]

    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, props.calib_data)

    const request_obj = {
      address: 'calib_voltage.cgi',
      data: `${name}$${value * 10}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_voltage: converted_state
      }
    }

    props.clickHandler(request_obj);

  }

  return (
  <Settings_block_calib header={`калибровка напряжений`}
                        settings_type={`voltage_primary_calib`}>
    <li
      key='U1_calib'
      id='U1_calib'
      className="settings_item calib">
      <div className='item_header'>
        <label
          htmlFor={`U1_calib_input`}
          className="settings_itemLabel">
          Калибровка U1
        </label>
      </div>
      <div className='item_input'>
        <span className='item_adc_value'>
          АЦП: {props.adc_data.U1}
        </span>
        <FormInput
          id={`U1_calib_input`}
          name={`U1_calib`}
          changeHandler={handleChange}
          input_value={voltageCalibState.U1}
          type="text" />
        <FormInput
          id={`U1_calib_save`}
          name={`U1_calib`}
          clickHandler={handleClick_save}
          label='Сохранить'
          type="button" />
      </div>
    </li>
  </Settings_block_calib>
  )
}

export default VoltageCalibSettings
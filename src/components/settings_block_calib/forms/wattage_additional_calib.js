import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function WattageAdditionalCalibSettings(props) {
  const [wattageAdditionalCalibState, setWattageAdditionalCalibState] = React.useState({
    input_power: '',
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        const divident = props.calib_data[key][0],
              divider = props.calib_data[key][1],
              digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setWattageAdditionalCalibState(calib_state_copy)
    }

  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setWattageAdditionalCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = wattageAdditionalCalibState[name],
          multipier = props.calib_data ? props.calib_data[name][1] : 10

    const request_obj = {
      address: 'calib_input_power.cgi',
      data: `${name}$${value * multipier}`,
      update_data: wattageAdditionalCalibState,
    }

    props.clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {
    const target = event.target,
      name = target.name.replace('_zeros_calib', ''),
      value = 1

    let request_obj = {
      address: 'calib_input_power_zero.cgi',
    }

    props.clickHandler(request_obj);
  }
  

  return (
    <Settings_block_calib header={`калибровка мощности (доп.)`}
      settings_type={`power_additional_calib`}>
      <li
        key='input_power_calib'
        id='input_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`input_power_calib_input`}
            className="settings_itemLabel">
            Калибровка вход. мощности
          </label>
          <FormInput
            id={`input_power_zeros_calib_input`}
            name={`input_power_zeros_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.input_power}
          </span>
          <FormInput
            id={`input_power_calib_input`}
            name={`input_power_calib`}
            changeHandler={handleChange}
            input_value={wattageAdditionalCalibState.input_power}
            type="text" />
          <FormInput
            id={`input_power_calib_save`}
            name={`input_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default WattageAdditionalCalibSettings

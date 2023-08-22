import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../store_reducers';
import { useSelector } from 'react-redux';

function WattageAdditionalCalibSettings(props) {

  const calibWattageAdditional_store = useSelector((store) => store.globalStore.global_data.calib_state.data.calib_additional_power)

  const [wattageAdditionalCalibState, setWattageAdditionalCalibState] = React.useState({
    input_power: '',
  })

  React.useEffect(() => {
    if (Object.keys(calibWattageAdditional_store).length != 0 && calibWattageAdditional_store != undefined) {
      let calib_state_copy = {}

      for (const key in calibWattageAdditional_store) {
        const divident = calibWattageAdditional_store[key][0],
              divider = calibWattageAdditional_store[key][1] == 0 ? 1 : calibWattageAdditional_store[key][1],
              digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setWattageAdditionalCalibState(calib_state_copy)
    }

  }, [calibWattageAdditional_store])

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
          multipier = calibWattageAdditional_store ? calibWattageAdditional_store[name][1] : 10

    let state_obj = { [name]: value },
        converted_state = calib_state_conversion(state_obj, calibWattageAdditional_store)

    const request_obj = {
      address: 'calib_input_power.cgi',
      data: `${name}$${value * multipier}`,
      reducer: reducers.calibration_form,
      update_data: wattageAdditionalCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_additional_power: converted_state
      } 
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

import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function WattageThresholdCalibSettings(props) {

  const [wattageThresholdCalibState, setWattageThresholdCalibState] = React.useState({
    wattage_threshold_on: '',
    wattage_threshold_off: '',
  })

  React.useEffect(() => {
    if (!props.calib_data) {
      return
    } 

    if (Object.keys(props.calib_data).length != 0 ||
        props.calib_data != undefined) {
      let calib_state_copy = wattageThresholdCalibState

      for (const key in props.calib_data) {

        const divident = props.calib_data[key][0],
          divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
          digits = Math.log10(divider)

        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setWattageThresholdCalibState(calib_state_copy)

    }
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setWattageThresholdCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = wattageThresholdCalibState[name],
      multiplier = Array.isArray(props.calib_data[name]) ? (props.calib_data[name][1]) : 1

    const request_obj = {
      address: 'calib_wattage_threshold.cgi',
      data: `${name}$${value * multiplier}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`настройка защиты сброса мощн.`}
      settings_type={`wattage_threshold_calib`}
      save_handler={handleClick_save}>
      <li
        key='wattage_threshold_on_calib'
        id='wattage_threshold_on_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`wattage_threshold_on_calib_input`}
            className="settings_itemLabel">
            Порог P<sub>dis</sub> на вкл. мощности
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`wattage_threshold_on_calib_input`}
            name={`wattage_threshold_on_calib`}
            changeHandler={handleChange}
            input_value={wattageThresholdCalibState.wattage_threshold_on}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`wattage_threshold_on_calib_save`}
            name={`wattage_threshold_on_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='wattage_threshold_off_calib'
        id='wattage_threshold_off_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`wattage_threshold_off_calib_input`}
            className="settings_itemLabel">
            Порог P<sub>dis</sub> на сброс мощности
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`wattage_threshold_off_calib_input`}
            name={`wattage_threshold_off_calib`}
            changeHandler={handleChange}
            input_value={wattageThresholdCalibState.wattage_threshold_off}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`wattage_threshold_off_calib_save`}
            name={`wattage_threshold_off_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default WattageThresholdCalibSettings
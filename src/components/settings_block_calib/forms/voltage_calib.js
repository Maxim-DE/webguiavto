import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../store_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function VoltageCalibSettings(props) {
  const calibVoltage_store = useSelector((store) => {
      if (deepKeyExists(store, 'calib_voltage')) {
        return store.globalStore.global_data.calib_state.data?.calib_current?.calib_voltage
      } else return ''
    }),
        adcVoltage_store = useSelector((store) => store.globalStore.global_data.status_data.calib_adc.voltage_calib)

  // (store) => store.globalStore.global_data.calib_state.data.calib_general

  const [voltageCalibState, setVoltageCalibState] = React.useState({
    U1: ''
  })

  React.useEffect(() => {
    if (Object.keys(calibVoltage_store).length != 0 && calibVoltage_store != undefined) {
      let calib_state_copy = {}

      for (const key in calibVoltage_store) {
        const divident = calibVoltage_store[key][0],
              divider = calibVoltage_store[key][1] == 0 ? 1 : calibVoltage_store[key][1]
        calib_state_copy[key] = (divident / divider).toFixed(1)
      }

      setVoltageCalibState(calib_state_copy)

    }
  }, [calibVoltage_store])

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
        converted_state = calib_state_conversion(state_obj, calibVoltage_store)

    const request_obj = {
      address: 'calib_voltage.cgi',
      data: `${name}$${value * 10}`,
      reducer: reducers.calibration_form,
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
            АЦП: {adcVoltage_store?.U1}
        </span>
        <FormInput
          id={`U1_calib_input`}
          name={`U1_calib`}
          class="calib_input"
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
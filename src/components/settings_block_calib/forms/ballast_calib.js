import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

function BallastCalibSettings(props) {

  const [ballastCalibState, setBallastCalibState] = React.useState({
    ballast_1: '',
  })

  React.useEffect(() => {
    if (!props.calib_data) {
      return
    } 

    if (Object.keys(props.calib_data).length != 0 ||
        props.calib_data != undefined) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        const divident = props.calib_data[key][0],
          divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
          digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setBallastCalibState(calib_state_copy)

    }
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setBallastCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = ballastCalibState[name]


    let state_obj = { [name]: value },
      converted_state = calib_state_conversion(state_obj, props.calib_data)

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value * 10}`,
      update_data: ballastCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_current: {
          current_value: converted_state
        }
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка балласта`}
      settings_type={`ballast_calib`}
      section_name={props.section_name}>
      <li
        key='ballast_1_calib'
        id='ballast_1_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`ballast_1_calib_input`}
            className="settings_itemLabel">
            Балласт 1, X.XX кВт
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data?.ballast_1}
          </span>
          <FormInput
            id={`ballast_1_calib_input`}
            name={`ballast_1_calib`}
            changeHandler={handleChange}
            input_value={ballastCalibState.ballast_1}
            type="text" />
          <FormInput
            id={`ballast_1_calib_save`}
            name={`ballast_1_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default BallastCalibSettings;
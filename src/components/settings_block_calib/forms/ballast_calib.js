import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { reducers } from '../store_reducers';
import { useSelector } from 'react-redux';

function BallastCalibSettings(props) {

  const calibBallast_store = useSelector((store) => store.globalStore.global_data.calib_state.data.calib_ballast),
        adcBallast_store = useSelector((store) => store.globalStore.global_data.status_data.calib_adc.ballast_calib)

  const [ballastCalibState, setBallastCalibState] = React.useState({
    ballast_1: '',
  })

  React.useEffect(() => {
    if (!calibBallast_store) {
      return
    } 

    if (Object.keys(calibBallast_store).length != 0 ||
        calibBallast_store != undefined) {
      let calib_state_copy = {}

      for (const key in calibBallast_store) {
        const divident = calibBallast_store[key][0],
          divider = calibBallast_store[key][1] == 0 ? 1 : calibBallast_store[key][1],
          digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setBallastCalibState(calib_state_copy)

    }
  }, [calibBallast_store])

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
      converted_state = calib_state_conversion(state_obj, calibBallast_store)

    const request_obj = {
      address: 'calib_ballast.cgi',
      data: `${name}$${value * 10}`,
      reducer: reducers.calibration_form,
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
            АЦП: {adcBallast_store?.ballast_1}
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
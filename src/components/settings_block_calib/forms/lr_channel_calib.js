import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';
import { dataArray_to_string } from '../../../logic/request_logic';
import { reducers } from '../store_reducers';
import { useSelector } from 'react-redux';

function LRChannelCalibSettings(props) {

  const calibLRChannel_store = useSelector((store) => store.globalStore.global_data.calib_state.data.calib_lr_channel)

  const [LRChannelCalibState, setLRChannelCalibState] = React.useState({
    l_channel: '',
    r_channel: ''
  })

  React.useEffect(() => {
    if (!calibLRChannel_store) {
      return
    }

    if (Object.keys(calibLRChannel_store).length != 0 ||
        calibLRChannel_store != undefined) {
      let calib_state_copy = {}

      for (const key in calibLRChannel_store) {
        const divident = calibLRChannel_store[key][0],
          divider = calibLRChannel_store[key][1] == 0 ? 1 : calibLRChannel_store[key][1],
          digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setLRChannelCalibState(calib_state_copy)

    }
  }, [calibLRChannel_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setLRChannelCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = LRChannelCalibState[name]


    let state_obj = { [name]: value },
      converted_state = calib_state_conversion(state_obj, calibLRChannel_store)

    const request_obj = {
      address: 'calib_lr_channel.cgi',
      data: dataArray_to_string(LRChannelCalibState),
      reducer: reducers.calibration_form,
      update_data: LRChannelCalibState,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_lr_channel: {
          current_value: converted_state
        }
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка L/R канала`}
      settings_type={`lr_channel_calib`}
      save_handler={handleClick_save}>
      <li
        key='lr_channel'
        id='lr_channel'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`lr_channel_input`}
            className="settings_itemLabel">
            Ном. уровень L/R: 
            <span className='item_adc_value'>
              {props.adc_data?.nominal_lr}
            </span>;
             L: 
            <span className='item_adc_value'>
              {props.adc_data?.l_channel}
            </span>;
             R:
            <span className='item_adc_value'>
              {props.adc_data?.r_channel}
            </span>;
          </label>
        </div>
        <div className='item_input'>
          <div
            className="text_range_container"
            id={`lr_channel_input`}
            name={`lr_channel`}>
            <span>L</span>
            <input
              type="text"
              className="text_range"
              data-threshold="low"
              value={LRChannelCalibState.l_channel}
              onChange={handleChange}
            />
            <span>R</span>
            <input
              type="text"
              className="text_range"
              data-threshold="high"
              value={LRChannelCalibState.r_channel}
              onChange={handleChange}
            />
          </div>
          <FormInput
            id={`lr_channel_save`}
            name={`lr_channel`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default LRChannelCalibSettings
import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function MiscCalibSettings(props) {

  // React.useEffect(() => {
  //   if (Object.keys(props.calib_data).length != 0) {
  //     let calib_state_copy = tempThresholdCalibState

  //     for (const key in props.calib_data) {

  //       if (key == 'temp_address') {
  //         calib_state_copy[key] = props.calib_data[key]
  //         continue;
  //       }

  //       const divident = props.calib_data[key][0],
  //         divider = props.calib_data[key][1],
  //         digits = Math.log10(divider)

  //       // if (divider == 1) {
  //       //   digits = 0
  //       // } else {
  //       //   digits = Math.log10(divider)
  //       // }

  //       calib_state_copy[key] = (divident / divider).toFixed(digits)
  //     }

  //     setTempThresholdCalibState(calib_state_copy)

  //   }
  // }, [props.calib_data])

  // const handleChange = (event) => {
  //   const target = event.target;
  //   const value = target.value;
  //   const name = target.name.replace('_calib', '');

  //   setTempThresholdCalibState(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }))
  // }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = 1

    const request_obj = {
      address: 'calib_misc.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);

  }


  return (
    <Settings_block_calib header={`прочее`}
      settings_type={`misc_calib`}
      // save_handler={handleClick_save}
      >
      <li
        key='delete_userlogs_calib'
        id='delete_user_logs_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`delete_user_logs_calib_input`}
            className="settings_itemLabel">
            Удалить пользовательский журнал
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`delete_user_logs_calib_save`}
            name={`delete_user_logs_calib`}
            clickHandler={handleClick_save}
            label='Удалить'
            type="button" />
        </div>
      </li>
      <li
        key='delete_sys_logs_calib'
        id='delete_sys_logs_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`delete_sys_logs_calib_input`}
            className="settings_itemLabel">
            Удалить системный журнал
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`delete_sys_logs_calib_save`}
            name={`delete_sys_logs_calib_calib`}
            clickHandler={handleClick_save}
            label='Удалить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default MiscCalibSettings
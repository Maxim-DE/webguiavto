import React from 'react';

import Settings_block_calib from '..';
import Syslog_calib from './syslog_calib';
import Hex_upload from './hex_upload';
import FormInput from '../../form_input';

function MiscCalibSettings(props) {
  const [miscCalibState, setMiscCalibState] = React.useState({
    sys_log: []
  })

  React.useEffect(() => {
    if (props.calib_data == undefined) {
      return
    }

    if (Object.keys(props.calib_data).length == 0) {
      return
    }

    let calib_state_copy = miscCalibState

    for (const key in props.calib_data) {
      calib_state_copy[key] = props.calib_data[key]
    }

    setMiscCalibState(calib_state_copy)

  }, [props.calib_data])

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

  async function handleClick_postReq_test() {
    let user = 'name:john;age:12';

    // const request_obj = {
    //   address: 'write_dump_memory',
    //   fetch_opts: {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'text/plain',
    //     },
    //     body: user
    //   },
    //   notifications: {
    //     good: 'default',
    //     bad: 'default'
    //   }
    // }

    // props.clickHandler(request_obj);

    let response = await fetch('/write_dump_memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: user
    });

    let result = await response.text();
    alert(result.message);

    // let xhr = new XMLHttpRequest();

    // let json = JSON.stringify({
    //   name: "Вася",
    //   surname: "Петров"
    // });

    // xhr.open("POST", 'http://192.168.1.114/write_dump_memory')
    // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // xhr.send(json);

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
      <Syslog_calib
        updateHandler={props.clickHandler}
        logData={miscCalibState.sys_log} />
      <li
        key='test_post_req'
        id='test_post_req'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Проверка POST-запроса
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`test_post_req_input`}
            name={`test_post_req`}
            clickHandler={handleClick_postReq_test}
            label='Отправить'
            type="button" />
        </div>
      </li>
      <Hex_upload />
      {/* <li
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
      </li> */}
    </Settings_block_calib>
  )
}

export default MiscCalibSettings
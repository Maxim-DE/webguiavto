import React from 'react';

import Settings_block_calib from '..';
import Syslog_calib from './syslog_calib';
import Account_manage_calib from './account_manage_calib';
import Hex_upload from './hex_upload';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

function MiscCalibSettings(props) {
  const [miscCalibState, setMiscCalibState] = React.useState({
    sys_log: [],
    user_list: [],
    amp_supply: false
  })

  const [authGlobalState, authGlobalActions] = useGlobalStore()

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

  const handleChange_save = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name.replace('_calib', '');

    setMiscCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))

    const request_obj = {
      address: 'calib_misc.cgi',
      data: `${name}$${+ value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_serialNum: {
          [name]: value
        }
      }
    }

    props.clickHandler(request_obj);
  }

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

    let response = await fetch('/write_dump_memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: user
    });

    let result = await response.text();
    alert(result.message);
  }

  return (
    <Settings_block_calib header={`прочее`}
      settings_type={`misc_calib`}
      // save_handler={handleClick_save}
      >
      {authGlobalState.auth_access.calib_extend &&
       <>
        <Syslog_calib
        updateHandler={props.clickHandler}
        logData={miscCalibState.sys_log} />
        <Account_manage_calib
        updateHandler={props.clickHandler}
        userData={miscCalibState.user_list} />
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
       </>
      }
      <li
        key='res_conf_manage'
        id='res_conf_manage'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Управление резерв. конфигурациями
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`res_conf_save_input`}
            name={`res_conf_save`}
            clickHandler={handleChange_save}
            label='Сохр.'
            type="button" />
          <FormInput
            id={`res_conf_load_input`}
            name={`res_conf_load`}
            clickHandler={handleChange_save}
            label='Загр.'
            type="button" />
        </div>
      </li>
      <li
        key='factory_reset_manage'
        id='factory_reset_manage'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Сброс к заводским настройкам
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`factory_reset_input`}
            name={`factory_reset`}
            clickHandler={handleClick_save}
            label='Сброс'
            type="button" />
          <FormInput
            id={`save_as_factory_input`}
            name={`save_as_factory`}
            clickHandler={handleChange_save}
            label='Сохр. как завод.'
            type="button" />
        </div>
      </li>
      <Hex_upload
        updateHandler={props.clickHandler} />
      <li
        key='amp_supply_calib'
        id='amp_supply_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`amp_supply_calib_input`}
            className="settings_itemLabel">
            Питание усилителя
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`amp_supply_calib_save`}
            name={`amp_supply_calib`}
            changeHandler={handleChange_save}
            input_value={miscCalibState.amp_supply}
            type="switch" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default MiscCalibSettings
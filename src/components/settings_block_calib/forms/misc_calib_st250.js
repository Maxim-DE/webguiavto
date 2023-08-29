import React from 'react';

import Settings_block_calib from '..';
import Syslog_calib from './syslog_calib';
import Account_manage_calib from './account_manage_calib';
import Hex_upload from './hex_upload';
import ChannelEnablerSettings from './channel_enabler_calib';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../logic/utilites';

function MiscCalibSettings_ST250(props) {
  const calibMisc_store = useSelector((store) => {
    if (deepKeyExists(store, 'calib_misc')) {
      return store.globalStore.global_data.calib_state.data?.calib_misc
    } else return {}
  }),
        auth_store = useSelector((store) => store.authStore.auth_data)


  const [miscCalibState, setMiscCalibState] = React.useState({
    sys_log: [],
    user_list: [],
  })

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (calibMisc_store == undefined) {
      return
    }

    if (Object.keys(calibMisc_store).length == 0) {
      return
    }

    let calib_state_copy = miscCalibState

    for (const key in calibMisc_store) {
      calib_state_copy[key] = calibMisc_store[key]
    }

    setMiscCalibState(calib_state_copy)

  }, [calibMisc_store])

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

  const handleClick_deleteUserLogs = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = 1

    const request_obj = {
      address: 'calib_misc.cgi',
      data: `${name}$${value}`,
      reducer: reducers.delete_user_logs,
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
      {auth_store.auth_access.calib_extend &&
        <>
          <Syslog_calib
            updateHandler={props.clickHandler}
            logData={miscCalibState.sys_log} />
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
                clickHandler={handleClick_deleteUserLogs}
                label='Удалить'
                type="button" />
            </div>
          </li>
          <li
            key='delete_syslogs_calib'
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
                name={`delete_sys_logs_calib`}
                clickHandler={handleClick_save}
                label='Удалить'
                type="button" />
            </div>
          </li>
          <li className="group_divider"></li>
          <ChannelEnablerSettings
            clickHandler={props.clickHandler}
            calib_data={calibMisc_store}
            editing_allowed={true}/>
        </>
      }
      <li className="group_divider"></li>
      <Account_manage_calib
        updateHandler={props.clickHandler}
        userData={miscCalibState.user_list} />
      {/* <li className="group_divider"></li> */}
      {/* <li
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
      </li> */}
      {/* <Hex_upload
        updateHandler={props.clickHandler} /> */}
    </Settings_block_calib>
  )
}

export default MiscCalibSettings_ST250
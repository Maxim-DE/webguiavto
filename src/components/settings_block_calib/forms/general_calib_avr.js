import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';
import { reducers as coreReducers } from '../../../store/reducers/core_store_reducers';
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/avr_control_reducers';

function GeneralCalibSettings_AVR({ calib_state, clickHandler, ...props }) {
  // const calib_state = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_general),
  const auth_store = useSelector((store) => store.authStore.auth_data)

  const [generalCalibState, setGeneralCalibState] = React.useState({
    def_module: 0,
    fan_start_alarm: 0,
    tftp: 0,
    input_test_pic_enable: 0,
    output_test_pic_enable: 0,
  })

  // const [auth_store, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!calib_state) {
      return
    } 

    if (Object.keys(calib_state).length != 0 || calib_state != undefined) {
      let calib_state_copy = generalCalibState

      for (const key in calib_state) {
        calib_state_copy[key] = calib_state[key]
      }

      setGeneralCalibState(calib_state_copy)

    }
  }, [calib_state])

  const handleChange_save = (event) => {
    let target = event.target;
    let value = target.type === 'checkbox' ? Number(target.checked) : target.value
    let name = target.name.replace('_calib', '');

    setGeneralCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))

    value = typeof value === 'boolean' ? Number(value) : value

    const request_obj = {
      address: 'calib_general.cgi',
      data: `${name}$${value}`,
      reducer: reducers.save_avr_device_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
  
      save_data: {
        calib_general: {
          [name]: value
        }
      }
    }
  
    clickHandler(request_obj);
  }

  const handleClick_save = (event) => {
      const target = event.target,
            name = target.name.replace('_calib', ''),
            value = generalCalibState[name]

    const request_obj = {
      address: 'calib_general_vesrion.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_general: {
          [name]: value
        }
      }
    }

    clickHandler(request_obj);

  }

  const handleReboot = () => {
    const request_obj = {
      address: 'reboot_device.cgi',
      reducer: coreReducers.reboot_device,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj);
  }

  const handleReboot_reserved = () => {
    const request_obj = {
      address: 'reboot_reserved_device.cgi',
      reducer: coreReducers.reboot_device,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    clickHandler(request_obj);
  }

  return (
    <Settings_block_calib header={`основ. настройки`}
    settings_type={`general_calib`}>
      {auth_store.auth_access.calib_extend &&
      <>
        <li
          key='input_test_pic_enable_calib'
          id='input_test_pic_enable_calib'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`input_test_pic_enable_calib_input`}
              className="settings_itemLabel">
              Блок ВХОД_ТЕСТ на картинке
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`input_test_pic_enable_calib_input`}
              name={`input_test_pic_enable_calib`}
              changeHandler={handleChange_save}
              input_value={generalCalibState.input_test_pic_enable}
              type="switch" />
          </div>
        </li>
        <li
          key='output_test_pic_enable_calib'
          id='output_test_pic_enable_calib'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`output_test_pic_enable_calib_input`}
              className="settings_itemLabel">
              Блок АФУ_0 на картинке
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`output_test_pic_enable_calib_input`}
              name={`output_test_pic_enable_calib`}
              changeHandler={handleChange_save}
              input_value={generalCalibState.output_test_pic_enable}
              type="switch" />
          </div>
        </li>
      </>
      }
      <li
        key='tftp_calib'
        id='tftp_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`tftp_calib_input`}
            className="settings_itemLabel">
            Загрузчик (TFTP порт 69)
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`tftp_calib_input`}
            name={`tftp_calib`}
            changeHandler={handleChange_save}
            input_value={!!generalCalibState.tftp}
            type="switch" />
        </div>
      </li>
      <li
        key='reboot_device_calib'
        id='reboot_device_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`reboot_device_calib_input`}
            className="settings_itemLabel">
            Перезагрузка устройств
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`reboot_reserved_device_calib_input`}
            name={`reboot_reserved_deviceb`}
            clickHandler={handleReboot_reserved}
            label='Перезагрузить рез. ПРД'
            type="button" />
          <FormInput
            id={`reboot_avr_calib_input`}
            name={`reboot_avr_calib`}
            clickHandler={handleReboot}
            label='Перезагрузить АВР'
            type="button" />
        </div>
      </li>
      {/* <li
        key='reboot_avr_calib'
        id='reboot_avr_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`reboot_device_calib_input`}
            className="settings_itemLabel">
            Перезагрузка АВР
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`reboot_device_calib_input`}
            name={`reboot_device_calib`}
            clickHandler={handleReboot}
            label='Перезагрузить'
            type="button" />
        </div>
      </li> */}
    </Settings_block_calib>
  )
}

export default GeneralCalibSettings_AVR
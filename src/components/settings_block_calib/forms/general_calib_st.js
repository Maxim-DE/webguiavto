import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

function GeneralCalibSettings_ST(props) {

  const [generalCalibState, setGeneralCalibState] = React.useState({
    def_module: 0,
    fan_start_alarm: 0,
  })

  const [authGlobalState, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (!props.calib_data) {
      return
    } 

    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = generalCalibState

      for (const key in props.calib_data) {
        calib_state_copy[key] = props.calib_data[key]
      }

      setGeneralCalibState(calib_state_copy)

    }
  }, [props.calib_data])

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
  
    props.clickHandler(request_obj);
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

    props.clickHandler(request_obj);

  }

  const handleReboot = () => {
    const request_obj = {
      address: 'reboot_device.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib header={`общее`}
    settings_type={`general_calib`}>
      {authGlobalState.auth_access.calib_extend &&
      <>
      <li
        key='def_module_calib'
        id='def_module_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`def_module_calib_input`}
            className="settings_itemLabel">
            Выкл/вкл модуль защиты
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`def_module_calib_input`}
            name={`def_module_calib`}
            changeHandler={handleChange_save}
            input_value={!!generalCalibState.def_module}
            type="switch" />
        </div>
      </li>
      <li
        key='fan_start_alarm_calib'
        id='fan_start_alarm_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`fan_start_alarm_calib_input`}
            className="settings_itemLabel">
            Оповещение вент. при запуске
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`fan_start_alarm_calib_input`}
            name={`fan_start_alarm_calib`}
            changeHandler={handleChange_save}
            input_value={!!generalCalibState.fan_start_alarm}
            type="switch" />
        </div>
      </li>
      <li className="group_divider"></li>
      </>
      }
      <li
        key='reboot_device_calib'
        id='reboot_device_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`reboot_device_calib_input`}
            className="settings_itemLabel">
            Перезагрузка устройства
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
      </li>
    </Settings_block_calib>
  )
}

export default GeneralCalibSettings_ST
import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

function SerialNumVersionCalibSettings_AVR(props) {
  const calibSerialNumVersion_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_serialNum)

  const info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info),
        device_arr = Object.keys(info_section_data).length > 0 ? info_section_data.info_general.device_type_list : [],
        device_type = Object.keys(info_section_data).length > 0 ? info_section_data.info_general.type : 0

  const [serialNumVersionCalibState, setSerialNumVersionCalibState] = React.useState({
    device_serial_num: '',
    commutaion_serial_num: '',
  })
  
  const device_power_table = [
    { index: 0, value: '10' },
    { index: 1, value: '50' },
    { index: 2, value: '100' },
    { index: 3, value: '250' },
    { index: 4, value: '250-МК'},
    { index: 5, value: '300' },
    { index: 6, value: '500' },
    { index: 7, value: '1000' },
    { index: 8, value: '2000' },
    { index: 9, value: '5000' }
  ]

  const device_name_table = [
    { index: 0, value: 'УРЦ' },
    { index: 1, value: 'УСТ' },
    { index: 2, value: 'СТ' },
    { index: 3, value: 'РЦ' },
    { index: 4, value: 'БЛОК УПР.' }
  ]

  React.useEffect(() => {
    if (calibSerialNumVersion_store == undefined) return

    if (Object.keys(calibSerialNumVersion_store).length != 0) {
      let calib_state_copy = serialNumVersionCalibState

      for (const key in calibSerialNumVersion_store) {
        calib_state_copy[key] = calibSerialNumVersion_store[key]
      }

      setSerialNumVersionCalibState(calib_state_copy)

    }
  }, [calibSerialNumVersion_store])

  const device_type_handleChange = (event) => {
    const target = event.target;
    const name = target.name.replace('_calib', '');
    const value = target.value

    let state_array = serialNumVersionCalibState.device_type

    if (/series/gi.test(name)) {
      state_array[0] = Number(value)
    } else {
      state_array[1] = Number(value)
    }

    setSerialNumVersionCalibState(prevState => ({
      ...prevState,
      'device_type': state_array
    }))

  }

  const device_type_save = (event) => {
    const state_value = serialNumVersionCalibState.device_type,
          series_str = `series$${state_value[0]}`,
          pwr_str = `power$${state_value[1]}`
    
    const request_obj = {
      address: 'calib_serialNum_vesrion.cgi',
      data: `${series_str};${pwr_str}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_serialNum: {
          device_type: state_value
        }
      }
    }

    props.clickHandler(request_obj);
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setSerialNumVersionCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleChange_defence = (event) => {
    const target = event.target;
    const value = target.checked;
    const name = target.name.replace('_calib', '');

    setSerialNumVersionCalibState(prevState => ({
      ...prevState,
      [name]: + value
    }))

    const request_obj = {
      address: 'calib_serialNum_vesrion.cgi',
      data: `${name}$${+ value}`,
      reducer: reducers.calibration_form,
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
          value = serialNumVersionCalibState[name]

    const request_obj = {
      address: 'calib_serialNum_vesrion.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_form,
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

  return (
    <Settings_block_calib header={`ввод сер. номера`}
      settings_type={`voltage_primary_calib`}>
      <li
        key='device_serial_num_calib'
        id='device_serial_num_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`device_serial_num_calib_input`}
            className="settings_itemLabel">
            Серийный номер устройства
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`device_serial_num_calib_input`}
            name={`device_serial_num_calib`}
            changeHandler={handleChange}
            input_value={serialNumVersionCalibState.device_serial_num}
            max_length={20}
            style={{ margin: '0', maxWidth: '235px' }}
            type="text" />
          <FormInput
            id={`device_serial_num_calib_save`}
            name={`device_serial_num_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='commutaion_serial_num_calib'
        id='commutaion_serial_num_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`commutaion_serial_num_calib_input`}
            className="settings_itemLabel">
            Серийный номер БКА
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`commutaion_serial_num_calib_input`}
            name={`commutaion_serial_num_calib`}
            changeHandler={handleChange}
            input_value={serialNumVersionCalibState.commutaion_serial_num}
            max_length={20}
            style={{ margin: '0', maxWidth: '235px' }}
            type="text" />
          <FormInput
            id={`device_serial_num_calib_save`}
            name={`commutaion_serial_num_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
          {/* <select
            id={`device_series_calib_input`}
            name={`device_series_calib`}
            style={{ width: 'auto' }}
            title='Тип'
            onChange={device_type_handleChange}
            value={serialNumVersionCalibState.device_type[0]}>
              <option value="" disabled selected hidden>Тип</option>
              {device_name_table.map(item => (
                <option key={item.index} value={item.index}>{item.value}</option>
              ))}      
          </select>
          <select
            id={`device_power_calib_input`}
            name={`device_power_calib`}
            style={{width: 'auto' }}
            title='Мощность'
            onChange={device_type_handleChange}
            value={serialNumVersionCalibState.device_type[1]}>
            <option value="" disabled selected hidden>Мощн.</option>
            {device_power_table.map(item => {
              if (serialNumVersionCalibState.device_type[0] != 3 && item.value == '250-МК') {
                return
              } else {
                return (
                <option key={item.index} value={item.index}>{item.value}</option>
                )
              }
            })}
          </select> */}
    </Settings_block_calib>
  )
}

export default SerialNumVersionCalibSettings_AVR
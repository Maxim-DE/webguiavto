import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function SerialNumVersionCalibSettings(props) {

  const [serialNumVersionCalibState, setSerialNumVersionCalibState] = React.useState({
    calib_defence: 1,
    device_serial_num: '',
    device_type: [1, 1]
  })
  
  const device_power_table = [
    { index: 0, value: '10' },
    { index: 1, value: '50' },
    { index: 2, value: '100' },
    { index: 3, value: '250' },
    { index: 4, value: '300' },
    { index: 5, value: '500' },
    { index: 6, value: '1000' },
    { index: 7, value: '2000' },
    { index: 8, value: '5000' }
  ]

  const device_name_table = [
    { index: 0, value: 'УРЦ' },
    { index: 1, value: 'УСТ' },
    { index: 2, value: 'СТ' },
    { index: 3, value: 'БЛОК УПР.' }
  ]

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = serialNumVersionCalibState

      for (const key in props.calib_data) {
        calib_state_copy[key] = props.calib_data[key]
      }

      setSerialNumVersionCalibState(calib_state_copy)

    }
  }, [props.calib_data])

  const device_type_handleChange = (event) => {
    const target = event.target;
    const name = target.name.replace('_calib', '');
    const value = target.value


    let state_array = serialNumVersionCalibState.device_type

    if (/series/gi.test(name)) {
      state_array[0] = value
    } else {
      state_array[1] = value
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
      notifications: {
        good: 'default',
        bad: 'default'
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
      notifications: {
        good: 'default',
        bad: 'default'
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
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`ввод сер. номера и типа устр.`}
      settings_type={`voltage_primary_calib`}>
      <li
        key='calib_defence_calib'
        id='calib_defence_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`calib_defence_calib_input`}
            className="settings_itemLabel">
            Выкл/вкл защиту от калибровки
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`calib_defence_calib_input`}
            name={`calib_defence_calib`}
            changeHandler={handleChange_defence}
            input_value={serialNumVersionCalibState.calib_defence}
            type="switch" />
        </div>
      </li>
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
            style={{ margin: '0', maxWidth: '76px' }}
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
        key='device_type_calib'
        id='device_type_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`device_series_calib_input`}
            className="settings_itemLabel">
            Тип устройства
          </label>
        </div>
        <div className='item_input'>
          {/* <FormInput
            id={`device_type_calib_input`}
            name={`device_type_calib`}
            changeHandler={handleChange}
            input_value={serialNumVersionCalibState.device_type}
            style={{ margin: '0', maxWidth: '66px' }}
            type="text" /> */}

          <select
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
            {device_power_table.map(item => (
              <option key={item.index} value={item.index}>{item.value}</option>
            ))}
          </select>
          <FormInput
            id={`device_type_calib_save`}
            name={`device_type_calib`}
            clickHandler={device_type_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}

export default SerialNumVersionCalibSettings
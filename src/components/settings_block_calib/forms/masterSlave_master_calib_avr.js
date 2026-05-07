import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input';
import ModalCalib from '../../calib_modal';
import { PulseLoader } from 'react-spinners';
import { MdNetworkCheck } from 'react-icons/md';
import { IoMdInformationCircleOutline, IoMdClose } from 'react-icons/io';
import { HiOutlineRefresh } from 'react-icons/hi'
import { useSelector } from 'react-redux';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { reducers as core_reducers } from '../../../store/reducers/core_store_reducers';
import { dataArray_to_string } from '../../../logic/request_logic';

const baudrate_arr = [
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
]

export default function Modbus_master_AVR_calib(props) {
  const calibMasterSlave_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_modbus)

  const [masterSlaveCalibState, setMasterSlaveCalibState] = React.useState({
    master_form_available: 1,
    master_baudrate: 0,
    master_reserve_address: 0,
    master_main_address: 0,
    modbus_enable: 1
  })

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!calibMasterSlave_store) {
      return
    }
    if (Object.keys(calibMasterSlave_store).length != 0 || calibMasterSlave_store != undefined) {
      let calib_state_copy = {...masterSlaveCalibState}
      for (const key in calibMasterSlave_store) {
        // Преобразуем modbus_enable из 0/1 в boolean для правильной работы переключателя
        if (key === 'modbus_enable') {
          calib_state_copy[key] = Boolean(calibMasterSlave_store[key])
        } else {
          calib_state_copy[key] = calibMasterSlave_store[key]
        }
      }
      setMasterSlaveCalibState(calib_state_copy)
    }
  }, [calibMasterSlave_store])

  const handleChange = (event) => {
    const target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = masterSlaveCalibState[name]

    // Преобразуем для отправки на сервер
    let dataValue;
    if (name === 'modbus_enable') {
      // Для modbus: true (выкл) -> 0, false (вкл) -> 1
      dataValue = value ? 0 : 1;
    } else if (typeof value === 'boolean') {
      dataValue = value ? 0 : 1;
    } else {
      dataValue = value;
    }

    const request_obj = {
      address: 'calib_modbus_master.cgi',
      data: `${name}$${dataValue}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_modbus: masterSlaveCalibState
      }
    }

    props.clickHandler(request_obj);
  }

  const handleClick_saveBaud = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = baudrate_arr[masterSlaveCalibState[name]]

    const request_obj = {
      address: 'calib_modbus_master.cgi',
      data: `${name}$${value}`,
      reducer: core_reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_modbus: masterSlaveCalibState
      }
    }

    props.clickHandler(request_obj);
  }

  const handleClick_saveSelectArrs = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      value = Number(masterSlaveCalibState[name]) + 1

    const request_obj = {
      address: 'calib_modbus_master.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_modbus: masterSlaveCalibState
      }
    }

    props.clickHandler(request_obj);
  }
  
  return (
    <Settings_block_calib
      header={`modbus - master`}
      settings_type={`genera_modbus_slave_calib`} >

      {/* modbus */}
      <li
        key='modbus_enable'
        id='modbus_enable'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`modbus_enable_input`}
            className="settings_itemLabel">
            MODBUS-MATSTER  
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`modbus_enable_input`}
            name={`modbus_enable`}
            changeHandler={(e) => {
              handleChange(e)
              handleClick_save(e)
            }}
            type="switch" 
            input_value={masterSlaveCalibState.modbus_enable}/>
        </div>
      </li>
       

      <li
        key='master_baudrate_calib'
        id='master_baudrate_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`master_baudrate_input`}
            className="settings_itemLabel">
            Скорость передачи
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`master_baudrate_input`}
            name={`master_baudrate`}
            class="calib_input"
            disabled={!masterSlaveCalibState.master_form_available}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_baudrate}
            type="select"
            variants={baudrate_arr} />
          <FormInput
            id={`master_baudrate_save`}
            name={`master_baudrate`}
            disabled={!masterSlaveCalibState.master_form_available}
            clickHandler={handleClick_saveBaud}
            label='Сохранить'
            type="button" />
        </div>    

        {/* Адрес основного передатчика */}
        <div className='item_header'>
          <label
            htmlFor={`master_main_address_input`}
            className="settings_itemLabel">
            Адрес основного передатчика
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`slave_address_calib_input`}
            name={`master_main_address_calib`}
            disabled={!masterSlaveCalibState.master_form_available}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_main_address}
            type="select"
            variants={[...Array(10).keys()].map(i => i + 1)} />
          <FormInput
            id={`master_main_address_save`}
            name={`master_main_address`}
            disabled={!masterSlaveCalibState.master_form_available}
            clickHandler={handleClick_saveSelectArrs}
            label='Сохранить'
            type="button" />
        </div>

        {/* Адрес резервного передатчика */}
        <div className='item_header'>
          <label
            htmlFor={`master_reserve_address_input`}
            className="settings_itemLabel">
            Адрес резервного передатчика
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`slave_address_calib_input`}
            name={`master_reserve_address_calib`}
            disabled={!masterSlaveCalibState.master_form_available}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_reserve_address}
            type="select"
            variants={[...Array(10).keys()].map(i => i + 1)} />
          <FormInput
            id={`master_reserve_address_save`}
            name={`master_reserve_address`}
            disabled={!masterSlaveCalibState.master_form_available}
            clickHandler={handleClick_saveSelectArrs}
            label='Сохранить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )
}
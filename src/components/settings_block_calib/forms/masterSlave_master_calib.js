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

const baudrate_arr = [
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
]


export default function Modbus_master_calib(props) {
  const calibMasterSlave_store = useSelector((store) => store.globalStore.global_data.calib_state.data?.calib_modbus)

  const [masterSlaveCalibState, setMasterSlaveCalibState] = React.useState({
    master_form_availiable: 1,
    master_baudrate: 0,
    master_req_period: '',
    master_timeout: '',
    device_list: {
      saved_list: [
        { 
          id: '12', 
          type: 'УРЦ-100/300', 
          order_number: 1, 
          firm_ver: 'DigitalExciter_v1.5.14', 
          protocol_ver: '3', 
          address: '254', 
          device_info: {
            CountBusRequests: 65534,
            ErrorCountSlaveCrc16: 0,
            CountRequests: 61320,
            ErrorCountSlaveNoResponse: 61244,
            ErrorCountSlaveNAK: 0,
            IsSumRequestsValid: "false"
          } 
        }
      ],
      active_edit_device: {

      }
    }
  })

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!calibMasterSlave_store) {
      return
    }

    if (Object.keys(calibMasterSlave_store).length != 0 || calibMasterSlave_store != undefined) {
      let calib_state_copy = masterSlaveCalibState

      for (const key in calibMasterSlave_store) {
        calib_state_copy[key] = calibMasterSlave_store[key]
      }

      setMasterSlaveCalibState(calib_state_copy)

    }
  }, [calibMasterSlave_store])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name.replace('_calib', '')

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value

    if (name === 'master_baudrate') {
      value = baudrate_arr[masterSlaveCalibState[name]]
    } else {
      value = masterSlaveCalibState[name]
    }

    const request_obj = {
      address: 'calib_modbus_master.cgi',
      data: `${name}$${value}`,
      reducer: reducers.calibration_data,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_masterSlave: masterSlaveCalibState
      }
    }

    props.clickHandler(request_obj);
  }

  const handleFormDisable = (event) => {
    const target = event.target,
      value = target.type === 'checkbox' ? target.checked : target.value

    setMasterSlaveCalibState(prevState => ({
      ...prevState,
      master_form_availiable: value
    }))

    const req_obj = {
      address: 'calib_modbus_master.cgi',
      data: `master_form_availiable$${value}`,
      reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },

      save_data: {
        calib_masterSlave: masterSlaveCalibState
      }
    }

    props.clickHandler(req_obj)
  }

  const doGetDeviceList = () => {
    const req_obj = {
      address: 'modbus_get_device_list.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(req_obj)
  }

  return (
    <Settings_block_calib
      header={`modbus - master`}
      disabled={!masterSlaveCalibState.master_form_availiable}
      disableHandler={handleFormDisable}
      settings_type={`genera_modbus_slave_calib`} >
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
            disabled={!masterSlaveCalibState.master_form_availiable}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_baudrate}
            type="select"
            variants={baudrate_arr} />
          <FormInput
            id={`master_baudrate_save`}
            name={`master_baudrate`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='master_req_period_calib'
        id='master_req_period_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`master_req_period_input`}
            className="settings_itemLabel">
            Период запросов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`master_req_period_input`}
            name={`master_req_period`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            class="calib_input"
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_req_period}
            type="text" />
          <FormInput
            id={`master_req_period_save`}
            name={`master_req_period`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='master_timeout_calib'
        id='master_timeout_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`master_timeout_input`}
            className="settings_itemLabel">
            Таймаут
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`master_timeout_input`}
            name={`master_timeout`}
            class="calib_input"
            disabled={!masterSlaveCalibState.master_form_availiable}
            changeHandler={handleChange}
            input_value={masterSlaveCalibState.master_timeout}
            type="text" />
          <FormInput
            id={`master_timeout_save`}
            name={`master_timeout`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='sys_logs_calib'
        id='sys_logs_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`account_manage_calib_input`}
            className="settings_itemLabel">
            Управление списком slave-устройств
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`account_manage_calib_input`}
            name={`account_manage_calib`}
            disabled={!masterSlaveCalibState.master_form_availiable}
            clickHandler={(e) => {
              setIsOpen(true);
              doGetDeviceList()
              // setIsLoading(true)
            }}
            label='Открыть'
            type="button" />
        </div>
      </li>
      {isOpen &&
        <ModalCalib
          header='управление списком устройств'
          setIsOpen={(e) => {
            setIsOpen(false)
          }}
          user_controllable={true}
          class='acc_manage_modal'>
          {isLoading ?
            <>
              <div className='hex_upload_message_wrap'>
                <PulseLoader
                  color="#bbcacf"
                  loading
                  margin={9}
                  size={13}
                  speedMultiplier={0.5}
                />
                <span className='hex_upload_upload_message'>
                  Идет получение списка устройств...
                </span>
              </div>
            </> :
            <>
              <table className="log_list_table modbus_master">
                <thead className="logs_header">
                  <tr>
                    <td>тип</td>
                    <td>адрес</td>
                    <td>№</td>
                    <td>ver. прошивки</td>
                    <td>ver. протокола</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody className="user_log log_list">
                  {masterSlaveCalibState.device_list.saved_list.map((device, index) => (
                    <Slave_instance
                      device_info_obj={device}
                      clickHandler={props.clickHandler} />
                  ))}
                </tbody>
              </table>
              <div className="acc_list_actions_wrap">
                <FormInput
                  id={`calib_password_save`}
                  name={`calib_password`}
                  clickHandler={(e) => {
                    doGetDeviceList()
                  }}
                  class='log_refresh'
                  label='Обновить список устройств'
                  type="button"
                />
              </div>
            </>
          }
        </ModalCalib>
      }
    </Settings_block_calib>
  )
}



const Slave_instance = ({device_info_obj, ...rest}) => {

  const [isExpanded, setIsExpanded] = React.useState(false)

  const doCheckDeviceConnection = ({ id }) => {
    const req_obj = {
      address: 'check_device.cgi',
      data: `id$${id}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    rest.clickHandler(req_obj)
  }

  const doCheckDeviceInfo = ({ address }) => {
    const req_obj = {
      address: 'Diagnostic.cgi',
      data: `address$${address}`,
      reducer: reducers.device_info_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    rest.clickHandler(req_obj)
  }

  const doResetDeviceInfo = ({ address }) => {
    const req_obj = {
      address: 'ResetDiagnostic.cgi',
      data: `address$${address}`,
      reducer: reducers.device_info_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)

    rest.clickHandler(req_obj)
  }

  return (
    <>
    <tr
      key={device_info_obj.id}
      id={`user_${device_info_obj.id}`}
      className={`acc_item`}>
      <td className='acc_login'>
        {device_info_obj.type}
      </td>
      <td className='acc_password'>
        {device_info_obj.address}
      </td>
      <td>{device_info_obj?.order_number}</td>
      <td>{device_info_obj.firm_ver}</td>
      <td>{device_info_obj.protocol_ver}</td>
      <td className="acc_actions">
        <FormInput
          id={`sys_logs_calib_input`}
          name={`sys_logs_calib`}
          title='Проверить связь'
          clickHandler={(e) => {
            doCheckDeviceConnection({
              id: device_info_obj.id
            })
          }}
          label={
            <MdNetworkCheck style={{ margin: "3px 0px 0" }} />
          }
          type="button" />
        <FormInput
          id={`sys_logs_calib_input`}
          name={`sys_logs_calib`}
          title='Проверить связь'
          clickHandler={(e) => {
            if (!isExpanded) {
              doCheckDeviceInfo({
                address: device_info_obj.address
              })
            }

            setIsExpanded(!isExpanded)
          }}
          label={isExpanded ?
            <IoMdClose style={{ margin: "3px 0px 0" }} /> :
            <IoMdInformationCircleOutline style={{ margin: "3px 0px 0" }} />
          }
          type="button" />
      </td>
    </tr>
    {isExpanded &&
      <div className="device_adiitional_info">
        {device_info_obj.device_info !== undefined &&
         Object.keys(device_info_obj.device_info).length !== 0 &&
        <ul>
            {Object.entries(device_info_obj.device_info).map((info_item) => (
              <li className='info_item'>
                <span className="info_label">{info_item[0]}</span>
                <span className="info_value">{info_item[1]}</span>
              </li>
            ))}
          <li className='actions_item'> 
            <FormInput
              id={`refresh_modbus_device_info_input`}
              name={`refresh_modbus_device_info`}
              clickHandler={(e) => {
                doCheckDeviceInfo({
                  address: device_info_obj.address
                })
              }}
              label={<HiOutlineRefresh style={{ margin: "3px 0px 0" }} />}
              title={`Обновить`}
              type="button" />
            <FormInput
              id={`reset_modbus_device_info_input`}
              name={`reset_modbus_device_info`}
              clickHandler={(e) => {
                doResetDeviceInfo({
                  address: device_info_obj.address
                })
              }}
              label='Сбросить все счетчики'
              type="button" />
          </li>
        </ul>
        }
        {(device_info_obj.device_info == undefined ||
         Object.keys(device_info_obj.device_info).length == 0) &&
         <span>Данные об устройстве отсутсвуют.</span>
        }
      </div>
    }
    </>
    
  )
}
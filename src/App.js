import React, { useContext } from 'react';
import logo from './logo.png';

import './App.css';

import 'react-toastify/dist/ReactToastify.css';
import './components/notifications/index.css'

import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep';
import { filter_obj, reload_page } from './logic/utilites'

import { showErrorMessage, showSuccessMessage, showInfoMessage } from './components/notifications/notifications_utilites';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import { type_device_toStr } from './logic/output_data_management';
import { async_Fetch_queue } from './logic/request_logic';
import { add_info_to_conf } from './components/custom_groups/conf_manage_settings';
import { set_logs_id, syslog_handle_expand } from './logic/syslog_handle_expand';

import Links_list from './components/links_list'
import PeripheralMenu from './components/peripheral_menu'
import StatusSection from "./components/status_section"
import CalibSection from './components/calib_section';

import CalibLogButton from './components/calib_log_button';
import { NoConf_placeholder } from './components/device_assets/unknown_device/sections/no_conf';

import { device_name_table, device_power_table } from './components/status_section';

import DeviceWrap_ST250 from './components/device_assets/st_250';
import DeviceWrap_RE100 from './components/device_assets/re_100';
import DeviceWrap_unknown from './components/device_assets/unknown_device';

import useGlobalStore from './logic/auth_store';
import useGlobalErrPool from './logic/err_store';
import useSectionStore from './logic/sectionsRefs_store';
import { useInView } from './logic/useInView_hook';
import { fetch_error_handler } from './logic/fetch_error_handler';

const status_settings_item = [
  { id: 'device_supply_switch', name: "Питание передатчика", type: "switch" },
  // { id: 'rds_mode_switch', name: "Включить RDS", type: "switch" },
  { id: 'freq_control', name: "Изменение цастоты, МГц", type: "text" },
  { id: 'output_control', name: "Изменение мощности, Вт", type: "text_buttons" },
];

let debounceTimer;

function App() {

  // глобальное состояние ошибок
  const [errGlobalState, errGlobalActions] = useGlobalErrPool()

  // очередь запросов
  const [requestPool, setRequestPool] = React.useState({
    state: 'active',
    pool: [],
    error_pool: [],
    delayed_pool: []
  })
  
  // глобальное состояние авторизации
  const [authGlobalState, authGlobalActions] = useGlobalStore()
  
  // данные раздела статуса
  const [statusData, setStatusData] = React.useState({
    status_info: null,
    status_graph: null,
    status_svg: {
      img: ''
    },
    status_logs: null,
    status_full_logs: null,
    calib_adc: null,
    status_peripheral: null,
    calib_available: 0
  })
  
  // данные разделов
  const [sectionData, setSectionData] = React.useState({
    status_settings: null,
    settings: null,
    network: null,
    rds: null,
    info: null,
  })
  
  // данные бокового нижнего меню
  const [peripheralData, setPeripheralData] = React.useState({
    structure: [],
  })
  
  // состояние раздела калибровки
  const [calibState, setCalibState] = React.useState({
    isOpen: false,
    data: {},
  })

  const nav_ref = React.useRef()
  
  // функция для обработки данных, полученных с сетевых запросов
  const outputData_assignment = (output_name, output_data, output_params) => {

    // обработка данных о бокового нижнего меню
    if (output_name === 'peripheral_structure') {
      setPeripheralData(prevState => ({
        ...prevState,
        structure: output_data[`structure`],
      }))

    // обработка данных статуса
    } else if (/^status/.test(output_name)) {
      let status_state_copy = statusData;
      for (const key in output_data) {
        status_state_copy[key] = output_data[key];
      }
      setStatusData(status_state_copy)

      if (errGlobalState.status_err_count > 0) {
        errGlobalActions.err_erase('status')
      }
    
    // обработка данных картинки в разделе статуса
    } else if (/media\/status_graph/gi.test(output_name)) {

      let status_state_copy = statusData;
      let output_obj = {
        img: output_data
      }
      status_state_copy.status_svg = output_obj;

      setStatusData(prevState => ({
        ...prevState,
        status_svg: output_obj,
      }))
    
    // обработка полного лога ошибок
    } else if (output_name === 'GetLogErrorFull') {
      if (typeof output_param == 'string' &&
          output_params.length == 0) return

      // обработка пользовательского журнала
      if (Object.hasOwn(output_params, 'userlog')) {
        let output_data_copy = cloneDeep(output_data.userlog)

        setStatusData((prevState) => {
          return {
            ...prevState,
            status_full_logs: set_logs_id(output_data_copy)
          }
        })
      
      // обработка системного журнала
      } else if (Object.hasOwn(output_params, 'syslog')) {
        setCalibState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            calib_misc: {
              ...prevState.data.calib_misc,
              sys_log: set_logs_id(output_data.syslog)
            }
          }
        }))
      }
    } 

    // обработка развернутых логов
    else if (output_name === 'get_expanded_log') {
      if (typeof output_param == 'string' &&
          output_params.length == 0) return
      
      let log_id = 0

      if (Object.hasOwn(output_params, 'log_num')) {
        log_id = output_params.log_num
      }

      // обработка развернутых логов польз. журнала
      if (Object.hasOwn(output_params, 'userlog')) {
        let log_data = JSON.parse(JSON.stringify(statusData.status_full_logs))
        let new_log_data = syslog_handle_expand(output_data, log_data, log_id)
  
        setStatusData(prevState => ({
          ...prevState,
          status_full_logs: new_log_data
        }))

      // обработка развернутых логов системного журнала
      } else if (Object.hasOwn(output_params, 'syslog')) {
        let log_data = cloneDeep(calibState.data.calib_misc.sys_log),
            new_log_data = syslog_handle_expand(output_data, log_data, log_id)
  
        setCalibState(prevState => ({
          ...prevState,
          data: {
            ...prevState.data,
            calib_misc: {
              ...prevState.data.calib_misc,
              sys_log: new_log_data
            }
          }
        }))
      }

    // обработка информации о конфигурации
    } else if (output_name === 'get_conf_info') {
      if (output_params.length == 0) return

      let conf_name = output_params.name
      let conf_data = cloneDeep(sectionData.settings.conf_manage)
      // Обновляем информацию о конфигурации
      let new_conf_data = add_info_to_conf(output_data, conf_data, conf_name)

      setSectionData(prevState => ({
        ...prevState,
        settings: {
          ...prevState,
          conf_manage: new_conf_data
        }
      }))
    
    // обработка данных калибровки
    } else if (output_name === 'calibration') {
      setCalibState(prevState => ({
        ...prevState,
        data: output_data
      }))
    
    // очистка данных авторизации при выходе из аккаунта
    } else if (output_name === 'logout') {
      authGlobalActions.set_is_auth(false)
      authGlobalActions.set_user_id('')
      authGlobalActions.set_auth_level(0)
      
    // обработка запросов, связанные с измением состояния калибровки
    } else if (/^calib_.*/gi.test(output_name)) {
      // если запрос на калибровку нуля, то пропускаем его, иначе он собъет все данные
      if (output_name.includes('_zero')) return

      if (output_name === 'calib_conf_file') {
        // Перезагружаем страницу после сброса настроек калибровки по умолчанию
        if (Object.hasOwn(output_params, 'factory_reset')) {
          reload_page()
        }
      }

      if (output_name === 'calib_misc') {
        // Перезагружаем страницу после сброса настроек калибровки по умолчанию
        if (Object.hasOwn(output_params, 'delete_user_logs')) {
          setStatusData((prevState) => {
          return {
            ...prevState,
            status_logs: null,
            status_full_logs: null
          }
        })
        }
      }

      // если запрос без данных на сохранение, то пропускаем, иначе сломается хранилище
      if (Object.keys(output_data).length == 0) return
      // Обновляем данные авторизации после успешной авторизации
      if (output_name === 'calib_passw') {
        authGlobalActions.set_is_auth(true)
        authGlobalActions.set_user_id(output_params.login)
        authGlobalActions.set_auth_level(output_data.auth_info.auth_level)
        return
      }

      // Обновляем данные калибровки при обычном запросе с форм калибровки
      setCalibState(prevState => ({
        ...prevState,
        data: output_data
      }))

     // Оработка запросов, связанных с редактированием списка пользователей
    } else if (output_name === 'get_user_list' ||
               output_name === 'edit_user' ||
               output_name === 'delete_user' ||
               output_name === 'register_user') {
                
      setCalibState(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          calib_misc: {
            ...prevState.data.calib_misc,
            user_list: output_data.user_list
          }
        }
      }))
    
    // обработка запросов на обновление данных основных настроек
    } else if (output_name === 'status_settings' ||
               output_name === 'settings' ||
               output_name === 'network' ||
               output_name === 'rds' ||
               output_name === 'info') {
      let output_data_copy

      switch (output_name) {
        case 'info':
          // Преобразуем тип устройства в строковый формат для отображения в интерфейсе (при наличии в ответе)
          if (Object.hasOwn(output_data.info_general, 'type')) {
            output_data_copy = type_device_toStr(output_data)
          } else {
            output_data_copy = output_data
          }
          
          break;
      
        default:
          output_data_copy = output_data
          break;
      }

      // Обновляем разделы настроек и информации о статусе устройства
      setSectionData((prevState) => {
        return {
          ...prevState,
          [output_name]: output_data_copy,
        }
      })

    // обработка запросов с формы настроек в разделе статуса
    } else if (output_name === 'transmitter') {
      setSectionData((prevState) => ({
        ...prevState,
        status_settings: output_data,
      }))
      
    } else if (output_name === 'reboot_device') {
      // Блокируем отправку запросов и перезагружаем страницу после перезагрузки устройства
      setRequestPool(prevState => ({
        ...prevState,
        state: 'blocked'
      }))

      reload_page()
    } else {
      return
    }
  }

  React.useEffect(() => {
     // Очищаем таймер задержки и проверяем, есть ли запросы в очереди
    clearTimeout(debounceTimer);
    if (requestPool.pool.length > 0) {
       // Если есть запросы, запускаем таймер задержки
      debounceTimer = setTimeout(() => {
        // Функция для обработки очереди запросов
        const async_queue_processing = async (queue_arr) => {
          // Очищаем очередь запросов
          setRequestPool(prevState => ({
            ...prevState,
            pool: []
          }))
          
          // Отправляем запросы и получаем ответы
          let queue_resp = await async_Fetch_queue(queue_arr)

          // Обрабатываем ответы на запросы
          for (let index = 0; index < queue_resp.length; index++) {
            const req_queue_data = queue_arr[index] // данные, передаваемые вместе с запросом
            const req_resp = queue_resp[index] // данные, полученные из ответа на запрос
            const resp_status = req_resp.status

            // Обрабатываем уведомления
            if (req_queue_data.notifications) {
              switch (resp_status) {
                case 'success':
                  if (req_queue_data.notifications.good == 'default') {
                    if (Object.hasOwn(req_resp.data, 'Notific')) {
                      const message = `${req_resp.data.Notific.text}`,
                            status = req_resp.data.Notific.status
    
                      switch (status) {
                        case 'ok':
                          toast.success(message, { autoClose: 1500 })
                          break;
    
                        case 'error':
                          toast.error(message, { autoClose: 1500 })
                          break;
    
                        default:
                          break;
                      }

                    } else {
                      toast.success(`Успешно`, { autoClose: 1500 })
                    }
                  } else if (req_queue_data.notifications.good != 'none') {
                    toast.success(req_queue_data.notifications.good, { autoClose: 1500 })
                  }
                  
                  break;

                case 'error':
                  fetch_error_handler(errGlobalActions, req_resp)

                  if (req_queue_data.notifications.bad == 'default') {
                    if (Object.hasOwn(req_resp.data, 'Notific')) {
                        const message = `${req_resp.data.Notific.text}`,
                              status = req_resp.data.Notific.status
  
                        toast.error(message, { autoClose: 1500 })
                    } else {
                      toast.error(`${req_resp.data.message}`, { autoClose: 1500 })
                    }
                  } else if (req_queue_data.notifications.bad == 'none') {
                    continue
                  } else {
                    toast.error(req_queue_data.notifications.bad, { autoClose: 1500 })
                  }

                  break;
              
                default:
                  break;
              }
            }


            // Обрабатываем данные ответа на запрос
            const request_name = req_resp.name,
                  request_params = req_resp.params,
                  remote_data = typeof req_resp.data === 'object' ? 
                  filter_obj(req_resp.data, (key, value) => !key.includes('Notific')) :
                  req_resp.data,
                  local_data = req_queue_data.save_data ? req_queue_data.save_data : {}

              let req_data,
                  state_copy = {},
                  new_state

              if ((Object.keys(remote_data).length > 0) ||
                  (Object.keys(local_data).length > 0)) {

                if (Object.keys(remote_data).length > 0) {
                  req_data = remote_data
                } else if (Object.keys(local_data).length > 0) {
                  req_data = req_queue_data.save_data
                }
                
                // копируем нужное состояние в зависимости от имени запроса
                switch (request_name) {
                  case 'status':
                    state_copy = JSON.parse(JSON.stringify(statusData))
                    break;

                  case 'transmitter':
                    state_copy = JSON.parse(JSON.stringify(sectionData.status_settings))
                    break;

                  case 'settings':
                    state_copy = JSON.parse(JSON.stringify(sectionData.settings))
                    break;
  
                  case 'network':
                    state_copy = JSON.parse(JSON.stringify(sectionData.network))
                    break;
  
                  case 'rds':
                    state_copy = JSON.parse(JSON.stringify(sectionData.rds))
                    break;

                  case 'info' :
                    state_copy = JSON.parse(JSON.stringify(sectionData.info))
                    break;
                  
                  case request_name.match(/^calib_.*/)?.input:
                    state_copy = JSON.parse(JSON.stringify(calibState.data))
                    break;
  
                  default:
                    outputData_assignment(request_name, req_data, request_params)
                    continue;
                }
              } else {
                req_data = {}
              }
              
              // производим слияние данных с ответа и копией состояния
              new_state = merge(state_copy, req_data)

              outputData_assignment(request_name, new_state, request_params);
          }


        }

        let queue = requestPool.pool
        async_queue_processing(queue)
      }, 200)
    }
  }, [requestPool.pool])

  React.useEffect(() => {

    console.log(requestPool.state);

  }, [requestPool.state])

  React.useEffect(() => {
    // Проверяем наличие информации в разделе
    if (sectionData.info) {
      // Если информации о правах доступа нет, то устанавливаем уровень доступа 0(низший)
      if (!Object.hasOwn(sectionData.info, 'auth_info')) {
        authGlobalActions.set_auth_level(0)
        return
      } 

      // Если информация о правах доступа есть, то устанавливаем уровень доступа и авторизацию
      const auth_info = sectionData.info.auth_info
      console.log(auth_info);
      authGlobalActions.set_auth_level(auth_info.auth_level)

      if (auth_info.auth_level > 0) {
        authGlobalActions.set_is_auth(true)
        authGlobalActions.set_user_id(auth_info.auth_id)
      }
    }
  }, [sectionData.info])



  React.useEffect(() => {

    // Объект с запросом информации
    let request_obj = {
      address: `info.cgi`,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (info)`
        }
      },
    }

    // Отправляем запрос информации
    handlePoolUpdate(request_obj);

  }, [])

  const handlePoolUpdate = (requestData) => {

    // Обрабатываем запросы на управление очередью
    if (requestData.action) {
      switch (requestData.action) {
        case 'block_queue':
          setRequestPool(prevState => ({
            ...prevState,
            state: 'blocked'
          }))
          return;
          
        case 'unblock_queue':
          setRequestPool(prevState => ({
            ...prevState,
            state: 'active'
          }))
          return;

        default:
          break;
      }
    }

    // Добавляем запрос в очередь, если очередь активна
    if (requestPool.state == 'active') {
      setRequestPool(prevState => ({
        ...prevState,
        pool: prevState.pool.concat(requestData),
      })) 
    } 
    // Если очередь заблокирована, выводим сообщение в консоль
    else if (requestPool.state == 'blocked') {
      console.log('its blocked');
    } 
  }

  const navRefUpdate = (nav_link_name) => {
    // Обновляем ссылку на раздел в навигации и прокручиваем к ней страницу
    nav_ref.current = document.getElementById(`${nav_link_name}_section`)
    if (nav_ref.current != null) {
      nav_ref.current.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }



  return (
    <>
      {/* Контейнер с уведомлениями */}
      <ToastContainer
        transition={Zoom}
      />

      <div className="App">
        <nav>
          <div className="nav_header">
            <a href="okbalfa.ru/">
            {/* <img src={logo} className="app_logo" /> */}
            ОКБ АЛЬФА
            </a>
          </div>
          {/* Компонент с ссылками на разделы */}
          <Links_list 
            updateHandler={navRefUpdate}
            calibaAvailable={statusData.calib_available} />
          <div className='nav_fillblock'></div>
          {/* Компонент с боковым нижним меню */}
          {/* <PeripheralMenu
            updateHandler={handlePoolUpdate}
            structure={peripheralData.structure}
            data={statusData} /> */}
        </nav>
        <div className='main_wrap'>
          <header>

            <h1>{sectionData.info ? `${sectionData.info.info_general.Type_Device} №${sectionData.info.info_general.serial_number}` :
                                    '...'}</h1>
            <CalibLogButton 
              updateHandler = {handlePoolUpdate}
              isAuthComplete = {authGlobalState.is_auth}/>
          </header>
          <main>
            {sectionData.info && sectionData.info.info_general.type[0] != 250 &&
              <StatusSection
                section_name="status"
                section_header="Статус"
                updateHandler={handlePoolUpdate}
                status_data={statusData.status_info}
                graph_data={statusData.status_graph}
                graph_svg={statusData.status_svg}
                logs_data={statusData.status_logs}
                full_logs_data={statusData.status_full_logs}
                settings_data={sectionData.status_settings}
                device_type={sectionData.info ? sectionData.info.info_general.type : ''}
                pool_state = {requestPool.state}
                err_count={errGlobalState.status_err_count}
                err_pool_actions={errGlobalActions} /> 
            }
            {/* Сообщение об отсутсвии конфигурации */}
            {sectionData.info && sectionData.info.info_general.type[0] == 250 &&
              <NoConf_placeholder />
            }
            
            {/* Обертка для разных типов устройств */}
            {authGlobalState.auth_access.settings &&
              <DeviceWrap_switch
                device_type={sectionData.info ? sectionData.info.info_general.type : [0, 0]}
                updateHandler={handlePoolUpdate}
                section_data={sectionData}
                calib_data={calibState.data}
                adc_data={statusData.calib_adc} />
            }
          </main>
        </div>
      </div>
    </>
  );
}

function DeviceWrap_switch({device_type, ...props}) {

  // Получаем тип устройства из таблицы имен и мощностей устройств
  const device_name = device_name_table[device_type[0]],
        device_power = device_power_table[device_type[1]],
        device_type_str = `${device_name}_${device_power}`

  // Получаем состояние и действия для хранения ссылок на секции(разделы)
  const [sectionState, sectionActions] = useSectionStore()

  // Используем хук useInView для отслеживания видимых элементов
  const observed_elements = useInView(sectionState.section_pool)

  // Обновляем пул секций(разделов) в хранилище состояний при изменении отслеживаемых элементов
  React.useEffect(() => {
    sectionActions.refresh_intersection_pool(observed_elements)
  }, [observed_elements])

  // Определяем тип устройства и возвращаем соответствующий компонент
  if (device_type_str === 'st_250' ||
      device_type_str === 'st_100') {
    return (
      <DeviceWrap_ST250
        updateHandler={props.updateHandler}
        section_data={props.section_data}
        calib_data={props.calib_data}
        adc_data={props.adc_data} />
    )    
  } else if (device_type_str === 'unknown_0') {
    return (
      <DeviceWrap_unknown
        updateHandler={props.updateHandler} />
    )
  } else if (device_type_str === 're_100') {
    return (
      <DeviceWrap_RE100
        updateHandler={props.updateHandler}
        section_data={props.section_data}
        calib_data={props.calib_data}
        adc_data={props.adc_data} />
    )
  } else {
    return (
      <DeviceWrap_unknown
        updateHandler={props.updateHandler} />
    )
  }
}


export default App;

import React from 'react';

import './App.css';

import 'react-toastify/dist/ReactToastify.css';
import './components/notifications/index.css';

import { filter_obj } from './logic/utilites';

import { ToastContainer, toast, Zoom } from 'react-toastify';

import { async_Fetch_queue } from './logic/request_logic';

import Links_list from './components/links_list';
import StatusSection from "./components/status_section";

import CalibLogButton from './components/calib_log_button';
import { NoConf_placeholder } from './components/device_assets/unknown_device/sections/no_conf';


import DeviceWrap_unknown from './components/device_assets/unknown_device';


import useSectionStore from './logic/sectionsRefs_store';
import { useInView } from './logic/useInView_hook';
import { fetch_error_handler } from './logic/fetch_error_handler';
import { useDispatch, useSelector } from 'react-redux';
import { reqReducers_wrap } from './store/req_reducers_wrap';
import { reducers } from './store/reducers/core_store_reducers';
import PeripheralMenu from './components/peripheral_menu';

import DeviceWrap_BlockControl from './components/device_assets/block_control';
import { Route, Routes } from 'react-router-dom';

let debounceTimer;

function App() {

        // данные раздела информации
  const info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info),
        // данные раздела статуса
        status_section_data = useSelector((store) => store.globalStore.global_data.status_data),
        // глобальное состояние авторизации
        auth_store = useSelector((store) => store.authStore.auth_data)

  // строка имени устройства
  let device_arr = [],
      device_type = 0,
      deviceName_string = ''
      
  if (info_section_data.info_general) {
    device_arr = info_section_data.info_general.device_type_list ? info_section_data.info_general.device_type_list : [],
    device_type = info_section_data.info_general.model ? info_section_data.info_general?.model : 0
    deviceName_string = Object.keys(info_section_data).length > 0 ? `${device_arr[device_type]} №${info_section_data.info_general.serial_number}` : '...'
  }

  // очередь запросов
  const [requestPool, setRequestPool] = React.useState({
    state: 'active',
    pool: [],
    error_pool: [],
    delayed_pool: []
  })

  const nav_ref = React.useRef(),
        header_ref = React.useRef()
  
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
                    if (Object.prototype.hasOwnProperty.call(req_resp.data, 'Notific')) {
                      const message = `${req_resp.data.Notific.text}`,
                        status = req_resp.data.Notific.status

                      switch (status) {
                        case 'ok':
                          toast.success(message, { autoClose: 1500 })
                          break;

                        case 'error':
                          toast.error(message, { autoClose: 1500 })
                          break;

                        case 'warning':
                          toast.warning(message, { autoClose: 1500 })
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
                  fetch_error_handler(req_resp)

                  if (req_queue_data.notifications.bad == 'default') {
                    if (Object.prototype.hasOwnProperty.call(req_resp.data, 'Notific')) {
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

                  if (req_queue_data.error_handler) {
                    req_queue_data.error_handler()
                  }

                  continue

                default:
                  continue
              }
            }


            // Обрабатываем данные ответа на запрос
            const request_name = req_resp.name,
                  request_params = req_resp.params,
                  remote_data = typeof req_resp.data === 'object' ?
                    filter_obj(req_resp.data, (key, value) => !key.includes('Notific')) :
                    req_resp.data,
                  local_data = req_queue_data.save_data ? req_queue_data.save_data : {}


            let req_data

            if ((Object.keys(remote_data).length > 0) ||
              (Object.keys(local_data).length > 0)) {

              if (Object.keys(remote_data).length > 0) {
                req_data = remote_data
              } else if (Object.keys(local_data).length > 0) {
                req_data = req_queue_data.save_data
              }

            } else {
              req_data = {}
            }

            // Объект для редюсера в Redux
            let redux_payload = {
              name: request_name,
              data: {
                resp_obj: req_data,
                params: request_params
              }
            }

            if (req_queue_data.reducer) {
              reqReducers_wrap({
                payload_obj: redux_payload,
                reducer: req_queue_data.reducer
              })
            }
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

    // Объект с запросом информации
    let request_obj = {
      address: `info.cgi`,
      reducer: reducers.section_data,
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

    if (nav_ref.current == null) {
      nav_ref.current = document.getElementById(`sections_group_wrap`)
    }

    const scrollTarget = nav_ref.current;
  
    const topOffset = header_ref.current != undefined ? header_ref.current.offsetHeight + scrollTarget.offsetLeft : 0;
    const elementPosition = scrollTarget.getBoundingClientRect().top;
    const offsetPosition = elementPosition - topOffset;
  
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
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
            <a href="http://okbalfa.ru/" target='_blank' rel='noopener noreferrer'>
            {/* <img src={logo} className="app_logo" /> */}
            ОКБ АЛЬФА
            </a>
            {/* <span className='version_info_span'>Версия: {sectionData.info?.software_version?.os_version}</span> */}
          </div>
          {/* Компонент с ссылками на разделы */}
          <Links_list 
            updateHandler={navRefUpdate}
            requestHandler={handlePoolUpdate}
            device_type={device_type} />
          <div className='nav_fillblock'></div>
          {/* Компонент с боковым нижним меню */}
          <PeripheralMenu
            updateHandler={handlePoolUpdate}
            data={status_section_data}
            software_version={info_section_data?.software_version?.os_version} />
        </nav>
        <div className='main_wrap'>
          <header ref={header_ref}>

            <h1>{deviceName_string}</h1>
            <CalibLogButton 
              updateHandler = {handlePoolUpdate}
              isAuthComplete = {auth_store.is_auth}/>
          </header>
          <main>
            {Object.keys(info_section_data).length > 0 && info_section_data.info_general.model != 255 &&
              <StatusSection
                section_name="status"
                section_header="Статус"
                updateHandler={handlePoolUpdate}
                pool_state = {requestPool.state}
                 /> 
            }
            {/* Сообщение об отсутсвии конфигурации */}
            {Object.keys(info_section_data).length > 0 && info_section_data.info_general.model == 255 &&
              <>
              <NoConf_placeholder />
              <DeviceWrap_unknown
                updateHandler={handlePoolUpdate} />
              </>
            }
            <div id='sections_group_wrap' className="sections_group_wrap">
              <DeviceWrap_switch
                device_type={device_type}
                device_type_name={device_arr[device_type]}
                updateHandler={handlePoolUpdate}
                // section_data={sectionData}
                // calib_data={calibState.data}
                adc_data={status_section_data.calib_adc} />
            {/* {auth_store.auth_access.settings &&
              } */}
            </div>
            {/* Обертка для разных типов устройств */}
          </main>
        </div>
      </div>
    </>
  );
}

function DeviceWrap_switch({ device_type, device_type_name, ...props }) {

  // Получаем тип устройства из таблицы имен и мощностей устройств
  const device_type_str = `${device_type_name}`

  // Получаем состояние и действия для хранения ссылок на секции(разделы)
  const [sectionState, sectionActions] = useSectionStore()

  // Используем хук useInView для отслеживания видимых элементов
  // const observed_elements = useInView(sectionState.section_pool)
  
  // Обновляем пул секций(разделов) в хранилище состояний при изменении отслеживаемых элементов
  // React.useEffect(() => {
    //   sectionActions.refresh_intersection_pool(observed_elements)
    // }, [observed_elements])
    
    // Определяем тип устройства и возвращаем соответствующий компонент
    if (device_type === 255) {
      // return (
      //   <DeviceWrap_unknown
      //     updateHandler={props.updateHandler} />
      // )
    } else {
      return (
        <DeviceWrap_BlockControl
          updateHandler={props.updateHandler}
          // section_data={props.section_data}
          // calib_data={props.calib_data}
          adc_data={props.adc_data} />
      )
  }
  // switch (device_type) {
  //   case  0:
    
  //   case 1:
  //     return (
  //       <DeviceWrap_REAmp
  //         updateHandler={props.updateHandler}
  //         // section_data={props.section_data}
  //         // calib_data={props.calib_data}
  //         adc_data={props.adc_data} />
  //     )

  //   case 2:
  //     return (
  //       <DeviceWrap_REAmp
  //         updateHandler={props.updateHandler}
  //         // section_data={props.section_data}
  //         // calib_data={props.calib_data}
  //         adc_data={props.adc_data} />
  //     )

  //   case 3:
  //     return (
  //       <DeviceWrap_REAmp
  //         updateHandler={props.updateHandler}
  //         // section_data={props.section_data}
  //         // calib_data={props.calib_data}
  //         adc_data={props.adc_data} />
  //     )
    
  //   default:
  // }

  
  // if (device_type_str.includes('СТ')) {
  //   return (
  //     <DeviceWrap_ST250
  //       updateHandler={props.updateHandler}
  //       // section_data={props.section_data}
  //       // calib_data={props.calib_data}
  //       adc_data={props.adc_data} />
  //   )    
  // } else if (device_type === 255) {
  //   return (
  //     <DeviceWrap_unknown
  //       updateHandler={props.updateHandler} />
  //   )
  // } else if (device_type_str.includes('РЦ')) {
  //   return (
  //     <DeviceWrap_RE100
  //       updateHandler={props.updateHandler}
  //       // section_data={props.section_data}
  //       // calib_data={props.calib_data}
  //       adc_data={props.adc_data} />
  //   )
  // } else if (device_type_str.includes('УРЦ') ||
  //            device_type_str.includes('УСТ')) {
  //   return (
  //     <DeviceWrap_REAmp
  //       updateHandler={props.updateHandler}
  //       // section_data={props.section_data}
  //       // calib_data={props.calib_data}
  //       adc_data={props.adc_data} />
  //   )
  // }
  // else {
  //   return (
  //     <DeviceWrap_unknown
  //       updateHandler={props.updateHandler} />
  //   )
  // }
}


export default App;

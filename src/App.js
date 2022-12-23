import React, { useContext } from 'react';
import logo from './logo.png';

import './App.css';

import 'react-toastify/dist/ReactToastify.css';
import './components/notifications/index.css'

import merge from 'lodash/merge'
// import { cloneDeep } from 'lodash/cloneDeep';

import { showErrorMessage, showSuccessMessage, showInfoMessage } from './components/notifications/notifications_utilites';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import { type_device_toStr } from './logic/output_data_management';
import { async_Fetch_queue } from './logic/request_logic';

import Links_list from './components/links_list'
import PeripheralMenu from './components/peripheral_menu'
import StatusSection from "./components/status_section"
import CalibSection from './components/calib_section';

import CalibLogButton from './components/calib_log_button';

import DeviceWrap_ST250 from './components/device_assets/st_250';

import useGlobalStore from './logic/auth_store';

const status_settings_item = [
  { id: 'device_supply_switch', name: "Питание передатчика", type: "switch" },
  // { id: 'rds_mode_switch', name: "Включить RDS", type: "switch" },
  { id: 'freq_control', name: "Изменение цастоты, МГц", type: "text" },
  { id: 'output_control', name: "Изменение мощности, Вт", type: "text_buttons" },
];

let debounceTimer;

function App() {

  const [requestPool, setRequestPool] = React.useState({
    state: 'active',
    pool: [],
    error_pool: [],
  })
  
  const [authGlobalState, authGlobalActions] = useGlobalStore()

  const [statusData, setStatusData] = React.useState({
    status_info: null,
    status_graph: null,
    status_svg: {
      img: ''
    },
    status_logs: null,
    status_full_logs: null,
    status_settings: null,
    calib_adc: null,
    calib_available: 0
  })
  
  const [sectionData, setSectionData] = React.useState({
    settings: null,
    network: null,
    rds: null,
    info: null,
  })

  const [peripheralData, setPeripheralData] = React.useState({
    structure: [],
  })


  const [calibState, setCalibState] = React.useState({
    isOpen: false,
    data: {},
  })

  const nav_ref = React.useRef()

  const outputData_assignment = (output_name, output_data) => {

    if (output_name === 'peripheral_structure') {
      setPeripheralData(prevState => ({
        ...prevState,
        structure: output_data[`structure`],
      }))

    } else if (/^status/.test(output_name)) {
      let status_state_copy = statusData;
      for (const key in output_data) {
        status_state_copy[key] = output_data[key];
      }
      setStatusData(status_state_copy)

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

    } else if (output_name === 'GetLogErrorFull') {

      let status_state_copy = statusData;
      for (const key in output_data) {
        status_state_copy[key] = output_data[key];
      }

      setStatusData(status_state_copy)

    } else if (output_name === 'SysLog') {
      setCalibState(prevState => ({
        ...prevState,
        data: {
          ...prevState.data,
          calib_misc: {
            ...prevState.data.calib_misc,
            sys_log: output_data
          }
        }
      }))
      
    } else if (output_name === 'calibration') {
      setCalibState(prevState => ({
        ...prevState,
        data: output_data
      }))

    } else if (output_name === 'calib_passw') {
      authGlobalActions.set_is_auth(true)
      authGlobalActions.set_auth_level(3)

    } else if (/^calib_.*/g.test(output_name)) {
      setCalibState(prevState => ({
        ...prevState,
        data: output_data
      }))
    } else {
      let output_data_copy

      switch (output_name) {
        case 'info':
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

      setSectionData(prevState => ({
        ...prevState,
        [output_name]: output_data_copy,
      }))
    }
  }

  React.useEffect(() => {
    clearTimeout(debounceTimer);
    if (requestPool.pool.length > 0) {
      debounceTimer = setTimeout(() => {
        const async_queue_processing = async (queue_arr) => {
          let queue_resp = await async_Fetch_queue(queue_arr)

          for (let index = 0; index < queue_resp.length; index++) {
            const req_queue_data = queue_arr[index]
            const req_resp = queue_resp[index]
            const resp_status = req_resp.status

            if (req_queue_data.notifications) {
              switch (resp_status) {
                case 'success':
                  if (req_queue_data.notifications.good == 'default') {
                    if (Object.hasOwn(req_resp.data, 'Notific')) {
                      const message = `${req_resp.data.Notific.text} (${req_resp.name})`,
                            status = req_resp.data.Notific.status
    
                      switch (status) {
                        case 'ok':
                          toast.success(message, { autoClose: 1500 })
                          break;
    
                        case 'error':
                          toast.error(message, { autoClose: 1500 })
                          continue;
    
                        default:
                          break;
                      }

                    } else {
                      toast.success(`Успешно (${req_resp.name})`, { autoClose: 1500 })
                    }
                  } 
                  
                  break;

                case 'error':
                  if (req_queue_data.notifications) {
                    if (req_queue_data.notifications.bad == 'default') {
                      toast.error(`Ошибка (${req_resp.name})`, { autoClose: 1500 })
                    } else {
                      toast.error(req_queue_data.notifications.bad, { autoClose: 1500 })
                    }
                  }

                  break;
              
                default:
                  break;
              }
            }


            if (resp_status == 'success') {
              let request_name = req_resp.name,
                  req_data

              if (Object.keys(req_resp.data).length == 1 &&
                  Object.hasOwn(req_resp.data, 'Notific')) {

                if (!req_queue_data.save_data) continue

                let state_copy = {},
                    save_data = req_queue_data.save_data,
                    new_state

                switch (request_name) {
                  case 'settings':
                    state_copy = JSON.parse(JSON.stringify(sectionData.settings))
                    break;

                  case 'network':
                    state_copy = JSON.parse(JSON.stringify(sectionData.network))
                    break;

                  case 'rds':
                    state_copy = JSON.parse(JSON.stringify(sectionData.rds))
                    break;

                  case request_name.match(/^calib_.*/)?.input:
                    state_copy = JSON.parse(JSON.stringify(calibState.data))
                    break;

                  default:
                    break;
                }

                new_state = merge(state_copy, save_data)

                req_data = new_state

                    
              } else {
                req_data = req_resp.data  
              }
              

              outputData_assignment(request_name, req_data);
            }
          }
        }

        let queue = requestPool.pool
        async_queue_processing(queue)

        setRequestPool(prevState => ({
          ...prevState,
          pool: []
        }));
      }, 200)
    }
  }, [requestPool.pool])

  React.useEffect(() => {
    if (sectionData.info) {
      if (!Object.hasOwn(sectionData.info, 'auth_info')) {
        authGlobalActions.set_auth_level(0)
        return
      } 

      const auth_info = sectionData.info.auth_info
      console.log(auth_info);
      authGlobalActions.set_auth_level(auth_info.auth_level)
    }
  }, [sectionData.info])

  React.useEffect(() => {

    let request_obj = {
      address: `info.cgi`,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (info)`
        }
      },
    }

    handlePoolUpdate(request_obj);

  }, [])

  const handlePoolUpdate = (requestData) => {
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

    if (requestPool.state == 'active') {
      setRequestPool(prevState => ({
        ...prevState,
        pool: prevState.pool.concat(requestData),
      })) 
    } else if (requestPool.state == 'blocked') {
      
      if (requestData.address == "status") {
        return
      }

      showInfoMessage(`Дождитесь завершения предыдуших запросов`, { autoClose: 1500 })
    }

  }

  const navRefUpdate = (nav_link_name) => {
    nav_ref.current = document.getElementById(`${nav_link_name}_section`)
    nav_ref.current.scrollIntoView({ block: "center", behavior: "smooth" })
  }



  return (
    <>
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
          <Links_list 
            updateHandler={navRefUpdate}
            calibaAvailable={statusData.calib_available} />
          <div className='nav_fillblock'></div>
          <PeripheralMenu
            updateHandler={handlePoolUpdate}
            structure={peripheralData.structure}
            data={statusData} />
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
            <StatusSection
              section_name="status"
              section_header="Статус"
              updateHandler={handlePoolUpdate}
              status_data={statusData.status_info}
              graph_data={statusData.status_graph}
              graph_svg={statusData.status_svg}
              logs_data={statusData.status_logs}
              full_logs_data={statusData.status_full_logs}
              settings_data={statusData.status_settings}
              device_type={sectionData.info ? sectionData.info.info_general.type : ''} />

            {authGlobalState.auth_access.settings &&
              <DeviceWrap_ST250
                updateHandler={handlePoolUpdate}
                sectionData={sectionData} />
            }
            
            {!!statusData.calib_available &&
             authGlobalState.auth_access.calib &&
             
              <CalibSection section_name="calibration"
                            section_header="калибровка"
                            section_data={calibState.data}
                            updateHandler={handlePoolUpdate}
                            adc_data={statusData.calib_adc} />

            }
          </main>
        </div>
      </div>
    </>
  );
}

export default App;

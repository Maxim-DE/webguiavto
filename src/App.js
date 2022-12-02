import React from 'react';
import logo from './logo.png';

import './App.css';

import 'react-toastify/dist/ReactToastify.css';
import './components/notifications/index.css'

import { showErrorMessage, showSuccessMessage } from './components/notifications/notifications_utilites';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import { type_device_toStr } from './logic/output_data_management';
import { async_Fetch_queue } from './logic/request_logic';

import Links_list from './components/links_list'
import PeripheralMenu from './components/peripheral_menu'
import StatusSection from "./components/status_section"
import CalibSection from './components/calib_section';
import SettingsSection from "./components/settings_section"

import CalibLogButton from './components/calib_log_button';

const status_settings_item = [
  { id: 'device_supply_switch', name: "Питание передатчика", type: "switch" },
  // { id: 'rds_mode_switch', name: "Включить RDS", type: "switch" },
  { id: 'freq_control', name: "Изменение цастоты, МГц", type: "text" },
  { id: 'output_control', name: "Изменение мощности, Вт", type: "text_buttons" },
];

const settings_map = [
  {
    section_id: 'settings',
    section_name: 'общие настройки',
    section_blocks: [
      {
        settings_type: 'time_settings',
        settings_header: 'задание времени',
        settings_items: [
          {id: 'date', name: "Дата", type: "text"},
          {id: 'time', name: "Время", type: "text"},
          // {id: 'supply_schedule', name: "Настройки расписания", type: "custom_group"},
          // {id: 'supply_schedule', name: "Настройки расписания", type: "group", items:[
          //   {id: 'supply_period', name: "Период работы", type: "text_range"},
          // ]},
        ],
        // additional_items: [
        //   { id: 'time_server_sync', name: "Синхронизация времени с сервером", type: "custom_group" }
        // ]
      },
      // {
      //   settings_type: 'silence_det_settings',
      //   settings_header: 'настройки тишины',
      //   settings_items: [
      //     {id: 'silence_det_settings', name: "Включить детектор тишины", type: "custom_group"}
      //   ]
      //   // [
      //   //   {id: 'border_on', name: "Порог на вкл.", type: "text"},
      //   //   {id: 'react_time_on', name: 'Время реакции', type: 'text_range'},
      //   //   {id: 'border_off', name: "Порог на выкл.", type: "text"},
      //   //   {id: 'react_time_off', name: 'Время реакции', type: 'text_range'}
      //   // ],
      // },
      // {
      //   settings_type: 'misc_settings',
      //   settings_header: 'прочие настройки',
      //   settings_items: [
      //     {id: 'request_period', name: "Период запросов, мс", type: "text"},
      //     {id: 'bootloader_enabled_switch', name: "Включить Bootloader", type: "switch"},
      // ],
      // },
    ],
  },
  {
    section_id: 'network',
    section_name: 'сетевые настройки',
    section_blocks: [
      {
        settings_type: 'device_adress',
        settings_header: 'адрес устройства',
        settings_items: [
          {id: 'mac_deafult', name: "Дефолтный MAC-адрес", type: "text"},
          {id: 'mac', name: "MAC-адрес", type: "text"},
          {id: 'ip', name: "IP-адрес", type: "text"},
          {id: 'subnet_mask', name: "Маска подсети", type: "text"},
          {id: 'gateway', name: "Шлюз", type: "text"},
        ],
      },
      {
        settings_type: 'remote_control',
        settings_header: 'управление устройством',
        settings_items: [
          {id: 'remote_ip_addr_1', name: "IP-адрес 1", type: "text"},
          {id: 'remote_ip_addr_2', name: "IP-адрес 2", type: "text"},
          {id: 'remote_ip_addr_3', name: "IP-адрес 3", type: "text"},
          {id: 'remote_ip_addr_4', name: "IP-адрес 4", type: "text"},
        ],
      },
      {
        settings_type: 'snmp_agent',
        settings_header: 'SNMP-агент',
        settings_items: [
          {id: 'community_read', name: "Community Read", type: "text"},
          {id: 'community_write', name: "Community Write", type: "text"},
          {id: 'mib_file_download', name: "Загрузить MIB-файл", type: "custom_group"},
          // {id: 'trap_settings', name: "Настройки TRAP-сервера", type: "group", items:[
          //   {id: 'trap_ip', name: "IP-адрес", type: "text"},
          //   {id: 'trap_port', name: "Порт", type: "text"},
          //   {id: 'trap_community', name: "Сommunity", type: "text"},
          // ]}
        ],
      },
    ],
  },
  // {
  //   section_id: 'rds_settings',
  //   section_name: 'rds-настройки',
  //   section_blocks: [
  //     {
  //       settings_type: 'rds_general_settings',
  //       settings_header: 'общие настройки',
  //       settings_items: [
  //         {id: 'tp_checkbox', name: 'TP', type: 'checkbox'},
  //         {id: 'ta_checkbox', name: 'TA', type: 'checkbox'},
  //         {id: 'pi', name: "PI", type: "text"},
  //         {id: 'ps_name', name: "PS Name", type: "text_large_split"},
  //         {id: 'radio_text', name: "Radio text", type: "text_large"},
  //       ],
  //     },
  //   ],
  // },
  {
    section_id: 'info',
    section_name: 'Данные об устройстве',
    section_blocks: [
      {
        settings_type: 'info_general',
        settings_header: 'общее',
        settings_items: [
          {id: 'serial_number', name: "Серийный номер", type: "text_sample"},
          {id: 'plate_number', name: "Номер платы", type: "text_sample"},
          {id: 'plate_version', name: "Ревизия платы", type: "text_sample"},
          // {id: 'time_from_on', name: "Время с моента включения", type: "text_sample"},
          // {id: 'time_failure_on', name: "Наработка наотказ с вкл. усил., ч", type: "text_sample"},
          // {id: 'time_failure_off', name: "Наработка наотказ с выкл. усил., ч", type: "text_sample"},
          {id: 'memory_type', name: "Тип памяти", type: "text_sample"},
        ],
      },
      {
        settings_type: 'software_version',
        settings_header: 'версия по',
        settings_items: [
          {id: 'os_version', name: "Версия прошивки", type: "text_sample"},
          // {id: 'bootloader_version', name: "Версия загрузчика", type: "text_sample"},
          // {id: 'audio_version', name: "Версия Audio", type: "text_sample"},
        ],
      },
    ],
  },

];


let debounceTimer;

function App() {


  const [requestPool, setRequestPool] = React.useState({
    state: 'active',
    pool: [],
    error_pool: [],
  })
  
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
                          break;
    
                        default:
                          break;
                      }
                    }
                  } else {
                    toast.success(`Успешно (${req_resp.name})`, { autoClose: 1500 })
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

            if (Object.keys(req_resp.data).length == 1 &&
                Object.hasOwn(req_resp.data, 'STATUS')) {
                  return
            }

            if (resp_status == 'success') {
              let request_name = req_resp.name,
                  req_data = req_resp.data  
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

    console.log(logo)
  }, [requestPool.pool])

  const nav_ref = React.useRef()

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
    }

  }

  const navRefUpdate = (nav_link_name) => {
    nav_ref.current = document.getElementById(`${nav_link_name}_section`)
    nav_ref.current.scrollIntoView({ block: "start", behavior: "smooth" })
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
          {/* <PeripheralMenu
            updateHandler={handlePoolUpdate}
            structure={peripheralData.structure}
            data={statusData.status_graph} /> */}
        </nav>
        <div className='main_wrap'>
          <header>
            <h1>{sectionData.info ? `${sectionData.info.info_general.Type_Device} №${sectionData.info.info_general.serial_number}` :
                                    '...'}</h1>
            <CalibLogButton 
              updateHandler = {handlePoolUpdate}/>
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
              
              {
                settings_map.map(item => (
                  <SettingsSection
                    key={item.section_id}
                    section_name={item.section_id}
                    section_header={item.section_name}
                    blocks={item.section_blocks}
                    updateHandler={handlePoolUpdate}
                    section_data={sectionData[item.section_id]}
                  />
                  ))
              }
            {!!statusData.calib_available &&
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

import React from 'react';
import debounce from 'lodash.debounce';
import logo from './logo.png';
import './App.css';

import useFetch from './components/hooks'
import {updatePool, sectionData_format} from './logic/request_logic'
import { showErrorMessage, showSuccessMessage } from './components/notifications/notifications_utilites';

import Links_list from './components/links_list'
import PeripheralMenu from './components/peripheral_menu'
import StatusSection from "./components/status_section"
import SettingsSection from "./components/settings_section"

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
          {id: 'supply_schedule', name: "Настройки расписания", type: "custom_group"},
          // {id: 'supply_schedule', name: "Настройки расписания", type: "group", items:[
          //   {id: 'supply_period', name: "Период работы", type: "text_range"},
          // ]},
        ],
        additional_items: [
          { id: 'time_server_sync', name: "Синхронизация времени с сервером", type: "custom_group" }
        ]
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
      {
        settings_type: 'misc_settings',
        settings_header: 'прочие настройки',
        settings_items: [
          {id: 'request_period', name: "Период запросов, мс", type: "text"},
          {id: 'bootloader_enabled_switch', name: "Включить Bootloader", type: "switch"},
          {id: 'conf_file_upload', name: "Внеш. файл настроек", type: "custom_group"},
        ],
      },
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
          {id: 'serlial_number', name: "Серийный номер", type: "text_sample"},
          {id: 'plate_number', name: "Номер платы", type: "text_sample"},
          {id: 'plate_version', name: "Версия платы", type: "text_sample"},
          {id: 'time_from_on', name: "Время с моента включения", type: "text_sample"},
          {id: 'time_failure_on', name: "Наработка наотказ с вкл. усил., ч", type: "text_sample"},
          {id: 'time_failure_off', name: "Наработка наотказ с выкл. усил., ч", type: "text_sample"},
          {id: 'memory_type', name: "Тип памяти", type: "text_sample"},
        ],
      },
      {
        settings_type: 'software_version',
        settings_header: 'версия по',
        settings_items: [
          {id: 'os_version', name: "Версия прошивки", type: "text_sample"},
          {id: 'bootloader_version', name: "Версия загрузчика", type: "text_sample"},
          {id: 'audio_version', name: "Версия Audio", type: "text_sample"},
        ],
      },
    ],
  },

];

let debounceTimer;

function App() {

  const [requestPool, setRequestPool] = React.useState({
    pool: []
  })
  
  const [statusData, setStatusData] = React.useState({
    status_info: null,
    status_graph: null,
    status_logs: null,
    status_settings: null,
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

    } else {
      setSectionData(prevState => ({
        ...prevState,
        [output_name]: output_data,
      }))
    }

  }

  React.useEffect(() => {
    clearTimeout(debounceTimer);
    
    if (requestPool.pool.length > 0) {

      // let state_copy = JSON.parse(JSON.stringify(sectionData));

      debounceTimer = setTimeout(() => {
        const pool_state = requestPool.pool;
        console.log('cached pool state');
        console.log(pool_state);
          
        pool_state.forEach((request, k) => {
          const last_index = pool_state.length - 1;
          
          setTimeout(() => {
            console.log('do do' + k);
            console.log(request);
            
            const host = "192.168.1.21"
            const query = request.name + '.cgi';
            const data = request.data ? `?${request.data}` : '';
            const url = `http://${host}/${query}${data}`;
      
            const test_url = "http://192.168.1.114/GetDebug.CGI"

            console.log(url);
            
            fetch(url)
            .then(res => res.json())
            .then(
              (result) => {
                console.log('harosh');
                outputData_assignment(request.name, result);
                console.dir(result);
                // sectionData_format(state_copy, item.name, result);
                // if (i == requestPool.pool.length) {
                //   setSectionData(state_copy);
                // }
                // showSuccessMessage("", 'Сохранено');
                
              },

              (error) => {
                // showErrorMessage("", error.message);
                console.log('sasi zhopu sukka');
                console.dir(error);
              })

          }, 150 * k);
  
          if (k == last_index) {
            setRequestPool({
              pool: []
            });
  
            console.log('done');
            
          }
  
        });
      }, 200)
    }

  }, [requestPool])

  const handlePoolClick = (event) => {
    const req_test_obj = {
      name: 'test',
      data: []
    }

    handlePoolUpdate(req_test_obj)
  }

  const handlePoolUpdate = (requestData) => {   
    setRequestPool(prevState => ({
      pool: prevState.pool.concat(requestData),
    }))

  }

  return (
    <>
      {/* <div>gfsj</div> */}
      <div className="App">
        <nav>
          <div className="nav_header">
            <a href="http://okbalfa.ru/">
            <img src={logo} className="app_logo" />
          </a>
          </div>
          <Links_list />
          <input type="button" value="добавить в очередь" onClick={handlePoolClick} />
          <div className='nav_fillblock'></div>
          <PeripheralMenu
            updateHandler={handlePoolUpdate}
            structure={peripheralData.structure}
            data={statusData.status_graph} />
        </nav>
        <div className='main_wrap'>
          <header>
            <h1>fm-трансмиттер</h1>
            {/* <span className="log_button"></span> */}
          </header>
          <main>
            <StatusSection
              section_name="status"
              section_header="Статус"
              updateHandler={handlePoolUpdate}
              status_data={statusData.status_info}
              graph_data={statusData.status_graph}
              logs_data={statusData.status_logs}
              settings_data={statusData.status_settings}
              settings_map={status_settings_item} />
              {
                settings_map.map(item => (
                  <SettingsSection
                    section_name={item.section_id}
                    section_header={item.section_name}
                    blocks={item.section_blocks}
                    updateHandler={handlePoolUpdate}
                    section_data={sectionData[item.section_id]}
                  />
                  ))
              }
          </main>
        </div>
      </div>
    </>
  );
}

export default App;

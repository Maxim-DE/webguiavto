import React from 'react'

import useGlobalStore from '../../../logic/auth_store'
import { useSelector } from 'react-redux'

import GeneralSettingsSection from './sections/general'
import NetworkSettingsSection from './sections/network'
import InfoSection from './sections/info'
import CalibSection from './sections/calib'
import { Route, Routes } from 'react-router-dom'
import { CalibMain } from './sections/calib/calib_main'
import { MiscCalib } from './sections/calib/misc'
import { DeveloperCalib } from './sections/calib/developer'
import RdsSettingsSection from './sections/rds'
import { AvrControl } from './sections/avr_control'
import { AvrDevicesCalib } from './sections/calib/avr_devices_calib'
import { SyslogCalib } from './sections/calib/syslog'
import { UserlogSection } from './sections/userlog'

export default function DeviceWrap_AVR1000(props) {

  const updateHandler = (data_block) => {
    props.updateHandler(data_block)
  }
  const auth_store = useSelector((store) => store.authStore.auth_data)
  const auth_level = useSelector((store) => store.authStore.auth_data.auth_level)
  // const [auth_store, authGlobalActions] = useGlobalStore()

  return (
    <>
    <Routes>
      <Route path='*' element={
        <>
        <Routes>
          <Route path='info' element={
            <InfoSection
              updateHandler={updateHandler}
              />
          } />
          <Route path='userlog' element={
            <UserlogSection
              updateHandler={updateHandler}
              />
          } />
          {auth_level >= 1 &&
          <>
            <Route path='settings' element={
              <GeneralSettingsSection
                updateHandler={updateHandler}
                />
            } />
            <Route path='network' element={
              <NetworkSettingsSection
                updateHandler={updateHandler}
                />
            } />
            <Route path='avr' element={
              <AvrControl
                section_name="avr"
                section_header="управление устройствами"
                updateHandler={updateHandler}
              />
            } />
          </>
          }

          {auth_level >= 2 &&
            <Route path='calibration'>
              <Route path='main' element={
                <CalibMain
                  section_name="calibration_main"
                  section_header="калибровка"
                  updateHandler={updateHandler}
                  // section_data={props.calib_data === null ? 'null' : props.calib_data}
                  // adc_data={props.adc_data} 
                  />
              } />
              <Route path='avr_calib' element={
                <AvrDevicesCalib
                  section_name="calibration_main"
                  section_header="калибровка"
                  updateHandler={updateHandler}
                // section_data={props.calib_data === null ? 'null' : props.calib_data}
                // adc_data={props.adc_data}
                />
              } />
              <Route path='misc' element={
                <MiscCalib
                  section_name="misc"
                  section_header="калибровка"
                  updateHandler={updateHandler}
                  // section_data={props.calib_data === null ? 'null' : props.calib_data}
                  // adc_data={props.adc_data} 
                  />
              } />
              <Route path='syslog' element={
                <SyslogCalib
                  section_name="syslog"
                  section_header="калибровка"
                  updateHandler={updateHandler}
                // section_data={props.calib_data === null ? 'null' : props.calib_data}
                // adc_data={props.adc_data} 
                />
              } />
              {auth_level >= 3 &&
                <Route path='developer' element={
                  <DeveloperCalib
                    section_name="developer"
                    section_header="калибровка"
                    updateHandler={updateHandler}
                    // section_data={props.calib_data === null ? 'null' : props.calib_data}
                    // adc_data={props.adc_data} 
                    />
                } />
              }
            </Route>
          }
        </Routes>
        </>
      } />
    </Routes>
    </>
  )
}


//----------------------------------------------------------------
//-------------------ПОЛНЫЙ СПИСОК ПАРАМЕТРОВ---------------------
//----------------------------------------------------------------

// const settings_map = [
//   {
//     section_id: 'settings',
//     section_name: 'общие настройки',
//     section_blocks: [
//       {
//         settings_type: 'time_settings',
//         settings_header: 'задание времени',
//         settings_items: [
//           {id: 'date', name: "Дата", type: "text"},
//           {id: 'time', name: "Время", type: "text"},
//           // {id: 'supply_schedule', name: "Настройки расписания", type: "custom_group"},
//           // {id: 'supply_schedule', name: "Настройки расписания", type: "group", items:[
//           //   {id: 'supply_period', name: "Период работы", type: "text_range"},
//           // ]},
//         ],
//         // additional_items: [
//         //   { id: 'time_server_sync', name: "Синхронизация времени с сервером", type: "custom_group" }
//         // ]
//       },
//       // {
//       //   settings_type: 'silence_det_settings',
//       //   settings_header: 'настройки тишины',
//       //   settings_items: [
//       //     {id: 'silence_det_settings', name: "Включить детектор тишины", type: "custom_group"}
//       //   ]
//       //   // [
//       //   //   {id: 'border_on', name: "Порог на вкл.", type: "text"},
//       //   //   {id: 'react_time_on', name: 'Время реакции', type: 'text_range'},
//       //   //   {id: 'border_off', name: "Порог на выкл.", type: "text"},
//       //   //   {id: 'react_time_off', name: 'Время реакции', type: 'text_range'}
//       //   // ],
//       // },
//       // {
//       //   settings_type: 'misc_settings',
//       //   settings_header: 'прочие настройки',
//       //   settings_items: [
//       //     {id: 'request_period', name: "Период запросов, мс", type: "text"},
//       //     {id: 'bootloader_enabled_switch', name: "Включить Bootloader", type: "switch"},
//       // ],
//       // },
//     ],
//   },
//   {
//     section_id: 'network',
//     section_name: 'сетевые настройки',
//     section_blocks: [
//       {
//         settings_type: 'device_adress',
//         settings_header: 'адрес устройства',
//         settings_items: [
//           {id: 'mac_deafult', name: "Дефолтный MAC-адрес", type: "text"},
//           {id: 'mac', name: "MAC-адрес", type: "text"},
//           {id: 'ip', name: "IP-адрес", type: "text"},
//           {id: 'subnet_mask', name: "Маска подсети", type: "text"},
//           {id: 'gateway', name: "Шлюз", type: "text"},
//         ],
//       },
//       {
//         settings_type: 'remote_control',
//         settings_header: 'управление устройством',
//         settings_items: [
//           {id: 'remote_ip_addr_1', name: "IP-адрес 1", type: "text"},
//           {id: 'remote_ip_addr_2', name: "IP-адрес 2", type: "text"},
//           {id: 'remote_ip_addr_3', name: "IP-адрес 3", type: "text"},
//           {id: 'remote_ip_addr_4', name: "IP-адрес 4", type: "text"},
//         ],
//       },
//       {
//         settings_type: 'snmp_agent',
//         settings_header: 'SNMP-агент',
//         settings_items: [
//           {id: 'community_read', name: "Community Read", type: "text"},
//           {id: 'community_write', name: "Community Write", type: "text"},
//           {id: 'mib_file_download', name: "Загрузить MIB-файл", type: "custom_group"},
//           // {id: 'trap_settings', name: "Настройки TRAP-сервера", type: "group", items:[
//           //   {id: 'trap_ip', name: "IP-адрес", type: "text"},
//           //   {id: 'trap_port', name: "Порт", type: "text"},
//           //   {id: 'trap_community', name: "Сommunity", type: "text"},
//           // ]}
//         ],
//       },
//     ],
//   },
//   // {
//   //   section_id: 'rds_settings',
//   //   section_name: 'rds-настройки',
//   //   section_blocks: [
//   //     {
//   //       settings_type: 'rds_general_settings',
//   //       settings_header: 'общие настройки',
//   //       settings_items: [
//   //         {id: 'tp_checkbox', name: 'TP', type: 'checkbox'},
//   //         {id: 'ta_checkbox', name: 'TA', type: 'checkbox'},
//   //         {id: 'pi', name: "PI", type: "text"},
//   //         {id: 'ps_name', name: "PS Name", type: "text_large_split"},
//   //         {id: 'radio_text', name: "Radio text", type: "text_large"},
//   //       ],
//   //     },
//   //   ],
//   // },
//   {
//     section_id: 'info',
//     section_name: 'Данные об устройстве',
//     section_blocks: [
//       {
//         settings_type: 'info_general',
//         settings_header: 'общее',
//         settings_items: [
//           {id: 'serial_number', name: "Серийный номер", type: "text_sample"},
//           {id: 'plate_number', name: "Номер платы", type: "text_sample"},
//           {id: 'plate_version', name: "Ревизия платы", type: "text_sample"},
//           // {id: 'time_from_on', name: "Время с моента включения", type: "text_sample"},
//           // {id: 'time_failure_on', name: "Наработка наотказ с вкл. усил., ч", type: "text_sample"},
//           // {id: 'time_failure_off', name: "Наработка наотказ с выкл. усил., ч", type: "text_sample"},
//           {id: 'memory_type', name: "Тип памяти", type: "text_sample"},
//         ],
//       },
//       {
//         settings_type: 'software_version',
//         settings_header: 'версия по',
//         settings_items: [
//           {id: 'os_version', name: "Версия прошивки", type: "text_sample"},
//           // {id: 'bootloader_version', name: "Версия загрузчика", type: "text_sample"},
//           // {id: 'audio_version', name: "Версия Audio", type: "text_sample"},
//         ],
//       },
//     ],
//   },

// ];
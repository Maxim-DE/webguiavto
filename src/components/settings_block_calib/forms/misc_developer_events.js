import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input'
import useGlobalStore from '../../../logic/auth_store'
import { useSelector } from 'react-redux'

function MiscSendEvents(props) {
  const download_links = {
    full_conf: 'ReadFile.hex?confing_dev$1;confing_user$1',
    sys_log: 'ReadFile.hex?syslog$1',
    all_file: 'ReadFile.hex'
  }

  const style_obj = {
    maxWidth: '60px'
  }

  const [readSectorState, setReadSectorState] = React.useState({
    init_sector: 0,
    sector_num: 0,
    get build_link_read() {
      return readSector_link_build('read')
    },
    get build_link_download() {
      return readSector_link_build('download')
    },
  })

  const auth_store = useSelector((store) => store.authStore.auth_data)

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setReadSectorState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const file_download_download = (url) => {
    // const url = "mib/okb_alpha.mib"
    window.location.assign(url);
  }


// 192.168.0.116/DebugEventSheduler.cgi?number$1;commnad$1

const handleSendEvent = (transmitterId, command) => (event) => {
  const request_obj = {
    
    address: `DebugEventSheduler.cgi?number$${transmitterId};commnad$${command}`,  // Исправлено: обратные кавычки и ${}
    notifications: {
      good: 'default',
      bad: 'default'
    },
  }

  props.clickHandler(request_obj);
}


  const readSector_link_build = (mode) => {
    let link = `/ReadSector.bin?sector$${readSectorState.init_sector};num$${readSectorState.sector_num}`

    switch (mode) {
      case 'read':
        break;

      case 'download':
        link = link + `;download$1`
        break
    
      default:
        break;
    }

    return link
  }


  return (
    <Settings_block_calib
      header={`Генерация событий`}
      settings_type={`misc_download_calib`} >

      {auth_store.auth_access.calib_extend &&
      <>
      {/*Ряд кнопок на генерацию событие включение от SCHEDULER*/}

      <div className='item_input'>От расписания (вкл/выкл)</div>

      <li
        className="settings_item">
        <div className='item_input'>
          <FormInput
            id={`generate_event_on_transmiter_1`}
            name={`generate_event_on_transmiter_1`}
            label='ПРД-1 Вкл'
            clickHandler={handleSendEvent(1,1)}
            type="button" />
        </div>
        <div className='item_input'>
          <FormInput
            id={`generate_event_on_transmiter_2`}
            name={`generate_event_on_transmiter_2`}
            label='ПРД-2 Вкл'
            clickHandler={handleSendEvent(2,1)}
            type="button" />
        </div>       
        <div className='item_input'>
          <FormInput
            id={`generate_event_on_transmiter_3`}
            name={`generate_event_on_transmiter_3`}
            label='ПРД-3 Вкл'
            clickHandler={handleSendEvent(3,1)}
            type="button" />
        </div>         
      </li>
      {/*Ряд кнопок на генерацию событие выключение */}
      <li
        className="settings_item">
        <div className='item_input'>
          <FormInput
            id={`generate_event_off_transmiter_1`}
            name={`generate_event_off_transmiter_1`}
            label='ПРД-1 Выкл'
            clickHandler={handleSendEvent(1,0)}
            type="button" />
        </div>
        <div className='item_input'>
          <FormInput
            id={`generate_event_off_transmiter_2`}
            name={`generate_event_off_transmiter_2`}
            label='ПРД-2 Выкл'
            clickHandler={handleSendEvent(2,0)}
            type="button" />
        </div>       
        <div className='item_input'>
          <FormInput
            id={`generate_event_off_transmiter_3`}
            name={`generate_event_off_transmiter_3`}
            label='ПРД-3 Выкл'
            clickHandler={handleSendEvent(3,0)}
            type="button" />
        </div>         
      </li>

      {/*  продолжение */}

      </>
      }
    </Settings_block_calib>
  )
}

export default MiscSendEvents

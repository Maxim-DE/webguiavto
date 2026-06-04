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
    // Обработчик сохранения для переключателя светодиодов
  const handleClick_saveLedSwitch = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = LedSwitchState[name]

    // Преобразуем для отправки на сервер: true (выкл) -> 0, false (вкл) -> 1
    const dataValue = value ? 0 : 1;

    const request_obj = {
      address: 'DebugEventLed.cgi',  // замените на нужный адрес
      data: `${name}$${dataValue}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
      save_data: {
        calib_led: LedSwitchState
      }
    }

    props.clickHandler(request_obj);
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
        <div className='item_input'>Проверка светодиодов</div>
        {/* Переключатель для включения/выключения проверки светодиодов */}
        <li
          key='Led_enable'
          id='Led_enable'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`Led_enable_input`}
              className="settings_itemLabel">
              Включить проверку светодиодов  
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`Led_enable_input`}
              name={`Led_enable`}
              changeHandler={(e) => {
                handleChangeLed(e)
                handleClick_saveLedSwitch(e)
              }}
              type="switch" 
              input_value={LedSwitchState.Led_enable}/>
          </div>
        </li>
        
        <li
          className="settings_item">
          <div className='item_input'>
            <FormInput
              id={`Led_blue`}
              name={`Led_blue`}
              label='Синий'
              clickHandler={handleSendEvent_Led(1)}
              type="button" />
          </div>
          <div className='item_input'>
            <FormInput
              id={`Led_red`}
              name={`Led_red`}
              label='Красный'
              clickHandler={handleSendEvent_Led(2)}
              type="button" />
          </div>
          <div className='item_input'>
            <FormInput
              id={`Led_off`}
              name={`Led_off`}
              label='Выкл'
              clickHandler={handleSendEvent_Led(3)}
              type="button" />
          </div>
           
        </li>        
      </>
      }
    </Settings_block_calib>
  )
}

export default MiscSendEvents

import React from 'react'
import Settings_block_calib from '..'
import FormInput from '../../form_input'
import useGlobalStore from '../../../logic/auth_store'

function MiscDownloadCalib(props) {
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

  const [authGlobalState, authGlobalActions] = useGlobalStore()

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

  const readSector_link_build = (mode) => {
    let link = `http://192.168.1.4/ReadSector.bin?sector$${readSectorState.init_sector};num$${readSectorState.sector_num}`

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
      header={`загрузка файлов`}
      settings_type={`misc_download_calib`} >
      {/* <li
        key='full_conf_download'
        id='full_conf_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`device_conf_download_input`}
            className="settings_itemLabel">
            Полная конфигурация  
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.full_conf}>
            Скачать
          </a> 
        </div>
      </li>
      <li
        key='sys_log_download'
        id='sys_log_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`sys_log_download_input`}
            className="settings_itemLabel">
            Системный журнал
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.sys_log}>
            Скачать
          </a> 
        </div>
      </li>
      <li
        key='all_file_download'
        id='all_file_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`all_file_download_input`}
            className="settings_itemLabel">
            Все файлы в одном
          </label>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={download_links.all_file}
            target="_blank"
            rel='noopener noreferrer'
            download>
            Скачать
          </a> 
        </div>
      </li> */}
      {authGlobalState.auth_access.calib_extend &&
      <>
      <li
        key='sector_download'
        id='sector_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`sector_download_input`}
            className="settings_itemLabel">
            Чтение сектора
          </label>
        </div>
        <div className='item_input'>
        </div>
      </li>
      <li
        key='init_sector'
        id='init_sector'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`init_sector_input`}
            className="settings_itemLabel">
            Начальный сектор
          </label>
        </div>
        <div className='item_input'>
          <input
            name='init_sector'
            type="text"
            data-threshold="low"
            style={style_obj}
            value={readSectorState.init_sector}
            onChange={handleChange}
          />
        </div>
      </li>
      <li
        key='sector_num'
        id='sector_num'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`sector_num_input`}
            className="settings_itemLabel">
            Количество секторов 
          </label>
        </div>
        <div className='item_input'>
          <input
            name='sector_num'
            type="text"
            data-threshold="high"
            style={style_obj}
            value={readSectorState.sector_num}
            onChange={handleChange}
          />
        </div>
      </li>
      <li
        key='sector_download_actions'
        id='sector_download_actions'
        className="settings_item">
        <div className='item_header'>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={readSector_link_build('read')}
            target="_blank"
            rel='noopener noreferrer'
            download>
            Прочитать
          </a>
          <a
            className='button_input download_link'
            href={readSector_link_build('download')}
            target="_blank"
            rel='noopener noreferrer'
            download>
            Скачать
          </a> 
        </div>
      </li>

      </>
      }
    </Settings_block_calib>
  )
}

export default MiscDownloadCalib

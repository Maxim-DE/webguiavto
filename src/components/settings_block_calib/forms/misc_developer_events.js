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
      {/* <li
        key='sector_num'
        id='sector_num'
        className="settings_item nested_item">
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
      </li> */}
      <li
        key='sector_download_actions'
        id='sector_download_actions'
        className="settings_item">
        <div className='item_header'>
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={readSector_link_build('download')}
            target="_blank"
            rel='noopener noreferrer'
            download>
            ПРД-1 Вкл 
          </a> 
        </div>
        <div className='item_input'>
          <a
            className='button_input download_link'
            href={readSector_link_build('download')}
            target="_blank"
            rel='noopener noreferrer'
            download>
            ПРД-2 Вкл 
          </a> 
        </div>       
        <div className='item_input'>
          {/* <FormInput
            // id={`reboot_avr_calib_input`}
            // name={`reboot_avr_calib`}
            // clickHandler={handleReboot}
            label='Перезагрузить АВР'
            type="button" /> */}

          <a
            className='button_input download_link'
            href={readSector_link_build('download')}
            target="_blank"
            rel='noopener noreferrer'
            download>
            ПРД-3 Вкл 
          </a>
        </div>         
      </li>

      {/* <li
        key='output_test_pic_enable_calib'
        id='output_test_pic_enable_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`output_test_pic_enable_calib_input`}
            className="settings_itemLabel">
            Блок АФУ_0 на картинке
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`output_test_pic_enable_calib_input`}
            name={`output_test_pic_enable_calib`}
            changeHandler={handleChange_save}
            input_value={generalCalibState.output_test_pic_enable}
            type="switch" />
        </div>
      </li>       */}

      </>
      }
    </Settings_block_calib>
  )
}

export default MiscSendEvents

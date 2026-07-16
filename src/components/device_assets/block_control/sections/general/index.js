import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'
import { useSelector } from 'react-redux';

import Time_settings from './forms/time_settings'
import File_download from './forms/file_download'

import PowerCalibThreshold_AVR from '../../../../settings_block_calib/forms/wattage_threshold_calib_avr';

import { reducers } from '../../../../../store/reducers/core_store_reducers'

export default function GeneralSettingsSection(props) {
  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }


  const section_store = useSelector((store) => store.globalStore.global_data.section_data.settings.calib_power_threshold)
  // console.log('section_store',useSelector((store) => store.globalStore.global_data.section_data.settings.calib_power_threshold))

  const handleClick = block_data => {
    block_data.data = (block_data.data ? block_data.data : '')
    props.updateHandler(block_data);
  }
    
  React.useEffect(() => {
    let request_obj = {
      address: `settings.cgi`,
      reducer: reducers.section_data,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (settings)`
        }

      },
    }
    props.updateHandler(request_obj);

  }, [])

  return (
    <SettingsSectionWrap 
      section_name="settings"
      section_header="общие настройки">
      <Time_settings 
        section_name="settings"
        clickHandler={updateHandler} />
      <File_download
        section_name="settings" />
            <PowerCalibThreshold_AVR
              calib_state={section_store}
              clickHandler={handleClick}
            />
    </SettingsSectionWrap>
  )
}

import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap/index.js'
import { useSelector } from 'react-redux';

import PowerCalibThreshold_AVR from '../../../../settings_block_calib/forms/wattage_threshold_calib_avr.js';
import SignalThresholdCalib_AVR from '../../../../settings_block_calib/forms/signal_threshold_calib.js';
import SlaveGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_general_calib_avr.js';

import { reducers } from '../../../../../store/reducers/core_store_reducers.js'

export default function SettingsAVR(props) {
  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }
  const auth_level = useSelector((store) => store.authStore.auth_data.auth_level)

  const section_store = useSelector((store) => store.globalStore.global_data.section_data.settings)
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
      section_name="avr"
      section_header="управление сар">
      <SlaveGeneralCalib_AVR
        calib_state={section_store.slave_general}
        clickHandler={handleClick}
      />      
      {auth_level >= 2 &&
        <PowerCalibThreshold_AVR
          calib_state={section_store.calib_power_threshold}
          clickHandler={handleClick}
        />
      }
      {auth_level >= 2 &&
        <SignalThresholdCalib_AVR
          calib_state={section_store.calib_signal_threshold}
          clickHandler={handleClick}
        />
      }
    </SettingsSectionWrap>
  )
}
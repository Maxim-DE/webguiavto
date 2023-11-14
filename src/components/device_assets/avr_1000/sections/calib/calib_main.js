import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import PowerCalibSettings_AVR from '../../../../settings_block_calib/forms/wattage_primary_calib_avr';
import GeneralCalibSettings_AVR from '../../../../settings_block_calib/forms/general_calib_avr';
import SignalCalibSettings from '../../../../settings_block_calib/forms/signal_level_calib';
import SignalThresholdSettings from '../../../../settings_block_calib/forms/signal_threshold_calib';


export const CalibMain = (props) => {

  React.useEffect(() => {
    let request_obj = {
      address: `calibration.cgi`,
      reducer: reducers.calibration_data,
    }
    props.updateHandler(request_obj);
  }, [])

  const handleClick = block_data => {
    props.updateHandler(block_data);
  }

  return (
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="калибровка">
      <GeneralCalibSettings_AVR
        clickHandler={handleClick} />
      <PowerCalibSettings_AVR
        clickHandler={handleClick} />
      <SignalCalibSettings
        clickHandler={handleClick} />
      <SignalThresholdSettings
       clickHandler={handleClick} />
    </SettingsSectionWrap>
  )
}

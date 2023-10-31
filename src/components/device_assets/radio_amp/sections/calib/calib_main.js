import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import GeneralCalibSettings_ST from '../../../../settings_block_calib/forms/general_calib_st';
import VoltageCalibSettings from '../../../../settings_block_calib/forms/voltage_calib';
import PowerCalibSettings from '../../../../settings_block_calib/forms/wattage_primary_calib';
import WattageAdditionalCalibSettings_ST from '../../../../settings_block_calib/forms/wattage_additional_calib_st';
import FanCalibSettings from '../../../../settings_block_calib/forms/fan_calib';
import TempThresholdCalibSettings from '../../../../settings_block_calib/forms/temp_thrashold';

import useGlobalStore from '../../../../../logic/auth_store';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import BallastCalibSettings from '../../../../settings_block_calib/forms/ballast_calib';
import VoltageCalibSettings_URE from '../../../../settings_block_calib/forms/voltage_calib_ure';
import CurrentCalibSettings_AMP from '../../../../settings_block_calib/forms/current_calib_amp';
import CurrentThresholdCalibSettings_AMP from '../../../../settings_block_calib/forms/current_threshold_calib_amp';
import PowerCalibSettings_AMP from '../../../../settings_block_calib/forms/wattage_primary_calib_amp';


export const CalibMain = (props) => {
  const [authGlobalState, authGlobalActions] = useGlobalStore()

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
      <GeneralCalibSettings_ST
        clickHandler={handleClick} />
      <VoltageCalibSettings_URE
        clickHandler={handleClick} />
      <CurrentCalibSettings_AMP
        clickHandler={handleClick} />
      {/* <BallastCalibSettings
        clickHandler={handleClick} /> */}
      <CurrentThresholdCalibSettings_AMP
        clickHandler={handleClick} />
      <PowerCalibSettings_AMP
        clickHandler={handleClick} />
      <WattageAdditionalCalibSettings_ST
        clickHandler={handleClick} />
      <TempThresholdCalibSettings
        clickHandler={handleClick} />
      <FanCalibSettings
        clickHandler={handleClick} />
    </SettingsSectionWrap>
  )
}

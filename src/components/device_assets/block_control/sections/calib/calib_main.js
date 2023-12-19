import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import TempThresholdCalibSettings from '../../../../settings_block_calib/forms/temp_thrashold';

import useGlobalStore from '../../../../../logic/auth_store';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import PowerCalibSettings_AMP from '../../../../settings_block_calib/forms/wattage_primary_calib_amp';
import GeneralCalibSettings_BC from '../../../../settings_block_calib/forms/general_calib_bc';
import WattageAdditionalCalibSettings_BC from '../../../../settings_block_calib/forms/wattage_additional_calib_bc';
import FanCalibSettings_BC from '../../../../settings_block_calib/forms/fan_calib_bc';
import FanCalibSettings_hybrid from '../../../../settings_block_calib/forms/fan_calib_hybrid';
import PWRSensorCalibSettings_BC from '../../../../settings_block_calib/forms/pwr_sensor_calib_bc';
import { useSelector } from 'react-redux';


export const CalibMain = (props) => {
  const auth_store = useSelector((store) => store.authStore.auth_data)

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
      <GeneralCalibSettings_BC
        clickHandler={handleClick} />
      {/* <BallastCalibSettings
        clickHandler={handleClick} /> */}
      <PowerCalibSettings_AMP
        clickHandler={handleClick} />
      <WattageAdditionalCalibSettings_BC
        clickHandler={handleClick} />
      {auth_store.auth_access.calib_extend &&
        <PWRSensorCalibSettings_BC
          clickHandler={handleClick} />
      }
      <TempThresholdCalibSettings
        clickHandler={handleClick} />
      <FanCalibSettings_hybrid
        clickHandler={handleClick} />
    </SettingsSectionWrap>
  )
}

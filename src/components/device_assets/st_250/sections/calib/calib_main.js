import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import GeneralCalibSettings_ST from '../../../../settings_block_calib/forms/general_calib_st';
import CurrentCalibSettings_ST from '../../../../settings_block_calib/forms/current_calib_st';
import CurrentThresholdCalibSettings_ST from '../../../../settings_block_calib/forms/current_threshold_calib_st';
import VoltageCalibSettings from '../../../../settings_block_calib/forms/voltage_calib';
import PowerCalibSettings from '../../../../settings_block_calib/forms/wattage_primary_calib';
import WattageAdditionalCalibSettings_ST from '../../../../settings_block_calib/forms/wattage_additional_calib_st';
import FanCalibSettings from '../../../../settings_block_calib/forms/fan_calib';
import TempThresholdCalibSettings from '../../../../settings_block_calib/forms/temp_thrashold';

import useGlobalStore from '../../../../../logic/auth_store';


export const CalibMain = (props) => {
  const [authGlobalState, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    let request_obj = {
      address: `${props.section_name}.cgi`,
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
        adc_data={props.adc_data != null ?
          props.adc_data.general_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_general : ''}
        clickHandler={handleClick} />
      <VoltageCalibSettings
        adc_data={props.adc_data != null ?
          props.adc_data.voltage_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_voltage : ''}
        clickHandler={handleClick} />
      <CurrentCalibSettings_ST
        adc_data={props.adc_data != null ?
          props.adc_data.current_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_current.current_value
          : ''}
        clickHandler={handleClick} />
      <CurrentThresholdCalibSettings_ST
        adc_data={props.adc_data != null ?
          props.adc_data.current_threshhold_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_current.threshold : ''}
        clickHandler={handleClick} />
      <PowerCalibSettings
        adc_data={props.adc_data != null ?
          props.adc_data.power_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_power : ''}
        clickHandler={handleClick} />
      <WattageAdditionalCalibSettings_ST
        adc_data={props.adc_data != null ?
          props.adc_data.power_additional_calib : ''}
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_additional_power : ''}
        clickHandler={handleClick} />
      <TempThresholdCalibSettings
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_temp : ''}
        clickHandler={handleClick} />
      <FanCalibSettings
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_fan : ''}
        clickHandler={handleClick} />
    </SettingsSectionWrap>
  )
}

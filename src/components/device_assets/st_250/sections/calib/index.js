import React from 'react';

import useGlobalStore from '../../../../../logic/auth_store';

import SettingsSectionWrap from '../../../../settings_section_wrap';

import GeneralCalibSettings_ST from '../../../../settings_block_calib/forms/general_calib_st';
import CurrentCalibSettings_ST from '../../../../settings_block_calib/forms/current_calib_st';
import CurrentThresholdCalibSettings_ST from '../../../../settings_block_calib/forms/current_threshold_calib_st';
import VoltageCalibSettings from '../../../../settings_block_calib/forms/voltage_calib';
import PowerCalibSettings from '../../../../settings_block_calib/forms/wattage_primary_calib';
import WattageAdditionalCalibSettings_ST from '../../../../settings_block_calib/forms/wattage_additional_calib_st';
// import WattageThresholdCalibSettings from '../../../../settings_block_calib/forms/wattage_thrashold';
// import BallastCalibSettings from '../../../../settings_block_calib/forms/ballast_calib';
// import LRChannelCalibSettings from '../../../../settings_block_calib/forms/lr_channel_calib';
import FanCalibSettings from '../../../../settings_block_calib/forms/fan_calib';
import TempThresholdCalibSettings from '../../../../settings_block_calib/forms/temp_thrashold';
// import EmulationCalibSettings from '../../../../settings_block_calib/forms/emulation_calib';
import Firmware_calib from '../../../../settings_block_calib/forms/firmware_calib';
import MiscCalibSettings from '../../../../settings_block_calib/forms/misc_calib';
import MiscCalibSettings_ST250 from '../../../../settings_block_calib/forms/misc_calib_st250';
import MiscDownloadCalib from '../../../../settings_block_calib/forms/misc_download_calib';
import ConfFileCalib from '../../../../settings_block_calib/forms/conf_file_calib';
import NetworkCalibSettings from '../../../../settings_block_calib/forms/network_calib';
import ConsoleOutputCalibSettings from '../../../../settings_block_calib/forms/console_output_calib';
import SerialNumVersionCalibSettings from '../../../../settings_block_calib/forms/serialnum_version_calib';
import LoadingSpan from '../../../../loading_span';
import CurrentCalibSettings from '../../../../settings_block_calib/forms/current_calib';
import ChannelEnablerSettings from '../../../../settings_block_calib/forms/channel_enabler_calib';
import { reducers } from '../../../../../store/reducers/core_store_reducers';



export default function CalibSection(props) {
  const [sectionState, setSectionState] = React.useState({
    isLoading: false
  });

  const [authGlobalState, authGlobalActions] = useGlobalStore()

  React.useEffect(() => {
    if (props.section_data) {
      setSectionState({
        isLoading: false
      })
    }
  }, [props.section_data]);

  React.useEffect(() => {
    let request_obj = {
      address: `${props.section_name}.cgi`,
      reducer: reducers.calibration_data
    }
    props.updateHandler(request_obj);

    // setSectionState({
    //   isLoading: true
    // })
  }, [])

  const handleClick = block_data => {
    
    props.updateHandler(block_data);
    // setSectionState({
    //   isLoading: true
    // })
  }

  return (
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="калибровка">
        <GeneralCalibSettings_ST
          adc_data={props.adc_data != null ?
            props.adc_data.general_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_general : ''}
          clickHandler={handleClick} />
        <VoltageCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.voltage_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_voltage : ''}
          clickHandler={handleClick} />
        <CurrentCalibSettings_ST
          adc_data={props.adc_data != null ?
            props.adc_data.current_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_current.current_value
            // : ''}
          clickHandler={handleClick} />
        <CurrentThresholdCalibSettings_ST
          adc_data={props.adc_data != null ?
            props.adc_data.current_threshhold_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_current.threshold : ''}
          clickHandler={handleClick} />
        <PowerCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.power_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_power : ''}
          clickHandler={handleClick} />
        <WattageAdditionalCalibSettings_ST
          adc_data={props.adc_data != null ?
            props.adc_data.power_additional_calib : ''}
            // calib_data={Object.keys(props.section_data).length != 0 ?
            // props.section_data.calib_additional_power : ''}
          clickHandler={handleClick} />
        <TempThresholdCalibSettings
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_temp : ''}
          clickHandler={handleClick} />
        <FanCalibSettings
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_fan : ''}
          clickHandler={handleClick} />
        <MiscCalibSettings_ST250
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_misc : ''}
          clickHandler={handleClick} />
        <Firmware_calib
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_firmware : ''}
          clickHandler={handleClick} />
        <ConfFileCalib
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_configFile : ''}
          clickHandler={handleClick} />
        {/* <ChannelEnablerSettings 
        // calib_data={Object.keys(props.section_data).length != 0 ?
        //     props.section_data.calib_channels.channel_list : ''}
          clickHandler={handleClick}
           /> */}
        {/* <MiscDownloadCalib /> */}
        {authGlobalState.auth_access.calib_extend &&
          <>
            <SerialNumVersionCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //     props.section_data.calib_serialNum : ''}
              clickHandler={handleClick} />
            <NetworkCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //     props.section_data.calib_network : ''}
              clickHandler={handleClick} />
            <ConsoleOutputCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //     props.section_data.calib_console_output : ''}
              clickHandler={handleClick} />
            <MiscDownloadCalib />
          </>
        }
    </SettingsSectionWrap>
  )
}

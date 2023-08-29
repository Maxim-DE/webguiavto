import React from 'react';

import Settings_block_calib from '../../../../settings_block_calib';

import useGlobalStore from '../../../../../logic/auth_store';

import GeneralCalibSettings from '../../../../settings_block_calib/forms/general_calib';
import CurrentCalibSettings from '../../../../settings_block_calib/forms/current_calib';
import CurrentThresholdCalibSettings from '../../../../settings_block_calib/forms/current_threshold_calib';
import VoltageCalibSettings from '../../../../settings_block_calib/forms/voltage_calib';
import PowerCalibSettings from '../../../../settings_block_calib/forms/wattage_primary_calib';
import WattageAdditionalCalibSettings from '../../../../settings_block_calib/forms/wattage_additional_calib';
import WattageThresholdCalibSettings from '../../../../settings_block_calib/forms/wattage_thrashold';
import BallastCalibSettings from '../../../../settings_block_calib/forms/ballast_calib';
import LRChannelCalibSettings from '../../../../settings_block_calib/forms/lr_channel_calib';
import FanCalibSettings from '../../../../settings_block_calib/forms/fan_calib';
import TempThresholdCalibSettings from '../../../../settings_block_calib/forms/temp_thrashold';
import EmulationCalibSettings from '../../../../settings_block_calib/forms/emulation_calib';
import MiscCalibSettings from '../../../../settings_block_calib/forms/misc_calib';
import NetworkCalibSettings from '../../../../settings_block_calib/forms/network_calib';
import ConsoleOutputCalibSettings from '../../../../settings_block_calib/forms/console_output_calib';
import SerialNumVersionCalibSettings from '../../../../settings_block_calib/forms/serialnum_version_calib';

import LoadingSpan from '../../../../loading_span';
import FormInput from '../../../../form_input';
import { reducers } from '../../../../../store/reducers/core_store_reducers';

function CalibSection(props) {
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
    <section id={`${props.section_name}_section`}>
      <div className="section_header">
        <h2>
          {props.section_header}
          <LoadingSpan loading={sectionState.isLoading} />
        </h2>
      </div>
      <div className="section_content">
        <GeneralCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.general_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_general : ''}
          clickHandler={handleClick} />
        <VoltageCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.voltage_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_voltage : ''}
          clickHandler={handleClick} />
        <CurrentCalibSettings
          adc_data={props.adc_data != null ? 
                    props.adc_data.current_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ? 
          //             props.section_data.calib_current.current_value
                      //  : ''}
          clickHandler={handleClick}/>
        <WattageThresholdCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.power_threshold_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_wattage_threshold : ''}
          clickHandler={handleClick} />
        <CurrentThresholdCalibSettings
          adc_data={props.adc_data != null ?
                    props.adc_data.current_threshhold_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //             props.section_data.calib_current.threshold : ''} 
          clickHandler={handleClick} />
        <PowerCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.power_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_power : ''}
          clickHandler={handleClick} />
        <WattageAdditionalCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.power_additional_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_additional_power : ''}
          clickHandler={handleClick} />
        <BallastCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.ballast_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_ballast : ''}
          clickHandler={handleClick} />
        <TempThresholdCalibSettings 
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_temp : ''}
          clickHandler={handleClick}/>
        <FanCalibSettings
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_fan : ''}
          clickHandler={handleClick} />
        <LRChannelCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.lr_channel_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_lr_channel : ''}
          clickHandler={handleClick} />
        <EmulationCalibSettings
          adc_data={props.adc_data != null ?
            props.adc_data.emulation_calib : ''}
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_emulation : ''}
          clickHandler={handleClick} />
        <MiscCalibSettings
          // calib_data={Object.keys(props.section_data).length != 0 ?
          //   props.section_data.calib_misc : ''}
          clickHandler={handleClick} />

        {authGlobalState.auth_access.calib_extend && 
          <>
          <SerialNumVersionCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //   props.section_data.calib_serialNum : ''}
            clickHandler={handleClick} />
          <NetworkCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //   props.section_data.calib_network : ''}
            clickHandler={handleClick} />
          <ConsoleOutputCalibSettings
            // calib_data={Object.keys(props.section_data).length != 0 ?
            //   props.section_data.calib_console_output : ''}
            clickHandler={handleClick} />
          </>
        }
      </div>
    </section>
  )
}

export default CalibSection
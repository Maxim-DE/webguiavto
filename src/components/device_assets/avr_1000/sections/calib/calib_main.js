import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import PowerCalibSettings_AVR from '../../../../settings_block_calib/forms/wattage_primary_calib_avr';
import GeneralCalibSettings_AVR from '../../../../settings_block_calib/forms/general_calib_avr';
import SignalCalibSettings from '../../../../settings_block_calib/forms/signal_level_calib';
import SignalThresholdSettings from '../../../../settings_block_calib/forms/signal_threshold_calib';
import { useSelector } from 'react-redux';
import CalibDeviceSwitch from '../../../../calib_device_switch';
import SlaveGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_general_calib_avr';
import SlaveAddGeneralCalib_AVR from '../../../../settings_block_calib/forms/slave_add_general_calib_avr';


export const CalibMain = (props) => {
  const [deviceState, setDeviceState] = React.useState(0)

  const calib_store = useSelector((store) => store.globalStore.global_data.calib_state.data)

  // const device_switch = 
  //   <CalibDeviceSwitch
  //     device_num={deviceState}
  //     deviceNum_handler={setDeviceState} />

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
    <>
      
    <SettingsSectionWrap 
      section_name={`${props.section_name}`}
      section_header="Общее"
      // section_subheader={device_switch}
      >
      {/* <SlaveGeneralCalib_AVR
        calib_state={device_store?.calib_general}
        clickHandler={handleClick} />
      <SlaveAddGeneralCalib_AVR
        calib_state={device_store?.calib_general}
        clickHandler={handleClick} /> */}
      <GeneralCalibSettings_AVR
        calib_state={calib_store?.calib_general}
        clickHandler={handleClick} />
      {/* <PowerCalibSettings_AVR
        calib_state={device_store?.calib_power}
        clickHandler={handleClick} />
      <SignalCalibSettings
        calib_state={device_store?.calib_signal}
        clickHandler={handleClick} />
      <SignalThresholdSettings
        calib_state={device_store?.calib_signal_threshold}
        clickHandler={handleClick} /> */}
    </SettingsSectionWrap>
    </>
  )
}

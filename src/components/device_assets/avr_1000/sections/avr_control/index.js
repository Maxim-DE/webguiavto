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
import Rds_general_settings from '../rds/forms/rds_general_settings';
import Slave_Rds_general_ from '../../../../settings_block_calib/forms/slave_rds_general_avr';


export const AvrControl = (props) => {
  const [deviceState, setDeviceState] = React.useState(0)

  const calib_store = useSelector((store) => store.globalStore.global_data.calib_state.data),
        device_store = calib_store?.[`calib_device_${deviceState}`]

  const device_switch = 
    <CalibDeviceSwitch
      device_num={deviceState}
      deviceNum_handler={setDeviceState} />

  const rds_enable = device_store?.slave_general?.rds_enable

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
      section_header="управление устройствами"
      section_subheader={device_switch}>
      <SlaveGeneralCalib_AVR
        calib_state={device_store?.slave_general}
        clickHandler={handleClick} />
      <SlaveAddGeneralCalib_AVR
        calib_state={device_store?.slave_add_general}
        clickHandler={handleClick} />
      {rds_enable == 1 &&
        <Slave_Rds_general_
          section_name="rds_settings"
          clickHandler={handleClick} />
      }
      <GeneralCalibSettings_AVR
        calib_state={device_store?.calib_general}
        clickHandler={handleClick} />
      <PowerCalibSettings_AVR
        calib_state={device_store?.calib_power}
        clickHandler={handleClick} />
      <SignalCalibSettings
        calib_state={device_store?.calib_signal}
        clickHandler={handleClick} />
      <SignalThresholdSettings
        calib_state={device_store?.calib_signal_threshold}
        clickHandler={handleClick} />
    </SettingsSectionWrap>
    </>
  )
}

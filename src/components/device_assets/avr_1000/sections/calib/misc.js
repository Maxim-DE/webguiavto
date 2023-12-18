import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import Firmware_calib from '../../../../settings_block_calib/forms/firmware_calib';
import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import MiscCalibSettings_AMP from '../../../../settings_block_calib/forms/misc_calib_amp';
import Modbus_master_AVR_calib from '../../../../settings_block_calib/forms/masterSlave_master_calib_avr';
import SerialNumVersionCalibSettings_AVR from '../../../../settings_block_calib/forms/serialnum_version_avr_calib';
import ConfFileCalib_AVR from '../../../../settings_block_calib/forms/conf_file_avr_calib';

export const MiscCalib = (props) => {
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
      section_header="прочее">
      <MiscCalibSettings_AMP
        clickHandler={handleClick} />
      <Modbus_master_AVR_calib
        clickHandler={handleClick} />
      {auth_store.auth_access.calib_extend &&
        <>
          <SerialNumVersionCalibSettings_AVR
            clickHandler={handleClick} />
        </>
      }
      <Firmware_calib
        clickHandler={handleClick} />
      <ConfFileCalib_AVR
        clickHandler={handleClick} />
      {/* <ChannelEnablerSettings 
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_channels.channel_list : ''}
        clickHandler={handleClick}
        /> */}
      {/* <MiscDownloadCalib /> */}
    </SettingsSectionWrap>
  )
}

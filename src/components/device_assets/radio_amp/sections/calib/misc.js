import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import Firmware_calib from '../../../../settings_block_calib/forms/firmware_calib';
import MiscCalibSettings_ST250 from '../../../../settings_block_calib/forms/misc_calib_st250';
import ConfFileCalib from '../../../../settings_block_calib/forms/conf_file_calib';
import SerialNumVersionCalibSettings from '../../../../settings_block_calib/forms/serialnum_version_calib';

import useGlobalStore from '../../../../../logic/auth_store';
import { useSelector } from 'react-redux';
import { reducers } from '../../../../../store/reducers/core_store_reducers';
import Modbus_slave_calib from '../../../../settings_block_calib/forms/masterSlave_slave_calib';
import MiscCalibSettings_AMP from '../../../../settings_block_calib/forms/misc_calib_amp';
// import Modbus_hybrid_calib from '../../../../settings_block_calib/forms/masterSlave_hybrid_calib';

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
      section_header="другое">
      <MiscCalibSettings_AMP
        clickHandler={handleClick} />
      {auth_store.auth_access.calib_extend &&
        <>
          <SerialNumVersionCalibSettings
            clickHandler={handleClick} />
        </>
      }
      <Modbus_slave_calib
        clickHandler={handleClick} />
      <Firmware_calib
        clickHandler={handleClick} />
      <ConfFileCalib
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

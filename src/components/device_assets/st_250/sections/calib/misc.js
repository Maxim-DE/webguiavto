import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import Firmware_calib from '../../../../settings_block_calib/forms/firmware_calib';
import MiscCalibSettings_ST250 from '../../../../settings_block_calib/forms/misc_calib_st250';
import ConfFileCalib from '../../../../settings_block_calib/forms/conf_file_calib';
import SerialNumVersionCalibSettings from '../../../../settings_block_calib/forms/serialnum_version_calib';

import useGlobalStore from '../../../../../logic/auth_store';

export const MiscCalib = (props) => {

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
      section_header="другое">
      <MiscCalibSettings_ST250
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_misc : ''}
        clickHandler={handleClick} />
      <Firmware_calib
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_firmware : ''}
        clickHandler={handleClick} />
      <ConfFileCalib
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_configFile : ''}
        clickHandler={handleClick} />
      {/* <ChannelEnablerSettings 
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_channels.channel_list : ''}
        clickHandler={handleClick}
        /> */}
      {/* <MiscDownloadCalib /> */}
      {authGlobalState.auth_access.calib_extend &&
        <>
          <SerialNumVersionCalibSettings
            calib_data={Object.keys(props.section_data).length != 0 ?
              props.section_data.calib_serialNum : ''}
            clickHandler={handleClick} />
        </>
      }
    </SettingsSectionWrap>
  )
}

import React from 'react'

import useGlobalStore from '../../../../../logic/auth_store';

import SettingsSectionWrap from '../../../../settings_section_wrap';

import MiscDownloadCalib from '../../../../settings_block_calib/forms/misc_download_calib';
import NetworkCalibSettings from '../../../../settings_block_calib/forms/network_calib';
import ConsoleOutputCalibSettings from '../../../../settings_block_calib/forms/console_output_calib';

export const DeveloperCalib = (props) => {

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
      section_header="для разработчиков">
      <NetworkCalibSettings
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_network : ''}
        clickHandler={handleClick} />
      <ConsoleOutputCalibSettings
        calib_data={Object.keys(props.section_data).length != 0 ?
          props.section_data.calib_console_output : ''}
        clickHandler={handleClick} />
      <MiscDownloadCalib />
    </SettingsSectionWrap>
  )
}

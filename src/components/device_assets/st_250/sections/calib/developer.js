import React from 'react'

import useGlobalStore from '../../../../../logic/auth_store';

import SettingsSectionWrap from '../../../../settings_section_wrap';

import MiscDownloadCalib from '../../../../settings_block_calib/forms/misc_download_calib';
import NetworkCalibSettings from '../../../../settings_block_calib/forms/network_calib';
import ConsoleOutputCalibSettings from '../../../../settings_block_calib/forms/console_output_calib';
import { reducers } from '../../../../../store/reducers/core_store_reducers';

export const DeveloperCalib = (props) => {

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
      section_header="для разработчиков">
      <NetworkCalibSettings
        clickHandler={handleClick} />
      <ConsoleOutputCalibSettings
        clickHandler={handleClick} />
      <MiscDownloadCalib />
    </SettingsSectionWrap>
  )
}

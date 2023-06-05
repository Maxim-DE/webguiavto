import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

import Recover_settings from './forms/recover_settings';

export default function RecoverSection(props) {

  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }

  return (
    <SettingsSectionWrap 
      section_name="recover"
      section_header="">
      <Recover_settings 
        section_name="settings"
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}
import React from 'react'
import SettingsSectionWrap from '../../../../settings_section_wrap'

import { useSelector } from 'react-redux';
import { deepKeyExists } from '../../../../../logic/utilites';
import Userlog_settings from './forms/userlog';

export const UserlogSection = (props) => {
  // const auth_store = useSelector((store) => store.authStore.auth_data)

  const handleClick = block_data => {
    props.updateHandler(block_data);
  }

  return (
    <SettingsSectionWrap
      section_name={`${props.section_name}`}
      section_header="Пользовательский журнал"
      grid_columns='1'>
      <Userlog_settings
        updateHandler={handleClick} />
    </SettingsSectionWrap>
  )
}

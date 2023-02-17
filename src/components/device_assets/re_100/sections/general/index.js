import React from 'react'

import SettingsSectionWrap from '../../../../settings_section_wrap'

import Time_settings from './forms/time_settings';
import Time_schedule_form from './forms/time_schedule';
import Silence_det_form from './forms/silence_det';
import Misc_settings from './forms/misc_settings';

export default function GeneralSettingsSection(props) {

  const updateHandler = (data_block) => {
    props.updateHandler(data_block);
  }

  React.useEffect(() => {
    let request_obj = {
      address: `settings.cgi`,
      notifications: {
        good: 'none',
        bad: () => {
          return `Ошибка, обновите страницу (settings)`
        }

      },
    }
    props.updateHandler(request_obj);

    // setSectionState({
    //   isLoading: true
    // })

  }, [])

  return (
    <SettingsSectionWrap
      section_name="settings"
      section_header="общие настройки">
      <Time_settings
        section_name="settings"
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.time_settings}
        clickHandler={updateHandler} />
      <Time_schedule_form
        section_name="settings"
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.time_schedule}
        clickHandler={updateHandler} />
      <Silence_det_form
        section_name="settings"
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.silence_det}
        clickHandler={updateHandler} />
      <Misc_settings
        section_name="settings"
        settings_data={props.section_data === 'null' ?
          'null'
          : props.section_data.misc_settings}
        clickHandler={updateHandler} />
    </SettingsSectionWrap>
  )
}
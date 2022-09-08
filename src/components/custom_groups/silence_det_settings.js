import React from 'react';
import ReactDOM from 'react-dom';

import FormInput from '../form_input';
import '../form_input/index.css';
import '../settings_block/index.css'

export const silence_det_settings = {
  'render_srtucture': function (form_handler, block_state, group_id, group_name) {
      return (
        <>
          <li
            key='silence_det_settings'
            id='silence_det_settings'
            className="settings_item">
            <label
              htmlFor={`silence_det_settings_switch_input`}
              className="settings_itemLabel">
              {group_name}
            </label>
            <FormInput
              id='silence_det_settings_switch_input'
              name='silence_det_settings_switch'
              type='switch'
              changeHandler={form_handler}
              input_value={block_state.silence_det_settings_switch}
            />
          </li>
          {block_state.silence_det_settings_switch &&
          <>
          <li
            key='border_off'
            id='border_off'
            className="settings_item">
            <label
              htmlFor={`border_off_input`}
              className="settings_itemLabel">
              Порог выкл., КГц
            </label>
            <FormInput
              id='border_off_input'
              name='border_off'
              type='text'
              changeHandler={form_handler}
              input_value={block_state.border_off}
            />
          </li>
          <li
            key='reaction_off'
            id='reaction_off'
            className="settings_item">
            <label
              htmlFor={`reaction_off_input`}
              className="settings_itemLabel">
              Время реакции, мин:сек
            </label>
            <FormInput
              id='reaction_off_input'
              name='reaction_off'
              type='text'
              changeHandler={form_handler}
              input_value={block_state.reaction_off}
            />
          </li>
          <li
            key='border_on'
            id='border_on'
            className="settings_item">
            <label
              htmlFor={`border_on_input`}
              className="settings_itemLabel">
              Порог выкл., КГц
            </label>
            <FormInput
              id='border_on_input'
              name='border_on'
              type='text'
              changeHandler={form_handler}
              input_value={block_state.border_on}
            />
          </li>
          <li
            key='reaction_on'
            id='reaction_on'
            className="settings_item">
            <label
              htmlFor={`reaction_on_input`}
              className="settings_itemLabel">
              Время реакции, мин:сек
            </label>
            <FormInput
              id='reaction_on_input'
              name='reaction_on'
              type='text'
              changeHandler={form_handler}
              input_value={block_state.reaction_on}
            />
          </li>
          <li 
            id="detection_event" 
            key="detection_event"
            className="settings_item">
            <label 
              htmlFor="detection_event_input" 
              className="settings_itemLabel">
              Событие по детектору
              </label>
            <FormInput 
              id="detection_event_input"
              name='detection_event'
              type='select'
              changeHandler={form_handler}
              input_value={block_state.detection_event}
              variants={[
                'Не назначено',
                'Выключить ПРД',
                'Сброс мощности',
                'Вкл. резервный вход'
              ]}
              />
          </li>
          {block_state &&
          block_state.detection_event == 2 &&
            <li 
              id="silence_det_pwr_down"
              className='settings_item'>
              <label
                htmlFor="silence_det_pwr_down_input"
                className="settings_itemLabel">
                Сброс мощности, %
              </label>
              <FormInput
                id="silence_det_pwr_down_input"
                name="silence_det_pwr_down"
                type="slider"
                changeHandler={form_handler}
                input_value={block_state.silence_det_pwr_down} />
            </li>
          }
          {block_state &&
          block_state.detection_event == 3 &&
          <>
            <li
              id="silence_det_channel_modes"
              className='settings_item'>
              <label
                htmlFor="silence_det_channel_modes_input"
                className="settings_itemLabel">
                Режимы входов
              </label>
              <div
                className="text_range_container double_select">
                <span>Осн. вход</span>
                <select
                  id='silence_det_primary_channel_list'
                  name='silence_det_primary_channel'
                  className='double_select_item'
                  onChange={form_handler}
                  value={block_state.silence_det_primary_channel}>
                  <option value='0'>Stereo</option>
                  <option value='1'>AEC</option>
                  <option value='2'>КСС</option>
                </select>
                <span>Рез. вход</span>
                <select
                  id='silence_det_backup_channel_list'
                  name='silence_det_backup_channel'
                  className='double_select_item'
                  onChange={form_handler}
                  value={block_state.silence_det_backup_channel}>
                  <option value='0'>Stereo</option>
                  <option value='1'>AEC</option>
                  <option value='2'>КСС</option>
                </select>
              </div>
            </li>
            <li
              id="silence_det_channel_switch"
              className='settings_item'>
              <label
                htmlFor="silence_det_channel_switch_input"
                className="settings_itemLabel">
                Ручн. управление
              </label>
              <FormInput
                id="silence_det_channel_switch_input"
                name="silence_det_channel_switch"
                type="switch"
                changeHandler={form_handler}
                input_value={block_state.silence_det_channel_switch} />
            </li>
          </>
          }
          </>
          }
        </>
      )
    },
  'data_structure': [
    'silence_det_settings_switch',
    'border_off',
    'reaction_off',
    'border_on',
    'reaction_on',
    'detection_event',
    'silence_det_pwr_down',
    'silence_det_primary_channel',
    'silence_det_backup_channel',
    'silence_det_channel_switch'
  ]
}
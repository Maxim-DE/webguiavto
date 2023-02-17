import React from 'react';
import clone from 'lodash/clone';

import FormInput from '../form_input';
import '../form_input/index.css';
import '../settings_block/index.css'
import _ from 'lodash';

function Silence_det_settings({ parent_state, state_handler, ...rest }) {

  const base_state = {
    silence_det_settings_switch: false,
    border_off: '',
    reaction_off: '',
    border_on: '',
    reaction_on: '',
    detection_event: 0,
    silence_det_pwr_down: '',
    silence_det_primary_channel: 0,
    silence_det_backup_channel: 0,
    silence_det_channel_switch: false
  }

  const [silenceDetState, setSilenceDetState] = React.useState(base_state)

  React.useEffect(() => {
    const state_clone = {
      silence_det: clone(silenceDetState)
    }

    state_handler(state_clone)
  }, [])

  React.useEffect(() => {
    const state_clone = {
      silence_det: clone(silenceDetState)
    }

    state_handler(state_clone)
  }, [silenceDetState])

  React.useEffect(() => {
    if (!Object.hasOwn(parent_state, 'silence_det')) return

    if (_.isEqual(parent_state.silence_det, silenceDetState)) return

    setSilenceDetState(
      parent_state.silence_det
    )
  }, [parent_state])


  const changeHandler = (event) => {
    const target = event.target,
      name = target.name,
      value = target.type === 'checkbox' ? target.checked : target.value

    setSilenceDetState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const resetHandler = (event) => {
    if (!event.target.checked) setSilenceDetState(base_state)
  }
  
  return (
    <>
      <li
        key='silence_det_settings'
        id='silence_det_settings'
        className="settings_item">
        <label
          htmlFor={`silence_det_settings_switch_input`}
          className="settings_itemLabel">
          Детектор тишины
        </label>
        <FormInput
          id='silence_det_settings_switch_input'
          name='silence_det_settings_switch'
          type='switch'
          changeHandler={(e) => {
            changeHandler(e);
            resetHandler(e)
          }}
          input_value={silenceDetState.silence_det_settings_switch}
        />
      </li>
      {silenceDetState.silence_det_settings_switch &&
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
              changeHandler={changeHandler}
              input_value={silenceDetState.border_off}
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
              changeHandler={changeHandler}
              input_value={silenceDetState.reaction_off}
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
              changeHandler={changeHandler}
              input_value={silenceDetState.border_on}
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
              changeHandler={changeHandler}
              input_value={silenceDetState.reaction_on}
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
              changeHandler={changeHandler}
              input_value={silenceDetState.detection_event}
              variants={[
                'Не назначено',
                'Выключить ПРД',
                'Сброс мощности',
                'Вкл. рез. вход'
              ]}
            />
          </li>
          {silenceDetState &&
            silenceDetState.detection_event == 2 &&
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
                changeHandler={changeHandler}
                input_value={silenceDetState.silence_det_pwr_down} />
            </li>
          }
          {silenceDetState &&
           silenceDetState.detection_event == 3 &&
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
                    onChange={changeHandler}
                    value={silenceDetState.silence_det_primary_channel}>
                    <option value='0'>Stereo</option>
                    <option value='1'>AEC</option>
                    <option value='2'>КСС</option>
                  </select>
                  <span>Рез. вход</span>
                  <select
                    id='silence_det_backup_channel_list'
                    name='silence_det_backup_channel'
                    className='double_select_item'
                    onChange={changeHandler}
                    value={silenceDetState.silence_det_backup_channel}>
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
                  changeHandler={changeHandler}
                  input_value={silenceDetState.silence_det_channel_switch} />
              </li>
            </>
          }
        </>
      }
    </>
  )
}

export default Silence_det_settings
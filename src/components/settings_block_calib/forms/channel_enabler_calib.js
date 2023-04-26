import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import ModalCalib from '../../calib_modal';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

const base_freqs = [21, 80],
      additional_freqs = [[6, 12]],
      channel_list = freq_arr_to_state_obj(base_freqs, {
        arr1: additional_freqs
      }),
      channel_num = Object.keys(freq_arr_to_state_obj(base_freqs, {
        arr1: additional_freqs
      })).length


export default function ChannelEnablerSettings(props) {

  const [channelEnablerState, setChannelEnablerState] = React.useState({
    channel_list: channel_list,
    channel_num: channel_num
  })

  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (!props.calib_data) {
      return
    } 

    if (Object.keys(props.calib_data).length != 0 ||
        props.calib_data != undefined) {
      let calib_state_copy = {}
        
        for (let i = 0; i < props.calib_data.length; i++) {
          calib_state_copy[`channel_${props.calib_data[i].channel}`] = props.calib_data[i].access
        }

      setChannelEnablerState(prevState => ({
        ...prevState,
        channel_list: calib_state_copy
      }))

    }
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? Number(target.checked) : target.value;
    const name = target.name;

    setChannelEnablerState(prevState => ({
      ...prevState,
      channel_list: {
        ...prevState.channel_list,
        [name]: value
      }
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('channel_', ''),
          value = target.type === 'checkbox' ? Number(target.checked) : target.value

    const request_obj = {
      address: 'calib_channel_enable.cgi',
      data: `channels$${name};allow$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);

  }

  const handleClick_clrAll = (event) => {
    const request_obj = {
      address: 'calib_clr_all_channels.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  const handleClick_setAll = (event) => {
    const request_obj = {
      address: 'calib_set_all_channels.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  const handleClick_saveChannels = (event) => {
    const request_obj = {
      address: 'calib_save_channels.cgi',
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  return (
      <>
      <li
        key='channel_calib_open'
        id='channel_calib_open'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`channel_calib_open_input`}
            className="settings_itemLabel">
            Информация о каналах
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`channel_calib_open_input`}
            name={`channel_calib_open`}
            clickHandler={(e) => {
              setIsOpen(true)
            }}
            label='Открыть'
            type="button" />
        </div>
      </li>
      {isOpen &&
        <ModalCalib
        header='информация о каналах'
        setIsOpen={(e) => {
          setIsOpen(false)
        }}
        user_controllable={true}
        class='full_log_modal sys_log_modal'>
          <li
            key='channel_list_label'
            id='channel_list_label'
            className="settings_item">
            <label
              className="settings_itemLabel">
              Список осн. каналов:
            </label>
          </li>
          <li
            key='channel_enable_calib'
            id='channel_enable_calib'
            className="channel_enable_item">
            {freq_arr_to_render_arr(base_freqs, {arr1: additional_freqs})
              .filter(item => item.channel > base_freqs[0]-1 && item.channel < 61)
              .map(item => {
              return (
                <div
                  className='work_day_checkbox_container'
                  key={`channel_${item.channel}`}>
                  <input
                    id={`channel_${item.channel}_on_input`}
                    name={`channel_${item.channel}`}
                    className={!props.editing_allowed && 'disabled_input'}
                    type="checkbox"
                    checked={!!(channelEnablerState.channel_list[`channel_${item.channel}`])}
                    onChange={(e) => {
                      handleChange(e)
                      handleClick_save(e)
                    }}
                    disabled={!props.editing_allowed}
                  />
                  <span className='work_day_span'>{item.channel}</span>
                </div>
              )
            })}
          </li>
          <li className="group_divider"></li>
          <li
            key='ext_channel_list_label'
            id='ext_channel_list_label'
            className="settings_item">
            <label
              className="settings_itemLabel">
              Список доп. каналов:
            </label>
          </li>
          <li
            key='channel_enable_calib'
            id='add_channel_enable_calib'
            className="channel_enable_item">
            {freq_arr_to_render_arr(base_freqs, {arr1: additional_freqs})
              .filter(item => item.channel < base_freqs[0])
              .map(item => {
              return (
              <div
                className='work_day_checkbox_container'
                key={`channel_${item.channel}`}>
                <input
                  id={`channel_${item.channel}_on_input`}
                  name={`channel_${item.channel}`}
                  className={!props.editing_allowed && 'disabled_input'}
                  type="checkbox"
                  checked={!!(channelEnablerState.channel_list[`channel_${item.channel}`])}
                  onChange={(e) => {
                    handleChange(e)
                    handleClick_save(e)
                  }}
                  disabled={!props.editing_allowed}
                />
                <span className='work_day_span'>{item.channel}</span>
              </div>
              )
            })}
          </li>
          <li className="group_divider"></li>
          <li
            key='channel_list_label'
            id='channel_list_label'
            className="settings_item">
            <label
              className="settings_itemLabel">
              Список доп. осн. каналов:
            </label>
          </li>
          <li
            key='channel_enable_calib'
            id='channel_enable_calib'
            className="channel_enable_item">
            {freq_arr_to_render_arr(base_freqs, {arr1: additional_freqs})
              .filter(item => item.channel > 60 && item.channel < base_freqs[1]+1)
              .map(item => {
              return (
                <div
                  className='work_day_checkbox_container'
                  key={`channel_${item.channel}`}>
                  <input
                    id={`channel_${item.channel}_on_input`}
                    name={`channel_${item.channel}`}
                    className={!props.editing_allowed && 'disabled_input'}
                    type="checkbox"
                    checked={!!(channelEnablerState.channel_list[`channel_${item.channel}`])}
                    onChange={(e) => {
                      handleChange(e)
                      handleClick_save(e)
                    }}
                    disabled={!props.editing_allowed}
                  />
                  <span className='work_day_span'>{item.channel}</span>
                </div>
              )
            })}
          </li>
          {props.editing_allowed &&
          <li
            key='channel_actions_item'
            id='channel_actions_item'
            className="settings_item">
            <div className='item_header'>
            </div>
            <div className='item_input'>
              <FormInput
                id={`setAll_channels_calib_save`}
                name={`setAll_channels_calib`}
                clickHandler={handleClick_setAll}
                label='Вкл. все'
                type="button" />
              <FormInput
                id={`clrAll_channels_calib_save`}
                name={`clrAll_channels_calib`}
                clickHandler={handleClick_clrAll}
                label='Выкл. все'
                type="button" />
              <FormInput
                id={`saveChannels_calib_save`}
                name={`saveChannels_calib`}
                clickHandler={handleClick_saveChannels}
                label='Сохранить'
                type="button" />
            </div>
          </li>
          }
        </ModalCalib>
      }
      </>
  )
}

function freq_arr_to_state_obj(freq_arr, add_freq_arrs = {}) {
  let start = freq_arr[0],
      end = freq_arr[1],
      state_obj = {}

  for (let i = start; i < end+1; i++) {
    state_obj[`channel_${i}`] = 0
  }

  console.log(Object.keys(state_obj).length);

  for (let arr in add_freq_arrs) {
    for (let k = 0; k < add_freq_arrs[arr].length; k++) {

      let arr_instance = add_freq_arrs[arr][k]

      if (Array.isArray(arr_instance)) {
        let start = arr_instance[0],
              end = arr_instance[1]

        for (let k = start; k < end+1; k++) {
          state_obj[`channel_${k}`] = 0
        }

      } else {
        state_obj[`channel_${add_freq_arrs[arr][k]}`] = 0
      }

    }
    
    return state_obj
  }
}

function freq_arr_to_render_arr(freq_arr, add_freq_arrs = {}) {
  let start = freq_arr[0],
      end = freq_arr[1],
      render_arr = []

  for (let i = start; i < end+1; i++) {
    let freq_obj = {}

    freq_obj.channel = i,
    freq_obj.access = 0

    render_arr.push(freq_obj)
  }

  for (let arr in add_freq_arrs) {
    for (let k = 0; k < add_freq_arrs[arr].length; k++) {
      
        let arr_instance = add_freq_arrs[arr][k]
        let freq_obj = {}

        if (Array.isArray(arr_instance)) {
          let start = arr_instance[0],
              end = arr_instance[1]

          for (let i = start; i < end+1; i++) {
            let local_freq_obj = {}
          
            local_freq_obj.channel = i,
            local_freq_obj.access = 0
          
            render_arr.push(local_freq_obj)
          }
          
        }  else {
          freq_obj.channel = add_freq_arrs[arr][k],
          freq_obj.access = 0
    
          render_arr.push(freq_obj)
        }
  
    }
  }

  return render_arr
}
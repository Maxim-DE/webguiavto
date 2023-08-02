import React from 'react'
import clone from 'lodash/clone';

import FormInput from '../form_input';
import ModalCalib from '../calib_modal';
import { TbMinus, TbPlus } from 'react-icons/tb';
import cloneDeep from 'lodash/cloneDeep';
import _ from 'lodash';

export const Alt_station_manage = ({ parent_state, state_handler, ...rest }) => {

  const max_stations = 25

  const [altStationState, setAltStationState] = React.useState({
    alt_stations_available: true,
    alt_station_switch: false,
    alt_stations_list: []
  })

  const [isAltStationOpen, setIsAltStationOpen] = React.useState(false)

  React.useEffect(() => {
    const state_clone = {
      alt_stations: clone(altStationState)
    }

    state_handler(state_clone)
  }, [])

  React.useEffect(() => {
    if (!Object.hasOwn(parent_state, 'alt_stations')) return

    if (_.isEqual(parent_state.alt_stations, altStationState)) return

    setAltStationState(
      parent_state.alt_stations
    )
  }, [parent_state])

  React.useEffect(() => {
    const state_clone = {
      alt_stations: clone(altStationState)
    }

    state_handler(state_clone)
  }, [altStationState])

  const changeHandler = (event) => {
    const target = event.target,
          name = target.name,
          value = target.type === 'checkbox' ? target.checked : target.value

    setAltStationState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const alt_stations_handle = (action) => {
    switch (action) {
      
      case 'plus': {
        let new_station = 0

        setAltStationState(prevState => ({
          ...prevState,
          alt_stations_list: prevState.alt_stations_list.concat(new_station)
        }))

        break;
      }

      case 'minus': {
        let state_arr = cloneDeep(altStationState.alt_stations_list),
            last_index = state_arr.length - 1,
            new_arr = state_arr.slice(0, last_index - 1)

        setAltStationState(prevState => ({
          ...prevState,
          alt_stations_list: new_arr
        }))
  
        break;
      }


      default:
        break;
    }
  }

  const alt_station_save = () => {
    let block_data = altStationState
    let data_string = '';
    let request_obj = {}

    for (const key in block_data) {
      if (block_data[key].length === 0) {
        data_string += `${key}$NULL;`

        // setBlockData(prevState => ({
        //   ...prevState,
        //   [key]: ''
        // }));

        continue
      } else if (Array.isArray(block_data[key])) {
        let station_arr = block_data[key]
        for (let station = 0; station < station_arr.length; station++) {
          data_string += `AF${station}$${station_arr[station]}`;
          
        }
      }

      data_string += `${key}$${block_data[key]};`
    }

    request_obj = {
      address: 'rds.cgi',
      data: data_string,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    rest.update_handler(request_obj)
  }

  const alt_station_reset = () => {
    let old_conf = rest.parent_props.alt_stations_list

    if (old_conf === null || old_conf === undefined) return

    if (old_conf.length == altStationState.alt_stations_list.length) return

    setAltStationState(prevState => ({
      ...prevState,
      alt_stations_list: old_conf
    }))
  }

  return (
    <>
      <li
        key='alt_station_settings'
        id='alt_station_settings'
        className="settings_item">
        <label
          htmlFor={`alt_station_switch_input`}
          className="settings_itemLabel">
          Альтернативные частоты
        </label>
        <FormInput
          id='alt_station_switch_input'
          name='alt_station_switch'
          type='switch'
          changeHandler={changeHandler}
          input_value={altStationState.alt_station_switch}
        />
      </li>
      {altStationState.alt_station_switch &&
        <li
          key='alt_station_config'
          id='alt_station_config'
          className="settings_item nested_item">
          <label
            htmlFor={`alt_station_config_input`}
            className="settings_itemLabel">
            Управление альт. частотами
          </label>
          <FormInput
            id={`alt_station_config_input`}
            name={`alt_station_config`}
            clickHandler={(e) => {
              setIsAltStationOpen(true)
            }}
            label='Открыть'
            type="button" />
        </li>
      }
      {isAltStationOpen &&
        <ModalCalib
          header='изменить альт. частоты'
          setIsOpen={(e) => {
            alt_station_reset();
            setIsAltStationOpen(false);
          }}
          user_controllable={true}
          class='full_log_modal'>
          <ul className="log_list">
          {altStationState.alt_stations_list.map((item, index) => {
            return (
              <>
              <li
                key={item.id}
                id={`log_${item.id}`}
                className={`log_item`}>
                <span>Альт. станиция {index}</span>
                <FormInput
                  id='alt_station_input'
                  name={`alt_station_${index + 1}`}
                  type='text'
                  changeHandler={changeHandler}
                  input_value={altStationState.alt_stations_list[index]} />
              </li>
              {index == altStationState.alt_stations_list.length &&
               index != (max_stations-1) &&
                <button
                  className='button_input'
                  onClick={(e) => {
                    alt_stations_handle('plus')
                  }}
                  type='button'
                  title='Добавить частоту' >
                  <TbPlus />
                </button>
              }
              {index == altStationState.alt_stations_list.length &&
               index != 0 &&
               <button
                 className='button_input'
                 onClick={(e) => {
                   alt_stations_handle('minus')
                 }}
                 type='button'
                 title='Убрать частоту' >
                 <TbMinus />
               </button>
              }
              <div className='log_divider' />
              </>
            )
          })}
          </ul>
          <FormInput
            id={`alt_station_save`}
            name={`alt_station`}
            clickHandler={(e) => {
              alt_station_save();
              setIsAltStationOpen(false)
            }}
            class='log_refresh'
            label='Сохранить'
            type="button"
          />
        </ModalCalib>
      }
    </>
  )
}

import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

import { calib_state_conversion } from '../../../logic/calib_state_conversion';

import cloneDeep from 'lodash/cloneDeep';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

export default function DataEraseCalibSettings(props) {
  const [eraseSectorState, setEraseSectorState] = React.useState({
    init_sector: 0,
    sector_num: 1,
  })

  const style_obj = {
    maxWidth: '60px'
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setEraseSectorState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', '')

    let value = 1

    const request_obj = {
      address: 'calib_data_erase.cgi',
      data: `${name}$${value}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);

  }

  const eraseSector_link_build = () => {
    const request_obj = {
      address: 'calib_data_erase.cgi',
      data: `sector$${eraseSectorState.init_sector};num$${eraseSectorState.sector_num}`,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib header={`удаление данных`}
      settings_type={`data_erase_calib`}
      section_name={props.section_name}>
      <li
        key='mem_erase'
        id='mem_erase'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`mem_erase_input`}
            className="settings_itemLabel">
            Стереть память
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`mem_erase_save`}
            name={`mem_erase`}
            clickHandler={handleClick_save}
            label='Удалить'
            type="button" />
        </div>
      </li>
      <li
        key='sector_download'
        id='sector_download'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`sector_download_input`}
            className="settings_itemLabel">
            Удаление сектора
          </label>
        </div>
        <div className='item_input'>
        </div>
      </li>
      <li
        key='init_sector'
        id='init_sector'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`init_sector_input`}
            className="settings_itemLabel">
            Начальный сектор
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            name='init_sector'
            type="text"
            style={style_obj}
            input_value={eraseSectorState.init_sector}
            changeHandler={handleChange}
          />
        </div>
      </li>
      <li
        key='sector_num'
        id='sector_num'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`sector_num_input`}
            className="settings_itemLabel">
            Количество секторов
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            name='sector_num'
            type="text"
            style={style_obj}
            input_value={eraseSectorState.sector_num}
            changeHandler={handleChange}
          />
        </div>
      </li>
      <li
        key='sector_erase_actions'
        id='sector_erase_actions'
        className="settings_item">
        <div className='item_header'>
        </div>
        <div className='item_input'>
          <FormInput
            id='sector_erase_input'
            name='sector_erase'
            clickHandler={eraseSector_link_build}
            label='Удалить'
            type="button">
            Удалить
          </FormInput>
        </div>
      </li>
      <li className="group_divider"></li>
      <li
        key='conf_erase'
        id='conf_erase'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_erase_input`}
            className="settings_itemLabel">
            Стереть файл конфигурации
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`conf_erase_save`}
            name={`conf_erase`}
            clickHandler={handleClick_save}
            label='Удалить'
            type="button" />
        </div>
      </li>
    </Settings_block_calib>
  )

}
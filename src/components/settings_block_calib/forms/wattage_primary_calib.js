import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function PowerCalibSettings(props) {

  const [powerCalibState, setPowerCalibState] = React.useState({
    dac_value: '',
    output_power: '',
    output_power_threshold: '',
    coupling_coeff: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        const divident = props.calib_data[key][0],
              divider = props.calib_data[key][1],
              digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      }

      setPowerCalibState(calib_state_copy)

    } 
  }, [props.calib_data])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setPowerCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
          name = target.name.replace('_calib', ''),
          value = powerCalibState[name]

    const request_obj = {
      address: 'calib_power.cgi',
      data: `${name}$${value * 10}`
    }

    props.clickHandler(request_obj);

  }

  const handleClick_calib_zeros = (event) => {

    const request_obj = {
        address: 'calib_output_power_zeros.cgi',
      }

    props.clickHandler(request_obj);

  }

  return (
    <Settings_block_calib header={`калибровка мощности`}
                          settings_type={`power_calib`}
                          save_handler={handleClick_save}>
      <li
        key='dac_value_calib'
        id='dac_value_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`dac_value_calib_input`}
            className="settings_itemLabel">
            Значение ЦАП
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП<sub>АРУ</sub>: {
              props.adc_data ? props.adc_data.dac_value[0] : ''
            }
          </span>
          <span className='item_adc_value'>
            ЦАП<sub>АРУ</sub>: {
              props.adc_data ? props.adc_data.dac_value[1] : ''
            }
          </span>
          <input
            type="text"
            id={`dac_value_calib_input`}
            name={`dac_value_calib`}
            className="text_range"
            style={{margin: '0', maxWidth: '54px'}}
            value={powerCalibState.dac_value}
            onChange={handleChange}
          />
          <FormInput
            id={`dac_value_calib_save`}
            name={`dac_value_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='output_power_calib'
        id='output_power_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`output_power_calib_input`}
            className="settings_itemLabel">
            Калибровка вых. мощности
          </label>
          <FormInput
            id={`output_power_zero_calib_input`}
            name={`output_power_zero_calib`}
            label='Калибровка нуля'
            clickHandler={handleClick_calib_zeros}
            type="button" />
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.output_power}
          </span>
          <FormInput
            id={`output_power_calib_input`}
            name={`output_power_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.output_power}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`output_power_calib_save`}
            name={`output_power_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>      
      <li
        key='refected_power_calib'
        id='refected_power_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`refected_power_calib_input`}
            className="settings_itemLabel"
            style={{fontWeight: '400'}}>
            АЦП <sub>отр. мощ.</sub>: {props.adc_data.refected_power}
          </label>
        </div>
      </li>
      <li
        key='output_power_threshold_calib'
        id='output_power_threshold_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`output_power_threshold_calib_input`}
            className="settings_itemLabel">
            Ограничение P<sub>вых</sub>
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value'>
            АЦП: {props.adc_data.output_power_threshold}
          </span>
          <FormInput
            id={`output_power_threshold_calib_input`}
            name={`output_power_threshold_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.output_power_threshold}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`output_power_threshold_calib_save`}
            name={`output_power_threshold_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      <li
        key='сoupling_coeff_calib'
        id='сoupling_coeff_calib'
        className="settings_item calib">
        <div className='item_header'>
          <label
            htmlFor={`сoupling_coeff_calib_input`}
            className="settings_itemLabel">
            Коэфициент связи P<sub>отр</sub>
          </label>
        </div>
        <div className='item_input'>
          <span className='item_adc_value' title='АЦП(отр) -x%*АЦП(вых)'>
            АЦП<sub>отр. после комп.</sub>: {props.adc_data.coupling_coeff}
          </span>
          <FormInput
            id={`сoupling_coeff_calib_input`}
            name={`coupling_coeff_calib`}
            changeHandler={handleChange}
            input_value={powerCalibState.coupling_coeff}
            style={{ margin: '0', maxWidth: '57px' }}
            type="text" />
          <FormInput
            id={`сoupling_coeff_calib_save`}
            name={`coupling_coeff_calib`}
            clickHandler={handleClick_save}
            label='Сохранить'
            type="button" />
        </div>
      </li>
      
    </Settings_block_calib>
  )
}

export default PowerCalibSettings
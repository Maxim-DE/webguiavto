import React from 'react';

import FormInput from '../form_input';
import '../form_input/index.css';

export const amperage_calib = {
  'render_structure': function (form_handler, block_state, group_id, group_name) {
    return (
    <>
      <li
        key='I1_calib'
        id='I1_calib'
        className="settings_item">
        <label
          htmlFor={`I1_calib_input`}
          className="settings_itemLabel">
          Калибровка I1
        </label>
        <FormInput
          id={`I1_calib_input`}
          name={`I1_calib`}
          value={block_state[I1_calib]}
          type="text"
          changeHandler={form_handler} />
      </li>
      <li
        key='I1_zeros_calib'
        id='I1_zeros_calib'
        className="settings_item">
        <label
            htmlFor={`I1_zeros_calib_input`}
          className="settings_itemLabel">
          Калибровка нулей I1
        </label>
        <FormInput
          id={`I1_zeros_calib_input`}
          name={`I1_calib`}
          label='Калибровка нулей'
          type="button" />
      </li>
      <li
        key='I2_calib'
        id='I2_calib'
        className="settings_item">
        <label
          htmlFor={`I2_calib_input`}
          className="settings_itemLabel">
          Калибровка I2
        </label>
        <FormInput
          id={`I2_calib_input`}
          name={`I2_calib`}
          value={block_state[I2_calib]}
          type="text"
          changeHandler={form_handler} />
      </li>
      <li
        key='I2_zeros_calib'
        id='I2_zeros_calib'
        className="settings_item">
        <label
          htmlFor={`I2_zeros_calib_input`}
          className="settings_itemLabel">
          Калибровка нулей I2
        </label>
        <FormInput
          id={`I2_zeros_calib_input`}
          name={`I2_zeros_calib`}
          label='Калибровка нулей'
          type="button" />
      </li>
      <li
        key='I3_calib'
        id='I3_calib'
        className="settings_item">
        <label
          htmlFor={`I3_calib_input`}
          className="settings_itemLabel">
          Калибровка I3
        </label>
        <FormInput
          id={`I3_calib_input`}
          name={`I3_calib`}
          value={block_state[I3_calib]}
          type="text"
          changeHandler={form_handler} />
      </li>
      <li
        key='I3_zeros_calib'
        id='I3_zeros_calib'
        className="settings_item">
        <label
          htmlFor={`I3_zeros_calib_input`}
          className="settings_itemLabel">
          Калибровка нулей I3
        </label>
        <FormInput
          id={`I3_zeros_calib_input`}
          name={`I3_zeros_calib`}
          label='Калибровка нулей'
          type="button" />
      </li>
    </>
    )
  }
}
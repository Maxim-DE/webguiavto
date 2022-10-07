import React from 'react';

import Settings_block_calib from '..';
import FormInput from '../../form_input';

function WattagePrimaryCalibSettings(props) {
  const [wattageAdditionalCalibState, setWattageAdditionalCalibState] = React.useState({
    dac_value: '',
    output_wattage: ''
  })

  React.useEffect(() => {
    if (Object.keys(props.calib_data).length != 0) {
      let calib_state_copy = {}

      for (const key in props.calib_data) {
        const divident = props.calib_data[key][0],
          divider = props.calib_data[key][1]
        calib_state_copy[key] = (divident / divider).toFixed(1)
      }

      setWattagePrimaryCalibState(calib_state_copy)

    }
  }, [props.calib_data])

}

export const calib_state_conversion = (state, props) => {
  if (props === undefined ||
      props === '') {
    return
  }

  let state_copy = JSON.parse(JSON.stringify(state))

  let state_format = {
    value: '',
    divider: '',
    digit_round: '',
    postfix: ''
  }

  for (const key in state_copy) {
    if (typeof state_copy[key] === 'boolean') {
      state_copy[key] = state[key] ? state[key] : ''
      continue
    } else if (typeof state_copy[key] != 'string') {
      continue
    } 

    let output_arr = []
    
    state_format.value = state[key] ? state[key] : ''
    if (props[key]) {
      state_format.divider = props[key][1] ? props[key][1] : ''
      state_format.digit_round = props[key][2] ? props[key][2] : ''
      state_format.postfix = props[key][3] ? props[key][3] : ''
    } else {
      state_format.divider = 1
      state_format.digit_round = 0
      state_format.postfix = ''
    }

    if (state_format.divider != '' &&
        state_format.divider != undefined) {
      state_format.value = Number((state_format.divider * state_format.value).toFixed(0))

    }

    for (const key in state_format) {
      if (key == 'divider' &&
          state_format[key] == '') {
        output_arr.push(1)
        continue
      }

      if (key == 'digit_round' ||
          key == 'postfix') {

        if (state_format[key] == '') continue

      }

      output_arr.push(state_format[key])
    }

    state_copy[key] = output_arr

  }

  return state_copy
}

export const calib_double_array_conversion = (state, props) => {
  if (props === undefined ||
    props === '') {
    return
  }

  let state_copy = JSON.parse(JSON.stringify(state))

  let state_format = {
    value: '',
    divider: '',
    digit_round: '',
    postfix: ''
  }

  for (const key in state_copy) {
    let output_obj = {}

    for (let index = 0; index < state_copy[key].length; index++) {
      let output_arr = []
      // const element = state_copy[key][index];

      state_format.value = state_copy[key][index] ? state_copy[key][index] : ''

      
      if (index == 0) {
        state_format.divider = props[key].low[1] ? props[key].low[1] : ''
        state_format.digit_round = props[key].low[2] ? props[key].low[2] : ''
        state_format.postfix = props[key].low[3] ? props[key].low[3] : ''
      } else {
        state_format.divider = props[key].high[1] ? props[key].high[1] : ''
        state_format.digit_round = props[key].high[2] ? props[key].high[2] : ''
        state_format.postfix = props[key].high[3] ? props[key].high[3] : ''
      }
      
      if (state_format.divider != '' &&
          state_format.divider != undefined) {
        state_format.value = Number((state_format.divider * state_format.value).toFixed(0))
      }

      for (const key in state_format) {
        if (key == 'divider' &&
          state_format[key] == '') {
          output_arr.push(1)
          continue
        }
  
        if (key == 'digit_round' ||
          key == 'postfix') {
  
          if (state_format[key] == '') continue
  
        }
  
        output_arr.push(state_format[key])
      }

      if (index == 0) {
        output_obj.low = output_arr
      } else {
        output_obj.high = output_arr
      }
      
    }

    // state_format.value = state[key] ? state[key] : ''
    // state_format.divider = props[key][1] ? props[key][1] : ''
    // state_format.digit_round = props[key][2] ? props[key][2] : ''
    // state_format.postfix = props[key][3] ? props[key][3] : ''

    state_copy[key] = output_obj

  }

  return state_copy
}
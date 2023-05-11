export const type_device_toStr = (output_data_copy) => {
  const device_power_table = {
          0: '-10',
          1: '-50',
          2: '-100',
          3: '-250',
          4: '-300',
          5: '-500',
          6: '-1000',
          7: '-2000',
          8: '-5000',
          250: ''
        },

        device_name_table = {
          0: 'УРЦ',
          1: 'УСТ',
          2: 'СТ',
          3: 'БЛОК УПРАВЛЕНИЯ',
          250: 'unknown'
        }

  let device_type_str = ''

  try {
    device_type_str += device_name_table[output_data_copy.info_general.type[0]]
  } catch (error) {
    device_type_str = ''
  }

  try {
    device_type_str += device_power_table[output_data_copy.info_general.type[1]]
  } catch (error) {
    device_type_str += ''
  }

  output_data_copy.info_general.Type_Device = device_type_str

  return output_data_copy
}
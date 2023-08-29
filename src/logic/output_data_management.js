export const type_device_toStr = (typeDevice_arr) => {
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
          0: 'УСТ',
          1: 'УРЦ',
          2: 'СТ',
          3: 'РЦ',
          4: 'БЛОК УПРАВЛЕНИЯ',
          250: 'unknown'
        }

  let device_type_str = ''

  try {
    device_type_str += device_name_table[typeDevice_arr[0]]
  } catch (error) {
    device_type_str = ''
  }

  try {
    device_type_str += device_power_table[typeDevice_arr[1]]
  } catch (error) {
    device_type_str += ''
  }

  return device_type_str
}
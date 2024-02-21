import React from 'react'

import cloneDeep from 'lodash/cloneDeep';

import FormInput from '../../form_input'
import ModalCalib from '../../calib_modal'

import useGlobalStore from '../../../logic/auth_store';
import { PulseLoader } from 'react-spinners';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useFormValidation } from '../../../logic/validation/formValidation_hook';
import { hasCyrillicSymbols } from '../../../logic/validation/validators';
import { useSelector } from 'react-redux';

const auth_levels = {
  0: "guest",
  1: "user",
  2: "admin",
  3: "super_admin"
}

export default function Account_manage_calib(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false)

  const auth_store = useSelector((store) => store.authStore.auth_data)

  const [accountState, setAccountState] = React.useState({
    user_list: [],
    active_edit_acc: {}
  })
  const { isFormValid, validStatus_getter, validInputList } = useFormValidation()

  React.useEffect(() => {
    if (Object.keys(props.userData).length != 0) {
      setAccountState(prevState => ({
        ...prevState,
        user_list: props.userData
      }))

      setIsLoading(false)
    }
  }, [props.userData])

  const changeHandler = (event) => {
    if (Object.keys(accountState.active_edit_acc).length === 0) return

    const target = event.target,
      name = target.name,
      value = target.type === 'checkbox' ? target.checked : target.value

    const change_params = name.split('_'),
      id = change_params[0],
      change_type = name.replace(/^(\d*_)|(none_)/g, '')

    switch (change_type) {
      case 'login':
        setAccountState(prevState => ({
          ...prevState,
          active_edit_acc: {
            ...prevState.active_edit_acc,
            login: value
          }
        }))
        break;

      case 'password':
        setAccountState(prevState => ({
          ...prevState,
          active_edit_acc: {
            ...prevState.active_edit_acc,
            password: value
          }
        }))
        break;

      case 'auth_level':
        setAccountState(prevState => ({
          ...prevState,
          active_edit_acc: {
            ...prevState.active_edit_acc,
            auth_level: value
          }
        }))
        break;

      default:
        break;
    }
  }

  const toggleEditableAccount = ({ id, index, boolean } = {}) => {

    let user_list_clone = cloneDeep(accountState.user_list)

    user_list_clone.forEach((user) => {
      user.editable = false
    })

    if (user_list_clone[index] !== undefined && boolean !== undefined) {
      user_list_clone[index].editable = boolean
    }

    setAccountState(prevState => ({
      ...prevState,
      user_list: user_list_clone
    }))
  }

  const createAccInBuffer = () => {
    const acc_template = {
      id: 'none',
      login: '',
      password: '',
      auth_level: 1,
      editable: true
    }

    setAccountState(prevState => ({
      ...prevState,
      active_edit_acc: acc_template
    }))
  }

  const copyAccToBuffer = ({ id, index, boolean } = {}) => {
    let acc_to_edit = cloneDeep(accountState.user_list[index])
    
    acc_to_edit.password = ''

    setAccountState(prevState => ({
      ...prevState,
      active_edit_acc: acc_to_edit
    }))
  }

  const copyBuffertoList = ({ id, index, boolean } = {}) => {
    let index_to_copy = accountState.user_list.findIndex(user => user.id === id),
        acc_to_copy = accountState.active_edit_acc

    if (index_to_copy === -1) {
      doRegisterAccReq({
        login: acc_to_copy.login,
        password: acc_to_copy.password,
        auth_level: acc_to_copy.auth_level
      })
    } else {
      doSaveAccReq({
        id: acc_to_copy.id,
        login: acc_to_copy.login,
        password: acc_to_copy.password,
        auth_level: acc_to_copy.auth_level
      })
    }

    // setAccountState(prevState => ({
    //   ...prevState,
    //   user_list: list_to_copy
    // }))
  }

  const cleanBuffer = () => {
    setAccountState(prevState => ({
      ...prevState,
      active_edit_acc: {}
    }))
  }

  const deleteEditingAcc = ({ id, index_to_delete, boolean } = {}) => {
    let filtered_list = accountState.user_list.filter(function (user, index) {
      return index_to_delete != index
    })

    setAccountState(prevState => ({
      ...prevState,
      user_list: filtered_list
    }))
  }

  const setAccEditOn = ({ id, index, boolean } = {}) => {
    toggleEditableAccount({
      index: index,
      boolean: true
    });

    copyAccToBuffer({
      index: index,
      boolean: true
    });
  }

  const setAccEditSave = ({ id, index, boolean } = {}) => {
    copyBuffertoList({
      id: id
    })

    toggleEditableAccount({
      index: index,
      boolean: false
    })

    cleanBuffer()

  }

  const setAccEditDelete = ({ id, index, boolean } = {}) => {
    toggleEditableAccount({
      index: index,
      boolean: false
    })

    cleanBuffer()

    // deleteEditingAcc({
    //   index_to_delete: index
    // })
    doDeleteAccReq({
      id: id
    })
  }

  const setAccEditCancel = ({ id, index, boolean } = {}) => {
    cleanBuffer()

    toggleEditableAccount({
      index: index,
      boolean: false
    })
  }

  const doGetAccList = () => {
    const req_obj = {
      address: 'get_user_list.cgi',
      reducer: reducers.user_list_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)
    console.log('acc get list')

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doSaveAccReq = ({ id, login, password, auth_level } = {}) => {
    const new_login = login.length > 0 ? login : 'NULL',
          new_passw = password.length > 0 ? password : 'NULL',
          new_auth_level = isNaN(Number(auth_level)) ? 'NULL' : auth_level

    const req_obj = {
      address: 'edit_user.cgi',
      data: `id$${id};login$${new_login};password$${new_passw};auth_level$${new_auth_level}`,
      reducer: reducers.user_list_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)
    console.log('acc save');

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doDeleteAccReq = ({ id } = {}) => {
    const req_obj = {
      address: 'delete_user.cgi',
      data: `id$${id}`,
      reducer: reducers.user_list_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    console.log(req_obj)
    console.log('acc delete');

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doResetAccs = ({ id } = {}) => {
    const req_obj = {
      address: 'reset_user_list.cgi',
      reducer: reducers.user_list_handling,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  const doRegisterAccReq = ({ login, password, auth_level } = {}) => {
    const new_login = login.length > 0 ? login : 'NULL',
          new_passw = password.length > 0 ? password : 'NULL',
          new_auth_level = isNaN(Number(auth_level)) ? 'NULL' : auth_level

    const req_obj = {
      address: 'register_user.cgi',
      data: `login$${new_login};password$${new_passw};auth_level$${new_auth_level}`,
      reducer: reducers.user_list_handling,
      notifications: {
        good: 'Зарегистрировано',
        bad: 'default'
      },
    }

    console.log(req_obj)
    console.log('acc register');

    props.updateHandler(req_obj)
    // setIsLoading(true)
  }

  return (
    <>
      <li
        key='sys_logs_calib'
        id='sys_logs_calib'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`account_manage_calib_input`}
            className="settings_itemLabel">
            Управление учетными записями
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`account_manage_calib_input`}
            name={`account_manage_calib`}
            clickHandler={(e) => {
              doGetAccList()
              // setIsLoading(true)
              setIsOpen(true);
            }}
            label='Открыть'
            type="button" />
        </div>
      </li>
      {isOpen &&
        <ModalCalib
          header='управление учетными записями'
          setIsOpen={(e) => {
            setIsOpen(false)
          }}
          user_controllable={true}
          class='acc_manage_modal'>
          {isLoading ?
            <>
              <div className='hex_upload_message_wrap'>
                <PulseLoader
                  color="#bbcacf"
                  loading
                  margin={9}
                  size={13}
                  speedMultiplier={0.5}
                />
                <span className='hex_upload_upload_message'>
                  Идет получение списка пользователей...
                </span>
              </div>
            </> :
            <>
              <table className="log_list_table acc_manage">
                <thead className="logs_header">
                  <tr>
                    <td>логин</td>
                    <td>ур. доступа</td>
                    <td></td>
                    <td>действия</td>
                  </tr>
                </thead>
                <tbody className="user_log log_list">
                  {accountState.user_list.map((user, index) => {
                    return (
                      <tr
                        key={user.id}
                        id={`user_${user.id}`}
                        className={`acc_item`}>
                        <td className='acc_login'>
                          <FormInput
                            id={`${user.id}_login_input`}
                            name={`${user.id}_login`}
                            type="text"
                            class={!(user.editable) ? 'transparent' : ''}
                            changeHandler={changeHandler}
                            max_length='20'
                            input_value={user.editable ?
                              accountState.active_edit_acc.login :
                              user.login
                            }
                            disabled={!(user.editable)}
                            validators={[
                              hasCyrillicSymbols()
                            ]}
                            formValidHandler={validStatus_getter}
                          />
                        </td>
                        <td className='acc_auth_level'>
                          <FormInput
                            id={`${user.id}_auth_level_input`}
                            name={`${user.id}_auth_level`}
                            type={!user.editable ? 'text' : 'select'}
                            class={!user.editable ? 'transparent' : ''}
                            changeHandler={changeHandler}
                            max_length='10'
                            input_value={user.editable ?
                              accountState.active_edit_acc.auth_level :
                              auth_levels[user.auth_level]
                            }
                            disabled={!user.editable}
                            validators={[
                              hasCyrillicSymbols()
                            ]}
                            formValidHandler={validStatus_getter}
                            variants={[undefined, 'user', 'admin']}
                          />
                        </td>
                        <td className='acc_password'>
                          {!!user.editable &&
                            <FormInput
                              id={`${user.id}_password_input`}
                              name={`${user.id}_password`}
                              type={!user.editable ? 'password' : 'text'}
                              class={!user.editable ? 'transparent' : ''}
                              changeHandler={changeHandler}
                              max_length='10'
                              input_value={user.editable ?
                                accountState.active_edit_acc.password :
                                user.password
                              }
                              disabled={!user.editable}
                              placeholder='Новый пароль'
                              validators={[
                                hasCyrillicSymbols()
                              ]}
                              formValidHandler={validStatus_getter}
                            />
                          }
                        </td>
                        <td className="acc_actions">
                          {user.editable ?
                            <>
                              <FormInput
                                clickHandler={(e) => {
                                  setAccEditSave({
                                    id: user.id,
                                    index: index,
                                    boolean: false
                                  })
                                }}
                                disabled={!(validInputList[`${user.id}_login`] && validInputList[`${user.id}_password`])}
                                label='Сохранить'
                                type="button" />
                                <FormInput
                                  clickHandler={(e) => {
                                    setAccEditDelete({
                                      id: user.id,
                                      index: index,
                                      boolean: false
                                    })
                                  }}
                                  label='Удалить'
                                  type="button" />
                              {/* {user.login != 'admin' &&
                              } */}
                              <FormInput
                                clickHandler={(e) => {
                                  setAccEditCancel({
                                    index: index,
                                    boolean: false
                                  })
                                }}
                                label='Отмена'
                                type="button" />
                            </> :
                            <FormInput
                              id={`sys_logs_calib_input`}
                              name={`sys_logs_calib`}
                              clickHandler={(e) => {
                                setAccEditOn({
                                  index: index,
                                  boolean: true
                                })
                              }}
                              label='Редактировать'
                              type="button" />
                          }
                        </td>
                      </tr>
                    )
                  })}
                  {accountState.active_edit_acc?.id === 'none' &&
                    <>
                      <div className='log_divider'></div>
                      <tr
                        key={accountState.active_edit_acc.id}
                        id={`user_${accountState.active_edit_acc.id}`}
                        className={`acc_item`}>
                        <td className='acc_login'>
                          <FormInput
                            id={`${accountState.active_edit_acc.id}_login_input`}
                          name={`${accountState.active_edit_acc.id}_login`}
                            type="text"
                            class={!accountState.active_edit_acc.editable ? 'transparent' : ''}
                            changeHandler={changeHandler}
                            max_length='20'
                            input_value={accountState.active_edit_acc.editable ?
                              accountState.active_edit_acc.login :
                              accountState.active_edit_acc.login
                            }
                            disabled={!accountState.active_edit_acc.editable}
                            placeholder='Логин'
                            validators={[
                              hasCyrillicSymbols()
                            ]}
                            formValidHandler={validStatus_getter}
                          />
                        </td>
                        <td className="acc_auth_level">
                          <FormInput
                            id={`${accountState.active_edit_acc.id}_auth_level_input`}
                            name={`${accountState.active_edit_acc.id}_auth_level`}
                            type={!(accountState.active_edit_acc.editable && auth_store.auth_access.calib) ? 'text' : 'select'}
                            class={!(accountState.active_edit_acc.editable && auth_store.auth_access.calib) ? 'transparent' : ''}
                            changeHandler={changeHandler}
                            maxLength='10'
                            input_value={accountState.active_edit_acc.editable ?
                              accountState.active_edit_acc.auth_level :
                              auth_levels[accountState.active_edit_acc.auth_level]
                            }
                            disabled={!accountState.active_edit_acc.editable}
                            validators={[
                              hasCyrillicSymbols()
                            ]}
                            formValidHandler={validStatus_getter}
                            variants={[undefined, 'user', 'admin']}
                          />
                        </td>
                        <td className="acc_password">
                          <FormInput
                            id={`${accountState.active_edit_acc.id}_password_input`}
                            name={`${accountState.active_edit_acc.id}_password`}
                            type={!(accountState.active_edit_acc.editable && auth_store.auth_access.calib) ? 'password' : 'text'}
                            class={!(accountState.active_edit_acc.editable && auth_store.auth_access.calib) ? 'transparent' : ''}
                            changeHandler={changeHandler}
                            maxLength='10'
                            input_value={accountState.active_edit_acc.editable ?
                              accountState.active_edit_acc.password :
                              accountState.active_edit_acc.password
                            }
                            disabled={!accountState.active_edit_acc.editable}
                            placeholder='Новый пароль'
                            validators={[
                              hasCyrillicSymbols()
                            ]}
                            formValidHandler={validStatus_getter}
                          />
                        </td>
                        <td className="acc_actions">
                          {accountState.active_edit_acc.editable ?
                            <>
                              <FormInput
                                clickHandler={(e) => {
                                  setAccEditSave({
                                    id: accountState.active_edit_acc.id,
                                    index: accountState.user_list.length + 1,
                                    boolean: false
                                  })
                                }}
                                disabled={!(validInputList[`${accountState.active_edit_acc.id}_login`] && validInputList[`${accountState.active_edit_acc.id}_password`])}
                                label='Сохранить'
                                type="button" />
                              <FormInput
                                clickHandler={(e) => {
                                  setAccEditCancel({
                                    index: accountState.user_list.length + 1,
                                    boolean: false
                                  })
                                }}
                                label='Отмена'
                                type="button" />
                            </> :
                            <FormInput
                              id={`sys_logs_calib_input`}
                              name={`sys_logs_calib`}
                              clickHandler={(e) => {
                                setAccEditOn({
                                  index: accountState.user_list.length + 1,
                                  boolean: true
                                })
                              }}
                              label='Редактировать'
                              type="button" />
                          }
                        </td>
                      </tr>
                    </>
                  }
                </tbody>
              </table>
              <div className="acc_list_actions_wrap">
                {auth_store.auth_access.calib_extend &&
                  <FormInput
                    id={`calib_user_list_reset`}
                  name={`calib_user_list_reset`}
                    clickHandler={(e) => {
                      doResetAccs()
                    }}
                    class='log_refresh'
                    label='Сброс учетных записей'
                    type="button"
                  />
                }
                {accountState.user_list.length < 6 &&
                  <FormInput
                    id={`calib_password_save`}
                    name={`calib_password`}
                    clickHandler={(e) => {
                      toggleEditableAccount({
                        index: undefined,
                        boolean: false
                      });

                      createAccInBuffer()
                    }}
                    class='log_refresh'
                    label='Добавить нов. пользователя'
                    type="button"
                  />
                }
              </div>
            </>
          }
        </ModalCalib>
      }
    </>
  )
}

// function AccountInstance({ user_data, user_buffer, state_handler, updateHandler, ...rest }) {

//   const changeHandler = (event) => {
//     if (Object.keys(accountState.active_edit_acc).length === 0) return

//     const target = event.target,
//       name = target.name,
//       value = target.type === 'checkbox' ? target.checked : target.value

//     const change_params = name.split('_'),
//       id = change_params[0],
//       change_type = change_params[1]

//     switch (change_type) {
//       case 'login':
//         setAccountState(prevState => ({
//           ...prevState,
//           active_edit_acc: {
//             ...prevState.active_edit_acc,
//             login: value
//           }
//         }))
//         break;

//       case 'password':
//         setAccountState(prevState => ({
//           ...prevState,
//           active_edit_acc: {
//             ...prevState.active_edit_acc,
//             password: value
//           }
//         }))
//         break;

//       default:
//         break;
//     }
//   }

//   const toggleEditableAccount = ({ id, index, boolean } = {}) => {

//     let user_list_clone = cloneDeep(accountState.user_list)

//     if (user_list_clone[index] === undefined) {
//       return
//     }

//     user_list_clone.forEach((user) => {
//       user.editable = false
//     })

//     user_list_clone[index].editable = boolean

//     setAccountState(prevState => ({
//       ...prevState,
//       user_list: user_list_clone
//     }))
//   }

//   const createAccInBuffer = () => {
//     const acc_template = {
//       id: 'none',
//       login: '',
//       password: '',
//       auth_level: 0,
//       editable: true
//     }

//     setAccountState(prevState => ({
//       ...prevState,
//       active_edit_acc: acc_template
//     }))
//   }

//   const copyAccToBuffer = ({ id, index, boolean } = {}) => {
//     let acc_to_edit = accountState.user_list[index]

//     setAccountState(prevState => ({
//       ...prevState,
//       active_edit_acc: acc_to_edit
//     }))
//   }

//   const copyBuffertoList = ({ id, index, boolean } = {}) => {
//     let index_to_copy = accountState.user_list.findIndex(user => user.id === id),
//       acc_to_copy = accountState.active_edit_acc

//     if (index_to_copy === -1) {
//       doRegisterAccReq({
//         login: acc_to_copy.login,
//         password: acc_to_copy.password
//       })
//     } else {
//       doSaveAccReq({
//         id: acc_to_copy.id,
//         login: acc_to_copy.login,
//         password: acc_to_copy.password
//       })
//     }

//     // setAccountState(prevState => ({
//     //   ...prevState,
//     //   user_list: list_to_copy
//     // }))
//   }

//   const cleanBuffer = () => {
//     setAccountState(prevState => ({
//       ...prevState,
//       active_edit_acc: {}
//     }))
//   }

//   const deleteEditingAcc = ({ id, index_to_delete, boolean } = {}) => {
//     let filtered_list = accountState.user_list.filter(function (user, index) {
//       return index_to_delete != index
//     })

//     setAccountState(prevState => ({
//       ...prevState,
//       user_list: filtered_list
//     }))
//   }

//   const setAccEditOn = ({ id, index, boolean } = {}) => {
//     toggleEditableAccount({
//       index: index,
//       boolean: true
//     });

//     copyAccToBuffer({
//       index: index,
//       boolean: true
//     });
//   }

//   const setAccEditSave = ({ id, index, boolean } = {}) => {
//     copyBuffertoList({
//       id: id
//     })

//     toggleEditableAccount({
//       index: index,
//       boolean: false
//     })

//     cleanBuffer()

//   }

//   const setAccEditDelete = ({ id, index, boolean } = {}) => {
//     toggleEditableAccount({
//       index: index,
//       boolean: false
//     })

//     cleanBuffer()

//     // deleteEditingAcc({
//     //   index_to_delete: index
//     // })
//     doDeleteAccReq({
//       id: id
//     })
//   }

//   const setAccEditCancel = ({ id, index, boolean } = {}) => {
//     cleanBuffer()

//     toggleEditableAccount({
//       index: index,
//       boolean: false
//     })
//   }

//   const doGetAccList = () => {
//     const req_obj = {
//       address: 'get_user_list.cgi',
//       reducer: reducers.user_list_handling,
//       notifications: {
//         good: 'default',
//         bad: 'default'
//       },
//     }

//     console.log(req_obj)
//     console.log('acc get list')

//     props.updateHandler(req_obj)
//     // setIsLoading(true)
//   }

//   const doSaveAccReq = ({ id, login, password } = {}) => {
//     const new_login = login.length > 0 ? login : 'NULL',
//       new_passw = password.length > 0 ? password : 'NULL'

//     const req_obj = {
//       address: 'edit_user.cgi',
//       data: `id$${id};login$${new_login};password$${new_passw}`,
//       reducer: reducers.user_list_handling,
//       notifications: {
//         good: 'default',
//         bad: 'default'
//       },
//     }

//     console.log(req_obj)
//     console.log('acc save');

//     props.updateHandler(req_obj)
//     // setIsLoading(true)
//   }

//   const doDeleteAccReq = ({ id } = {}) => {
//     const req_obj = {
//       address: 'delete_user.cgi',
//       data: `id$${id}`,
//       reducer: reducers.user_list_handling,
//       notifications: {
//         good: 'default',
//         bad: 'default'
//       },
//     }

//     console.log(req_obj)
//     console.log('acc delete');

//     props.updateHandler(req_obj)
//     // setIsLoading(true)
//   }

//   const doResetAccs = ({ id } = {}) => {
//     const req_obj = {
//       address: 'reset_user_list.cgi',
//       reducer: reducers.user_list_handling,
//       notifications: {
//         good: 'default',
//         bad: 'default'
//       },
//     }

//     props.updateHandler(req_obj)
//     // setIsLoading(true)
//   }

//   const doRegisterAccReq = ({ login, password } = {}) => {
//     const new_login = login.length > 0 ? login : 'NULL',
//       new_passw = password.length > 0 ? password : 'NULL'

//     const req_obj = {
//       address: 'register_user.cgi',
//       data: `login$${new_login};password$${new_passw}`,
//       reducer: reducers.user_list_handling,
//       notifications: {
//         good: 'Зарегистрировано',
//         bad: 'default'
//       },
//     }

//     console.log(req_obj)
//     console.log('acc register');

//     props.updateHandler(req_obj)
//     // setIsLoading(true)
//   }
//   return (
//     <tr
//       key={user.id}
//       id={`user_${user.id}`}
//       className={`acc_item`}>
//       <td className='acc_login'>
//         <FormInput
//           id={`${user.id}_login_input`}
//           name={`${user.id}_login`}
//           type="text"
//           class={!(user.editable && user.login != 'admin') ? 'transparent' : ''}
//           changeHandler={changeHandler}
//           max_length='20'
//           input_value={user.editable ?
//             accountState.active_edit_acc.login :
//             user.login
//           }
//           disabled={!(user.editable && user.login != 'admin')}
//           validators={[
//             hasCyrillicSymbols()
//           ]}
//           formValidHandler={validStatus_getter}
//         />
//       </td>
//       <td className='acc_password'>
//         <FormInput
//           id={`${user.id}_password_input`}
//           name={`${user.id}_password`}
//           type={!user.editable ? 'text' : 'select'}
//           class={!user.editable ? 'transparent' : ''}
//           changeHandler={changeHandler}
//           max_length='10'
//           input_value={user.editable ?
//             accountState.active_edit_acc.auth_level :
//             user.auth_level
//           }
//           disabled={!user.editable}
//           validators={[
//             hasCyrillicSymbols()
//           ]}
//           formValidHandler={validStatus_getter}
//           variants={[0, 1, 2, 3]}
//         />
//       </td>
//       <td className="acc_actions">
//         {user.editable ?
//           <>
//             <FormInput
//               clickHandler={(e) => {
//                 setAccEditSave({
//                   id: user.id,
//                   index: index,
//                   boolean: false
//                 })
//               }}
//               disabled={!(validInputList[`${user.id}_login`] && validInputList[`${user.id}_password`])}
//               label='Сохранить'
//               type="button" />
//             {user.login != 'admin' &&
//               <FormInput
//                 clickHandler={(e) => {
//                   setAccEditDelete({
//                     id: user.id,
//                     index: index,
//                     boolean: false
//                   })
//                 }}
//                 label='Удалить'
//                 type="button" />
//             }
//             <FormInput
//               clickHandler={(e) => {
//                 setAccEditCancel({
//                   index: index,
//                   boolean: false
//                 })
//               }}
//               label='Отмена'
//               type="button" />
//           </> :
//           <FormInput
//             id={`sys_logs_calib_input`}
//             name={`sys_logs_calib`}
//             clickHandler={(e) => {
//               setAccEditOn({
//                 index: index,
//                 boolean: true
//               })
//             }}
//             label='Редактировать'
//             type="button" />
//         }
//       </td>
//     </tr>
//   )
// }

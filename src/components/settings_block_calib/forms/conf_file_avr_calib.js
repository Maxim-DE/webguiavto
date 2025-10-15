import React from 'react';

import Settings_block_calib from '..';

import Dropzone from 'dropzone'
import { PulseLoader } from 'react-spinners';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import cloneDeep from 'lodash/cloneDeep';

import ModalCalib from '../../calib_modal';
import { AlertDialogWrap } from '../../alert_dialog_wrap';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';
import { reducers } from '../../../store/reducers/calib_forms_reducers';
import { useSelector } from 'react-redux';

export const conf_file_links = {
  factory_reset: {
    address: 'calib_conf_file.cgi',
    data: 'factory_reset$1',
    reducer: reducers.factory_reset
  },
  reserve_conf_reset: {
    address: 'calib_conf_file.cgi',
    data: 'reserve_conf_reset$1',
    reducer: reducers.factory_reset
  },
  conf_file_download: {
    address: 'ReadFileConfing.bson',
    data: 'confing_dev$1;confing_user$1'
  },
  conf_user_file_download: {
    address: 'ReadUserConfing.bson',
    data: 'confing_user$1'
  },
  create_new_factory_conf: {
    address: 'calib_super_admin_conf_file.cgi',
    data: 'create_new_factory_conf$1'
  },
  restore_factory_conf: {
    address: 'calib_super_admin_conf_file.cgi',
    data: 'restore_factory_conf$1'
  },
  create_new_res_conf: {
    address: 'calib_admin_conf_file.cgi',
    data: 'create_new_res_conf$1'
  },
  restore_res_conf: {
    address: 'calib_admin_conf_file.cgi',
    data: 'restore_res_conf$1'
  },
  set_settings_as_factory: {
    address: 'calib_super_admin_conf_file.cgi',
    data: 'set_settings_as_factory$1'
  }
}

export default function ConfFileCalib_AVR(props) {
  const auth_store = useSelector((store) => store.authStore.auth_data),
        info_section_data = useSelector((store) => store.globalStore.global_data.section_data.info)


  // const [auth_store, authGlobalActions] = useGlobalStore()

  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({
    progress: 0
  });

  
  const [isNewConfAlertOpen, setIsNewConfAlertOpen] = React.useState(false)
  
  const hex_dropzone_ref = React.useRef(null)
  const hex_dropzone_instance = React.useRef(null)

  const hex_second_dropzone_ref = React.useRef(null)
  const hex_second_dropzone_instance = React.useRef(null)
  
  // строка имени устройства
  let device_arr = [],
  device_type = 0
  
  if (info_section_data.info_general) {
    device_arr = info_section_data.info_general.device_type_list ? info_section_data.info_general.device_type_list : [],
    device_type = info_section_data.info_general.model ? info_section_data.info_general?.model : 0
  }

  const [confCalibState, setConfCalibState] = React.useState({
    factory_reset_available: 1,
    device_conf_type: device_type,
    reserve_conf_create_time: '2025.08.27 21:00',
    factory_conf_create_time: '2025.08.27 21:00'
  })

  React.useEffect(() => {
  if (props.calib_data != undefined &&
      Object.keys(props.calib_data).length != 0) {

    let calib_state_copy = cloneDeep(confCalibState)
    for (const key in props.calib_data) {
      if (Array.isArray(props.calib_data[key])) {
        const divident = props.calib_data[key][0],
              divider = props.calib_data[key][1] == 0 ? 1 : props.calib_data[key][1],
              digits = Math.log10(divider)
        calib_state_copy[key] = (divident / divider).toFixed(digits)
      } else {
        calib_state_copy[key] = props.calib_data[key]
      }
    }
    
    setConfCalibState(calib_state_copy)

  }

  }, [props.calib_data])

  React.useEffect(() => {
    console.log(hex_dropzone_instance.current);
    if (!hex_dropzone_instance.current) {
      hex_dropzone_instance.current = new Dropzone(hex_second_dropzone_ref.current, {
        url: '/user_conf_file_upload',
        chunking: true,
        chunkSize: 1024,
        parallelUploads: 1,
        forceChunking: true,
        retryChunks: true,
        retryChunksLimit: 2
      });
  
      hex_dropzone_instance.current.on('addedfile', file => {
        setIsUploading(true)
      })
  
      hex_dropzone_instance.current.on('uploadprogress', (file, progress, bytesSent) => {
        let progress_rounded = progress.toFixed()
        console.log(progress_rounded);
        
        setUploadProgress({
          progress: progress_rounded,
        })
      })
  
      hex_dropzone_instance.current.on('success', file => {
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })
        toast.success(`Успешно загружено`, { autoClose: 1500 })
      })
  
      hex_dropzone_instance.current.on('error', (file, message) => {
        const xhr_response_obj = file.xhr
        console.log(xhr_response_obj);
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })
        toast.error(`Ошибка загрузки`, { autoClose: 1500 })
      })
  
      console.warn('dropzone created successfully');
    }

    console.log(hex_second_dropzone_instance.current);
    if (!hex_second_dropzone_instance.current) {
      hex_second_dropzone_instance.current = new Dropzone(hex_dropzone_ref.current, {
        url: '/user_conf_file_upload',
        chunking: true,
        chunkSize: 1024,
        parallelUploads: 1,
        forceChunking: true,
        retryChunks: true,
        retryChunksLimit: 2
      });

      hex_second_dropzone_instance.current.on('addedfile', file => {
        setIsUploading(true)
      })

      hex_second_dropzone_instance.current.on('uploadprogress', (file, progress, bytesSent) => {
        let progress_rounded = progress.toFixed()
        console.log(progress_rounded);

        setUploadProgress({
          progress: progress_rounded,
        })
      })

      hex_second_dropzone_instance.current.on('success', file => {
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })
        toast.success(`Успешно загружено`, { autoClose: 1500 })
      })

      hex_second_dropzone_instance.current.on('error', (file, message) => {
        const xhr_response_obj = file.xhr
        console.log(xhr_response_obj);
        setIsUploading(false)
        setUploadProgress({
          progress: 0,
        })
        toast.error(`Ошибка загрузки`, { autoClose: 1500 })
      })

      console.warn('dropzone created successfully');
    }
  }, [])

  React.useEffect(() => {
    let request_obj

    if (isUploading) {
      setIsUploadModalOpen(true)
      request_obj = {
        action: 'block_queue'
      }

    } else {
      setIsUploadModalOpen(false)
      request_obj = {
        action: 'unblock_queue'
      }
    }
    
    props.clickHandler(request_obj)
  }, [isUploading])

  const handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name.replace('_calib', '');

    setConfCalibState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleClick_save = (event) => {
    const target = event.target,
      name = target.name.replace('_calib', ''),
      address = conf_file_links[name].address,
      data = conf_file_links[name].data

    const request_obj = {
      address: address,
      data: data,
      notifications: {
        good: 'default',
        bad: 'default'
      }
    }

    props.clickHandler(request_obj);

  }

  const handleModalClose = () => {
    setIsUploading(false)
    
    if (hex_dropzone_ref.current.dropzone) {
      hex_dropzone_instance.current.removeAllFiles(true)
    }
  }

  const device_conf_create = () => {
    const conf_type_value = 0

    const request_obj = {
      address: 'calib_super_admin_conf_file.cgi',
      data: `create_type_conf$${conf_type_value}`,
      // reducer: reducers.calibration_form,
      notifications: {
        good: 'default',
        bad: 'default'
      },
    }

    props.clickHandler(request_obj);
  }

  return (
    <Settings_block_calib header={`файлы конфигурации`}
      settings_type={`conf_file_calib`}
    // save_handler={handleClick_save}
    >
      
      <li
        key='factory_reset_manage'
        id='factory_reset_manage'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`test_post_req_input`}
            className="settings_itemLabel">
            Восст. заводских настроек
          </label>
        </div>
        <div className='item_input'>
          <FormInput
            id={`factory_reset_input`}
            name={`factory_reset`}
            title={!confCalibState.factory_reset_available && 'Отсутсвует резерв. конфигурация'}
            clickHandler={handleClick_save}
            disabled={!confCalibState.factory_reset_available}
            label='Восстановить'
            type="button" />
        </div>
      </li>
      {auth_store.auth_access.calib_extend &&
        <>
        <li
          key='create_new_conf'
          id='create_new_conf'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`tcreate_new_conf_input`}
              className="settings_itemLabel">
              Создать новый пустой файл
            </label>
          </div>
          <div className='item_input'>
            {/* <FormInput
              id={`device_conf_type_calib`}
              name={`device_conf_type_calib`}
              type='select'
              input_value={confCalibState.device_conf_type}
              title='Тип устройства'
              variants={device_arr}
              changeHandler={handleChange} /> */}
            <FormInput
              id={`device_conf_type_calib_save`}
              name={`device_conf_type_calib`}
              clickHandler={(e) => {
                setIsNewConfAlertOpen(true)
              }}
              label='Создать'
              type="button" />
          </div>
        </li>
        <AlertDialogWrap
          open={isNewConfAlertOpen}
          onClose={(e) => {
            setIsNewConfAlertOpen(false)
          }}
          title='предупреждение!'>
          Вы точно хотите создать новый файл конфигурации? В ходе создания нового файла все парамерты будут возвращены к базовым значениям!
          <div className="item_input">
          <FormInput
            id={`create_new_conf_input`}
            name={`create_new_conf`}
            clickHandler={(e) => {
              device_conf_create()
              setIsNewConfAlertOpen(false)
            }}
            label='Да'
            type="button" />
          <FormInput
            clickHandler={(e) => {
              setIsNewConfAlertOpen(false)
              
            }}
            label='Нет'
            type="button" />
          </div>
        </AlertDialogWrap>
        </>
        }
        <li
          key='conf_res_file_handle'
          id='conf_res_file_handle'
          className="settings_item nested_item"
          style={{height: "45px"}}>
          <div className='item_header'>
            <label
              htmlFor={`conf_res_file_handle_input`}
              className="settings_itemLabel">
              Рез. файл 
              (дата создания: <br /> {confCalibState.reserve_conf_create_time})
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`conf_res_file_restore_input`}
              name={`restore_res_conf`}
              clickHandler={handleClick_save}
              label='Восст.'
              type="button" />
            <FormInput
              id={`conf_res_file_create_input`}
              name={`create_new_res_conf`}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
          </div>
        </li>
        {auth_store.auth_access.calib_extend &&
        <li
          key='conf_factory_file_handle'
          id='conf_factory_file_handle'
          className="settings_item nested_item"
          style={{height: "45px"}}>
          <div className='item_header'>
            <label
              htmlFor={`conf_factory_file_handle_input`}
              className="settings_itemLabel">
              Зав. файл
              (дата создания: <br /> {confCalibState.factory_conf_create_time})
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`conf_factory_file_restore_input`}
              name={`restore_factory_conf`}
              clickHandler={handleClick_save}
              label='Восст.'
              type="button" />
            {auth_store.auth_access.calib_extend &&
              <FormInput
                id={`conf_factory_file_create_input`}
                name={`create_new_factory_conf`}
                clickHandler={handleClick_save}
                label='Сохранить'
                type="button" />
            }
          </div>
        </li>
        }
        <li className="group_divider" />
        
        {/* <li
          key='set_settings_as_factory'
          id='set_settings_as_factory'
          className="settings_item calib">
          <div className='item_header'>
            <label
              htmlFor={`set_settings_as_factory_input`}
              className="settings_itemLabel">
              Управление рез. файлом конф. <br />
              (Время создания посл. конф: )
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`create_new_res_conf_input`}
              name={`create_new_res_conf`}
              clickHandler={handleClick_save}
              label='Создать'
              type="button" />
            <FormInput
              id={`reserve_conf_reset_input`}
              name={`reserve_conf_reset`}
              clickHandler={handleClick_save}
              label='Восстановить из резерва'
              type="button" />
            <FormInput
              id={`save_as_factory_input`}
              name={`save_as_factory`}
              clickHandler={handleChange_save}
              label='Сохр. как завод.'
              type="button" />
          </div>
        </li> */}
      {/* <li className="group_divider" /> */}
      
      <li
        key='conf_file_manage'
        id='conf_file_manage'
        className="settings_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_file_manage_input`}
            className="settings_itemLabel">
            Управление файлом конфигурации
          </label>
        </div>
        <div className='item_input'>
          {/* <FormInput
            id={`conf_file_download_input`}
            name={`conf_file_download`}
            clickHandler={handleClick_save}
            label='Скачать'
            type="button" /> */}
          {/* <a
            className='button_input download_link'
            name={`conf_file_download`}
            href={`${conf_file_links.conf_file_download.address}`}>
            Скачать
          </a>
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_dropzone_ref}
            className={`button_input disabled_input`}
            disabled={true}
            type="button"
            value='Загрузить' /> */}
        </div>
      </li> 
      <li
        key='sys_conf_file_download_device'
        id='sys_conf_file_download_device'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_file_download_device_input`}
            className="settings_itemLabel">
            Системный
          </label>
        </div>
        <div className='item_input'>
          {/* <FormInput
            id={`conf_file_download_input`}
            name={`conf_file_download`}
            clickHandler={handleClick_save}
            label='Скачать'
            type="button" /> */}
          <a
            className='button_input download_link'
            name={`conf_file_download`}
            href={`${conf_file_links.conf_file_download.address}`}>
            Скачать
          </a>
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_dropzone_ref}
            className={`button_input disabled_input`}
            type="button"
            value='Загрузить' />
        </div>
      </li>
      <li
        key='user_conf_file_download_device'
        id='user_conf_file_download_device'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_file_download_device_input`}
            className="settings_itemLabel">
            Польз.
          </label>
        </div>
        <div className='item_input'>
          {/* <FormInput
            id={`conf_file_download_input`}
            name={`conf_file_download`}
            clickHandler={handleClick_save}
            label='Скачать'
            type="button" /> */}
          <a
            className='button_input download_link'
            name={`conf_user_file_download`}
            href={`${conf_file_links.conf_user_file_download.address}`}>
            Скачать
          </a>
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_second_dropzone_ref}
            className={`button_input disabled_input`}
            type="button"
            value='Загрузить' />
        </div>
      </li>
      {/* <li
        key='conf_file_upload'
        id='conf_file_upload'
        className="settings_item nested_item">
        <div className='item_header'>
          <label
            htmlFor={`conf_file_upload_input`}
            className="settings_itemLabel">
            Загрузить на устр.
          </label>
        </div>
        <div className='item_input'>
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_dropzone_ref}
            className={`button_input disabled_input`}
            disabled={true}
            type="button"
            value='Загрузить' />
        </div>
      </li> */}
    {isUploadModalOpen &&
      <ModalCalib
        header='загрузка конфигурации'
        setIsOpen={handleModalClose}
        user_controllable={true}
        class='full_log_modal hex_upload_modal'>
        <div className='hex_upload_message_wrap'>
          <PulseLoader
            color="#bbcacf"
            loading
            margin={9}
            size={13}
            speedMultiplier={0.5}
          />
          <div className='hex_upload_upload_progressage'>
            {uploadProgress.progress}%
          </div>
          <span className='hex_upload_upload_message'>
            Идет загрузка конфигурации... Пожалуйста, не перезагружайте страницу во время процесса.
          </span>
          <FormInput
            id={`cancel_conf_upload_input`}
            name={`cancel_conf_upload`}
            clickHandler={handleModalClose}
            label='Отменить загрузку'
            type="button" />
        </div>
      </ModalCalib>}
    </Settings_block_calib>
    
  )
}

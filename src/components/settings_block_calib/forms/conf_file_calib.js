import React from 'react';

import Settings_block_calib from '..';

import Dropzone from 'dropzone'
import { PulseLoader } from 'react-spinners';
import { ToastContainer, toast, Zoom } from 'react-toastify';

import ModalCalib from '../../calib_modal';
import FormInput from '../../form_input';

import useGlobalStore from '../../../logic/auth_store';

export const conf_file_links = {
  factory_reset: {
    address: 'calib_conf_file.cgi',
    data: 'factory_reset$1'
  },
  conf_file_download: {
    address: 'ReadFile.hex',
    data: 'confing_dev$1;confing_user$1'
  },
  create_new_conf: {
    address: 'super_admin_conf_file.cgi',
    data: 'create_new_conf$1'
  },
  set_settings_as_factory: {
    address: 'super_admin_conf_file.cgi',
    data: 'set_settings_as_factory$1'
  }
}

export default function ConfFileCalib(props) {
  const [authGlobalState, authGlobalActions] = useGlobalStore()

  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState({
    progress: 0
  });

  const hex_dropzone_ref = React.useRef(null)
  const hex_dropzone_instance = React.useRef(null)

  React.useEffect(() => {
    if (!hex_dropzone_instance.current) {
      hex_dropzone_instance.current = new Dropzone(hex_dropzone_ref.current, {
        url: '/conf_file_upload',
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

  return (
    <Settings_block_calib header={`файл конфигурации`}
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
            clickHandler={handleClick_save}
            label='Восстановить'
            type="button" />
          {/* <FormInput
            id={`save_as_factory_input`}
            name={`save_as_factory`}
            clickHandler={handleChange_save}
            label='Сохр. как завод.'
            type="button" /> */}
        </div>
      </li>
      {authGlobalState.auth_access.calib_extend &&
        <>
        <li
          key='create_new_conf'
          id='create_new_conf'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`tcreate_new_conf_input`}
              className="settings_itemLabel">
              Создать новый файл
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`create_new_conf_input`}
              name={`create_new_conf`}
              clickHandler={handleClick_save}
              label='Создать'
              type="button" />
          </div>
        </li>
        <li
          key='set_settings_as_factory'
          id='set_settings_as_factory'
          className="settings_item">
          <div className='item_header'>
            <label
              htmlFor={`set_settings_as_factory_input`}
              className="settings_itemLabel">
              Сохранить тек. настройки как дефолтные
            </label>
          </div>
          <div className='item_input'>
            <FormInput
              id={`set_settings_as_factory_input`}
              name={`set_settings_as_factory`}
              clickHandler={handleClick_save}
              label='Сохранить'
              type="button" />
            {/* <FormInput
              id={`save_as_factory_input`}
              name={`save_as_factory`}
              clickHandler={handleChange_save}
              label='Сохр. как завод.'
              type="button" /> */}
          </div>
        </li>
        </>
      }
      <li className="group_divider" />
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
          <a
            className='button_input download_link'
            name={`conf_file_download`}
            href={`${conf_file_links.conf_file_download.address}?${conf_file_links.conf_file_download.data}`}>
            Скачать
          </a>
          <input
            id="hex_upload_zone"
            name='file'
            ref={hex_dropzone_ref}
            className={`button_input`}
            type="button"
            value='Загрузить' />
        </div>
      </li>
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

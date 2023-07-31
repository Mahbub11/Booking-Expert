/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */

import { PlusOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input, InputNumber, Modal, Result, Select, Upload
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EF from '../../assets/data/extra-facilities.json';
import useFetchData from '../../hooks/useFetchData';
import { reFetchData } from '../../store/slice/appSlice';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import PageLoader from '../shared/PageLoader';

function EditBooking({ bookingEditModal, setBookingEditModal }) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // fetch room-details API data
  const [fetchLoading, fetchError, fetchResponse] = useFetchData(
    `/api/v1/get-all-booking-orders/${bookingEditModal.bookingId}`
  );
  const onFinish = (values) => {
    console.log(values);
    async function setStatus() {
      await axios.put(` http://localhost:7700/api/v1/set-status/${bookingEditModal.bookingId}`, { booking_status: values.booking_type });
    }
    setStatus();
  };

  return (
    <Modal
      title='Set Booking Status'
      open={bookingEditModal.open}
      onOk={() => setBookingEditModal(
        (prevState) => ({ ...prevState, open: false })
      )}
      onCancel={() => setBookingEditModal(
        (prevState) => ({ ...prevState, open: false })
      )}
      footer={[]}
      width={1200}
      centered
    >
      {fetchLoading ? (<PageLoader />) : fetchError ? (
        <Result
          title='Failed to fetch'
          subTitle={fetchError}
          status='error'
        />
      ) : (
        <Form
          form={form}
          className='login-form'
          name='room-edit-form'
          onFinish={onFinish}
          layout='vertical'
        >

          <Form.Item
            className='w-full md:w-1/2'
            label='Booking Status'
            name='booking_type'
            rules={[{
              required: true,
              message: 'Please input your Room Type!'
            }]}
          >
            <Select
              placeholder='-- select Status --'
              optionFilterProp='children'
              options={[
                { value: 'available', label: 'Available' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'booked', label: 'Booked' },
                { value: 'fullfilled', label: 'Full-Filled' }
              ]}
              size='large'
              allowClear
            />
          </Form.Item>
          <Form.Item>
            <Button
              className='login-form-button mt-4'
              htmlType='submit'
              type='primary'
              size='large'
              loading={loading}
              disabled={loading}
            >
              Update Status
            </Button>
          </Form.Item>

        </Form>
      )}
    </Modal>
  );
}

export default React.memo(EditBooking);

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Modal, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { roomStatusAsResponse, roomTypeAsColor } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import EditBooking from './EditBooking';
// import RoomEdit from './RoomEdit';

const { confirm } = Modal;

function BookingList({ add }) {
  const [query, setQuery] = useState({
    search: '', sort: 'asce', page: '1', rows: '10'
  });
  const [fetchAgain, setFetchAgain] = useState(false);
  const [bookingEditModal, setBookingEditModal] = useState(
    { open: false, bookingId: null }
  );

  // fetch room-list API data
  const [loading, error, response] = useFetchData('/api/v1/get-all-booking-orders', fetchAgain);
  console.log(response);

  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // function to handle delete
  const handleDeleteRoom = (id) => {
    confirm({
      title: 'DELETE ROOM',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure delete this Room permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.delete(`/api/v1/delete-room/${id}`)
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'Room delete successful');
                setFetchAgain(!fetchAgain);
                resolve();
              } else {
                notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
                reject();
              }
            })
            .catch((err) => {
              notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
              reject();
            });
        }).catch(() => notificationWithIcon('error', 'ERROR', 'Oops errors!'));
      }
    });
  };

  return (
    <div>
      {/* room list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* room list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Images
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Room Name
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Room Type
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Room Price
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booking Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booked By
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Contact No
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Room Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            <Avatar.Group>
                              {data.room?.room_images?.map((image) => (
                                <Avatar
                                  key={uniqueId()}
                                  src={image.url}
                                  crossOrigin='anonymous'
                                  size='large'
                                />
                              ))}
                            </Avatar.Group>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data.room?.room_name}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='text-center uppercase'
                              color={roomTypeAsColor(data?.room_type)}
                            >
                              {data.room?.room_type}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !lowercase'>
                            {`$ ${data.room?.room_price}`}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[80px] text-center uppercase'
                              color={roomStatusAsResponse(data.booking_status).color}
                            >
                              {roomStatusAsResponse(data.booking_status).level}
                            </Tag>
                          </td>

                          <td className='data-table-body-tr-td'>
                            {data.booking_by?.userName}
                          </td>

                          <td className='data-table-body-tr-td'>
                            {data.booking_by?.phone}
                          </td>

                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => add(data?.id)}
                              type='link'
                            >
                              View
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => setBookingEditModal(
                                (prevState) => ({ ...prevState, open: true, bookingId: data.id })
                              )}
                              type='link'
                            >
                              Edit
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => handleDeleteRoom(data?.id)}
                              type='link'
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Skeleton>
        )}
      </div>

      {/* room list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}

      {bookingEditModal.open && (
      <EditBooking
        bookingEditModal={bookingEditModal}
        setBookingEditModal={setBookingEditModal}
      />
      )}
    </div>
  );
}

export default React.memo(BookingList);

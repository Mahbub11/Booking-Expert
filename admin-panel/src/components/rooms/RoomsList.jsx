/* eslint-disable react/button-has-type */
/* eslint-disable no-sparse-arrays */
/* eslint-disable no-unused-vars */

import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Input, Modal, Pagination, Result, Skeleton, Table, Tag, Typography
} from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { roomStatusAsResponse, roomTypeAsColor } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import RoomEdit from './RoomEdit';

const { confirm } = Modal;

function RoomsList({ add }) {
  const [query, setQuery] = useState({
    search: '', sort: 'asce', page: '1', rows: '10'
  });
  const [roomEditModal, setRoomEditModal] = useState(
    { open: false, roomId: null }
  );
  const [fetchAgain, setFetchAgain] = useState(false);
  const [response, setResponse] = useState();

  // fetch room-list API data
  // const [loading, error, response] = useFetchData(' http://localhost:7700/api/v1/all-rooms-list', fetchAgain);

  // console.log(response);
  useEffect(() => {
    async function fetchData() {
      await axios.get('http://localhost:7700/api/v1/all-rooms-list').then((responseJson) => {
        const results = responseJson.data.result.data.rows.map((row) => ({
          key: row.id, // I added this line
          // room_images: row.room_images,
          room_name: row.room_name,
          room_type: row.room_type,
          roomPrice: `$ ${row.room_price}`,
          roomSize: `${row.room_size} Sq Feet`,
          roomStatus: row.room_status,
          Id: row.id,
          roomActions: row.id
        }));
        setResponse(results);
      });
    }
    fetchData();
  }, []);

  console.log(response);
  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // row filtering
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        }
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        }
      }
    ]
  };
  const [searchText, setSearchText] = useState();
  const columns = [
    {
      title: 'Images',
      dataIndex: 'room_images'
    },
    {
      title: 'Room Name',
      dataIndex: 'room_name',
      filteredValue: [searchText || 'where the key is '],
      onFilter: (value, record) => String(record.room_name)
        .toLowerCase()
        .includes(value.toLowerCase())
    },,

    {
      title: 'Room Type',
      dataIndex: 'room_type'
    },
    {
      title: 'Room Price',
      dataIndex: 'roomPrice'
    },,
    {
      title: 'Room Size',
      dataIndex: 'roomSize'
    },,
    {
      title: 'Room Status',
      dataIndex: 'roomStatus',
      render: (text) => (
        <span style={{ color: roomStatusAsResponse(text).color }}>
          {roomStatusAsResponse(text).level}
        </span>
      ),
      filters: [
        {
          text: 'available',
          value: 'available'
        },
        {
          text: 'unavailable',
          value: 'unavailable'
        },
        {
          text: 'booked',
          value: 'booked'
        },
        {
          text: 'fullfilled',
          value: 'fullfilled'
        }
      ],
      onFilter: (value, record) => record.roomStatus.indexOf(value) === 0
    },
    {
      title: 'Room Actions',
      dataIndex: 'roomActions',
      render: (text, record) => (
        <>
          <button className='p-2 hover:rounded-md hover:bg-gray-400 hover:p-1 hover:text-md' onClick={() => add(record.Id)}>
            View
          </button>
          <button
            className='p-2 hover:rounded-md hover:bg-gray-400 hover:p-1 hover:text-md'
            onClick={() => setRoomEditModal((prevState) => ({
              ...prevState, open: true, roomId: record.Id
            }))}
          >
            Edit
            {' '}

          </button>
          <button className='p-2 hover:rounded-md hover:bg-gray-400 hover:p-1 hover:text-md' onClick={() => add(record.Id)}>
            Delete
          </button>
        </>

      )
    }
  ];

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
      {/* <QueryOptions query={query} setQuery={setQuery} /> */}

      {/* room list ― content section */}
      <div className='w-full'>
        {false ? (
          <Result
            title='Failed to fetch'
            // subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={false} paragraph={{ rows: 10 }} active>
            {response?.length === 0 ? (
              <Empty
                className='mt-10'
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <>
                <Input.Search
                  placeholder='Search Room'
                  onSearch={(value) => {
                    setSearchText(value);
                  }}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
                <Table rowSelection={rowSelection} columns={columns} dataSource={response} />
              </>

            // <div className='table-layout'>
            //   <div className='table-layout-container'>
            //     <table className='data-table'>
            //       {/* data table ― head */}
            //       <thead className='data-table-head'>
            //         <tr className='data-table-head-tr'>
            //           <th className='data-table-head-tr-th' scope='col'>
            //             Images
            //           </th>
            //           <th className='data-table-head-tr-th' scope='col'>
            //             Room Name
            //           </th>
            //           <th className='data-table-head-tr-th text-center' scope='col'>
            //             Room Type
            //           </th>
            //           <th className='data-table-head-tr-th' scope='col'>
            //             Room Price
            //           </th>
            //           <th className='data-table-head-tr-th' scope='col'>
            //             Room Size
            //           </th>
            //           <th className='data-table-head-tr-th text-center' scope='col'>
            //             Room Status
            //           </th>
            //           <th className='data-table-head-tr-th text-center' scope='col'>
            //             Room Actions
            //           </th>
            //         </tr>
            //       </thead>

            //       {/* data table ― body */}
            //       <tbody>
            //         {response?.data?.rows?.map((data) => (
            //           <tr className='data-table-body-tr' key={uniqueId()}>
            //             <td className='data-table-body-tr-td'>
            //               <Avatar.Group>
            //                 {data?.room_images?.map((image) => (
            //                   <Avatar
            //                     key={uniqueId()}
            //                     src={image.url}
            //                     crossOrigin='anonymous'
            //                     size='large'
            //                   />
            //                 ))}
            //               </Avatar.Group>
            //             </td>
            //             <td className='data-table-body-tr-td'>
            //               {data?.room_name}
            //             </td>
            //             <td className='data-table-body-tr-td text-center'>
            //               <Tag
            //                 className='text-center uppercase'
            //                 color={roomTypeAsColor(data?.room_type)}
            //               >
            //                 {data?.room_type}
            //               </Tag>
            //             </td>
            //             <td className='data-table-body-tr-td !lowercase'>
            //               {`$ ${data?.room_price}`}
            //             </td>
            //             <td className='data-table-body-tr-td'>
            //               {`${data?.room_size} sq. ft.`}
            //             </td>
            //             <td className='data-table-body-tr-td text-center'>
            //               <Tag
            //                 className='w-[80px] text-center uppercase'
            //                 color={roomStatusAsResponse(data?.room_status).color}
            //               >
            //                 {roomStatusAsResponse(data?.room_status).level}
            //               </Tag>
            //             </td>
            //             <td className='data-table-body-tr-td !px-0 text-center'>
            //               <Button
            //                 className='inline-flex items-center !px-2'
            //                 onClick={() => add(data?.id)}
            //                 type='link'
            //               >
            //                 View
            //               </Button>
            //               <Button
            //                 className='inline-flex items-center !px-2'
            //                 onClick={() => setRoomEditModal(
            //                   (prevState) => ({ ...prevState, open: true, roomId: data?.id })
            //                 )}
            //                 type='link'
            //               >
            //                 Edit
            //               </Button>
            //               <Button
            //                 className='inline-flex items-center !px-2'
            //                 onClick={() => handleDeleteRoom(data?.id)}
            //                 type='link'
            //               >
            //                 Delete
            //               </Button>
            //             </td>
            //           </tr>
            //         ))}
            //       </tbody>
            //     </table>
            //   </div>
            //     </div>
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

      {/* room edit modal component */}
      {roomEditModal.open && (
        <RoomEdit
          roomEditModal={roomEditModal}
          setRoomEditModal={setRoomEditModal}
        />
      )}
    </div>
  );
}

export default React.memo(RoomsList);

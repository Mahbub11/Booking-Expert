/* eslint-disable indent */

import {
    Descriptions, Image, List, Result, Skeleton, Tag, Typography
  } from 'antd';
  import React from 'react';
  import { v4 as uniqueId } from 'uuid';
  import useFetchData from '../../hooks/useFetchData';
  import { roomStatusAsResponse, roomTypeAsColor } from '../../utils/responseAsStatus';

  function RoomDetails({ id }) {
    // fetch room-details API data
    const [loading, error, response] = useFetchData(`/api/v1/get-all-booking-orders/${id}`);
    console.log(response);

    return (
      <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <div>
            <Descriptions
              title='Guest Information'
              bordered
            >
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Name</span>}
                span={2}
              >
                {response?.data.bookingDetail?.booking_by
                 .fullName}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Contact No</span>}
                span={2}
              >
                {response?.data.bookingDetail?.booking_by
                 .phone}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Address</span>}
                span={2}
              >
                {response?.data.bookingDetail?.booking_by
                 .address}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Bookings</span>}
                span={2}
              >
                {`${new Date(response?.data.bookingDetail?.booking_dates[0]).toDateString()}
              -- ${new Date(response?.data.bookingDetail?.booking_dates[1]).toDateString()}`}
              </Descriptions.Item>

            </Descriptions>

            <Descriptions
              title='Room Information'
              bordered
            >
              <Descriptions.Item label='Images' span={3}>
                <Image.PreviewGroup>
                  {response?.data?.bookingDetail?.room_images?.map((image) => (
                    <Image
                      key={uniqueId()}
                      className='p-2'
                      src={image?.url}
                      crossOrigin='anonymous'
                      alt='user-image'
                      width={120}
                      height={100}
                    />
                ))}
                </Image.PreviewGroup>
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Name</span>}
              >
                {response?.data.bookingDetail?.room_id.room_name}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Slug</span>}
                span={2}
              >
                {response?.data.bookingDetail.room_id?.room_slug}
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Descriptions</span>}
              >
                <Tag
                  className='text-center uppercase'
                  color={roomTypeAsColor(response?.data?.room_type)}
                >
                  {response?.data.bookingDetail.room_id?.room_type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Price</span>}
                span={2}
              >
                {`$ ${response?.data.bookingDetail.room_id?.room_price}`}
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Size</span>}
              >
                {`${response?.data.bookingDetail.room_id?.room_size} sq. ft.`}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Capacity</span>}
                span={2}
              >
                {`${response?.data.bookingDetail.room_id?.room_capacity} Person`}
              </Descriptions.Item>

              <Descriptions.Item label={<span className='whitespace-nowrap'>Allow Pets</span>}>
                <Tag
                  className='w-[60px] text-center uppercase'
                  color={response?.data?.allow_pets ? 'success' : 'error'}
                >
                  {response?.data.bookingDetail.room_id?.allow_pets ? 'YES' : 'NO'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Provided Breakfast</span>}
                span={2}
              >
                <Tag
                  className='w-[60px] text-center uppercase'
                  color={response?.data?.provide_breakfast ? 'success' : 'error'}
                >
                  {response?.data.bookingDetail.room_id?.provide_breakfast ? 'YES' : 'NO'}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Featured Room</span>}
              >
                <Tag
                  className='w-[60px] text-center uppercase'
                  color={response?.data.bookingDetail.room_id?.featured_room ? 'success' : 'error'}
                >
                  {response?.data.bookingDetail.room_id?.featured_room ? 'YES' : 'NO'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Status</span>}
                span={2}
              >
                <Tag
                  className='w-[80px] text-center uppercase'
                  color={roomStatusAsResponse(response?.data?.room_status).color}
                >
                  {roomStatusAsResponse(response?.data.bookingDetail.room_id?.room_status).level}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Last Update At</span>}
              >
                {response?.data.bookingDetail.room_id?.updatedAt?.split('T')[0]}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Created At</span>}
                span={2}
              >
                {response?.data.bookingDetail.room_id?.createdAt?.split('T')[0]}
              </Descriptions.Item>

              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Room Descriptions</span>}
                span={3}
              >
                {response?.data?.room_description}
              </Descriptions.Item>
              <Descriptions.Item
                label={<span className='whitespace-nowrap'>Extra Facilities</span>}
                span={3}
              >
                <List
                  bordered
                  dataSource={response?.data?.extra_facilities}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text>{item}</Typography.Text>
                    </List.Item>
                )}
                />
              </Descriptions.Item>
            </Descriptions>
          </div>

        )}
      </Skeleton>
    );
  }

  export default React.memo(RoomDetails);

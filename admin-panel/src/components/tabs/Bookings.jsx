/* eslint-disable no-unused-vars */
// import { AppstoreAddOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import BookingDetails from '../booking/BookingDetails';
import BookingList from '../booking/BookingList';
import EditBooking from '../booking/EditBooking';
// import RoomDetails from '../rooms/RoomDetails';
// import RoomsList from '../rooms/RoomsList';

function Bookings() {
  // function to create new tab pane for room details
  const add = (id) => {
    const newActiveKey = `NewTab1${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        key: newActiveKey,
        label: 'Booking Details',
        children: <BookingDetails id={id} />
      }
    ]);
    setActiveKey(newActiveKey);
  };
  const add2 = (id) => {
    const newActiveKey = `NewTab2${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        key: newActiveKey,
        label: 'Edit Booking',
        children: <EditBooking id={id} />
      }
    ]);
    setActiveKey(newActiveKey);
  };

  // default tab pane and component
  const defaultPanes = new Array(1).fill(null).map((_, index) => ({
    key: String(index + 1),
    label: 'Booking List',
    children: <BookingList add={add} add2={add2} />,
    closable: false
  }));

  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  // function to removed a tab pane
  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  // function to edit tab components
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      onChange={(key) => setActiveKey(key)}
      activeKey={activeKey}
      type='editable-card'
      onEdit={onEdit}
      items={items}
      size='large'
      hideAdd
    />
  );
}

export default React.memo(Bookings);

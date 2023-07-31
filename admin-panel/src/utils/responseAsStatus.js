export const userStatusAsResponse = (status) => {
  if (status === 'register') {
    return {
      color: '#108ee9',
      level: 'REGISTER'
    };
  }
  if (status === 'login') {
    return {
      color: '#87d068',
      level: 'LOGIN'
    };
  }
  if (status === 'logout') {
    return {
      color: '#2db7f5',
      level: 'LOGOUT'
    };
  }
  if (status === 'blocked') {
    return {
      color: '#f55000',
      level: 'BLOCKED'
    };
  }
  return {
    color: 'default',
    level: 'UNKNOWN'
  };
};

export const roomStatusAsResponse = (status) => {
  if (status === 'available') {
    return {
      color: '#87d068',
      level: 'AVAILABLE'
    };
  }
  if (status === 'unavailable') {
    return {
      color: '#f55000',
      level: 'UNAVAILABLE'
    };
  }
  if (status === 'booked') {
    return {
      color: '#2db7f5',
      level: 'BOOKED'
    };
  }
  if (status === 'fullfilled') {
    return {
      color: '#2769',
      level: 'FULL-FILLED'
    };
  }
  if (status === 'pending') {
    return {
      color: '#F56',
      level: 'Pending'
    };
  }
  if (status === 'rejected') {
    return {
      color: '#E657',
      level: 'Rejected'
    };
  }
  return {
    color: 'default',
    level: 'UNKNOWN'
  };
};

export const roomTypeAsColor = (type) => {
  if (type === 'single') {
    return 'purple';
  }
  if (type === 'couple') {
    return 'magenta';
  }
  if (type === 'family') {
    return 'volcano';
  }
  if (type === 'presidential') {
    return 'geekblue';
  }
  return 'default';
};

import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import styles from '../common.module.css';
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';

import MainHome from './mainHome'
import Rooms from './rooms'
import Payment from './payment'
import Request from './request'
 
import LandHome from './landHome'
import RequestList from './requestList'

function MainInfo({ userInfo, userType }) {
  const { state: { contract, accounts } } = useEth();
  const [type, setType] = React.useState(1);
  const [hasRent, setHasRent] = React.useState(false);
  const [roomId, setRoomId] = React.useState(1);

  const [rentInfo, setRentInfo] = React.useState({});

  useEffect(() => {
    // userInfo.createTime = formatDate(userInfo.createTime)
    if(userType==2){
      setType(5)
    }
  }, [contract,userInfo]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp*1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const changeType = (type) => {
    setType(type)
  };

  const renderComponent = () => {
      switch (type) {
        case 1:
          return <MainHome chufa={() => setHasRent(true)} setRentInfo={setRentInfo} rentInfo={rentInfo} changeType={changeType} info={userInfo} />;
        case 2:
          return <Rooms userType={userType} info={userInfo} rentInfo={rentInfo} />;
        case 3:
          return <Payment info={userInfo}  rentInfo={rentInfo} />;
        case 4:
          return <Request userInfo={userInfo} rentInfo={rentInfo} />;
        case 5:
          return <LandHome userInfo={userInfo}  />;
        case 6:
          return <RequestList userInfo={userInfo}  />; 
        default:
          return <div>Default Component</div>;
    }
  }
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="profile-section">
          <div className="profile-image">{userInfo.name}</div>
          <div className="profile-info" >
            <div>Your ID: {userInfo.tenantId}</div>
            <div>email: {userInfo.email}</div>
            <div>phone: {userInfo.phone}</div>
            <div>createTime: {formatDate(userInfo.createTime)}</div>
          </div>
        </div>
        <nav>
          {userType==1 ? <ul>
            <li onClick={() => changeType(1)}>Dashboard</li>
            {!hasRent ? <li onClick={() => changeType(2)}>Bookings</li> : null}
            {hasRent&&rentInfo.nextTime<=rentInfo.endTime ? <li onClick={() => changeType(3)}>Payments</li> : null}
            {hasRent ? <li onClick={() => changeType(4)}>Request</li> : null}
          </ul> : null}
          {userType==2 ? <ul>
            <li onClick={() => changeType(5)}>Dashboard</li>
            <li onClick={() => changeType(2)}>my rooms</li>
            <li onClick={() => changeType(6)}>request</li>
          </ul> : null}
        </nav>
      </aside>
      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  );
}

export default MainInfo;

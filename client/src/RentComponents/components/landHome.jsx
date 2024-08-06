import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';

function LandHome({ userInfo }) {
  const { state: { contract, accounts } } = useEth();
  const [roomSum, setRoomSum] = React.useState(0);
  const [roomSumA, setRoomSumA] = React.useState(0);

  useEffect(() => {
    const init = async () => {
      const commonArr = await contract.methods.getAllRooms().call();
      let a=0;
      let b=0;
      for(let i=0;i<commonArr.length;i++){
        if(commonArr[i].isAvailable==false){
          b++
        }
        a++
      }
      setRoomSum(a)
      setRoomSumA(b)
    };

    if(contract){
      init();
    }

  }, [contract]);

  const updateTasks = async () => {
    // const curdate = Date.now() + 2419200*1000;
    const curdate = Date.now();
    await contract.methods.dailyAction(curdate).send({ from: accounts[0],gas:300000 });
    alert('update successful')
    window.location.reload()
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp*1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="common-box">
      <h1>Dashboard</h1>
        <div className="content">
          <div className="right-panel">
            <div className="card">
              <h2>hello, {userInfo.name} !</h2>
              <div className="c-info">your have <b>{roomSum}</b> rooms, and <b>{roomSumA}</b> rooms have been rented</div>
              <div className="he1"><button onClick={() => updateTasks()}>executiving daily tasks</button></div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default LandHome;

// src/components/RoomCard.js
import React from 'react';
import './RoomCard.css';
import useEth from "../../contexts/EthContext/useEth";

const RoomCard = ({ room, boolRoom,userType }) => {
  const { state: { contract, accounts } } = useEth();

  const changeType = async (room1,type) => {
    //const curdate = Date.now() + 2419200*1000;
    let state = true
    if(type==1){
      state=false
    } else {
      state=true
    }
    await contract.methods.updateRoomState(room1.roomId, state).send({ from: accounts[0],gas:300000 });
    alert('update successful')
    window.location.reload()
  };
  return (
    <div className="room-card">
      { room.isAvailable ? null :  <div className="stamp1">Not available!</div> }
      <img src="https://via.placeholder.com/400x200" alt="Room" />
      <p>Address:{}</p>
      <p>Block:{room.location}</p>
      <p>Room type:{room.roomType}</p>
      <p>Price: £125.00 per week</p>
      { (room.isAvailable && userType==1) ? <button onClick={() => boolRoom(room)} >book the room</button> : null }
      { userType==2 ? <div><button onClick={() => changeType(room,1)} >close</button> <br /><button className="ml" onClick={() => changeType(room,2)} >open</button></div> : null}
    </div>
  );
};

export default RoomCard;
import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';
import RoomCard from './RoomCard';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './RoomCard.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Rooms = ({ info,userType }) => {
  const [rooms, setRooms] = useState([]);
  const { state: { contract, accounts } } = useEth();
  //model
  const [show, setShow] = useState(false);
  const [rentInfo, setRentInfo] = useState({});
  const [step, setStep] = useState('f1');
  const [curRoom, setCurroom] = useState({});
  const [date, setDate] = useState(null);


  useEffect(() => {
    const init = async () => {
      const commonArr = await contract.methods.getAllRooms().call();
      setRooms(commonArr)
    };

    if(contract){
      init();
    }

  }, [contract]);

  const convertToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.getTime();
  };
  const boolRoom = async () => {
    console.log(accounts)
    const description1 = curRoom.addressInfo+' ' + curRoom.location
    console.log('d33',info.tenantId*1, curRoom.roomId*1, convertToTimestamp(curRoom.createTime), convertToTimestamp(curRoom.endTime), convertToTimestamp(curRoom.nextTime), curRoom.nextPay+'', curRoom.payTotal+'', description1)
    try {
        await contract.methods.rentRoom(info.tenantId*1, curRoom.roomId*1, convertToTimestamp(curRoom.createTime), convertToTimestamp(curRoom.endTime), convertToTimestamp(curRoom.nextTime), curRoom.nextPay+'', curRoom.payTotal+'', description1).send({ from: accounts[0]});
        alert('book successful')
        window.location.reload()
    } catch (error) {
        console.error('Transaction failed', error);
        console.error(`Error code: ${error.code}`);
        console.error(`Error message: ${error.message}`);
    }
   
  };

  useEffect(() => {
    // 获取当前日期
    const currentDate = new Date();
    // 格式化日期为 yyyy-mm-dd
    const formattedDate = currentDate.toISOString().split('T')[0];
    const hda = addDays(formattedDate, 28)
    setDate(hda);
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return formatDate(date);
  };


  const handleClose = () => setShow(false);

  const handleShow = (broom1) => {
    const broom = { ...broom1 };
    broom.createTime = new Date().toISOString().split('T')[0];
    broom.nextTime = addDays(broom.createTime, 28);
    broom.endTime = addDays(broom.createTime, 28);
    broom.nextPay = 500;
    broom.payTotal = 500;
    console.log(broom)
    setCurroom(broom);
    setShow(true);
  }

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const inday = calculateDaysBetweenDates(curRoom.createTime,selectedDate);
    const payTotal1 = (inday/7)*125;
    let nextpay1 = 0;
    if(payTotal1>=500){
      nextpay1 = 500
    } else {
      nextpay1 = payTotal1
    }
    setCurroom(prevInfo => ({
        ...prevInfo,
        endTime:selectedDate,
        nextPay:nextpay1,
        payTotal:payTotal1
    }));

    setDate(selectedDate);
  };
  
  const toStep = async (type) => {
    if(type==1){
      setStep('f1');
    } else if(type==2){
      setStep('f2');
    } else {
      boolRoom()
    }
  };
  const renderContent = {
    f1: () => <div className="t-div" >
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Price: <div className="emphasize">£125.00 per week</div></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>address: <div className="emphasize">{curRoom.addressInfo}</div></Form.Label>
                </Form.Group>
                 <Form.Group className="mb-3">
                  <Form.Label>Room type: <div className="emphasize">{curRoom.roomType}</div></Form.Label>
                </Form.Group>
                 <Form.Group className="mb-3">
                  <Form.Label>block: <div className="emphasize">{curRoom.location}</div></Form.Label>
                </Form.Group>
                 <Form.Group className="mb-3">
                  <Form.Label>Payment type: <div className="emphasize">4 weeks</div></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Check In Date:<div className="emphasize">{curRoom.createTime}</div></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>please choice your Check Out Date：</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    lang="en"
                    step="28"
                    min={date}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>payAll:<div className="emphasize">£{curRoom.payTotal}</div></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>next payment date:<div className="emphasize">{curRoom.nextTime}</div></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>next payment: <div className="emphasize">£{curRoom.nextPay}</div></Form.Label>
                </Form.Group>
              </Form>
            </div>,
    f2: () => <div style={{height:'100%',width:'100%'}}>
        <div className="t-title">Property Details</div>
            <div className="t-content">
              - **Address of the Property**: [Full Address of the Rented Property]<br />
              - **Description of the Property**: [Description of the Property, e.g., "2-bedroom flat on the 3rd floor"]
            </div>
            <div className="t-title">Tenancy Term</div>
            <div className="t-content">
              - **Start Date**: [DD/MM/YYYY]<br />
              - **End Date**: [DD/MM/YYYY] (if a fixed-term tenancy)<br />
              - **Type of Tenancy**: [Assured Shorthold Tenancy (AST) / Periodic Tenancy]
            </div>
            <div className="t-title">Maintenance and Repairs</div>
            <div className="t-content">
              - **Landlord's Responsibilities**:<br />
              - Ensure the property is in good repair at the start of the tenancy.<br />
              - Maintain the structure and exterior of the property.<br />
              - Ensure that gas, electricity, and water supplies are safe and in working order.<br />
              <br />
            - **Tenant's Responsibilities**:<br />
              - Keep the property in good condition and use it responsibly.<br />
              - Promptly report any issues or damages to the landlord.<br />
              - Allow the landlord or their representatives reasonable access to the property for inspections or repairs, with at least 24 hours' notice.
            </div>
            <div className="t-title">Tenant's Obligations</div>
            <div className="t-content">
              Tenant's Obligations
            </div>
            <div className="t-title">Landlord's Obligations</div>
            <div className="t-content">
              Landlord's Obligations
            </div>
            <div className="t-title"> Additional Clauses</div>
            <div className="t-content">
              Additional Clauses
            </div>
            <div className="t-title"> Additional Clauses</div>
            <div className="t-content">
                the landlord have agreed the aggreement.
                Now only you agree those terms
            </div>
    </div>,
  };

  const calculateDaysBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in milliseconds
    const differenceInTime = end.getTime() - start.getTime();
    
    // Convert milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    return differenceInDays;
  };

   // code
  const [formValues, setFormValues] = useState({
    rent: '',
    roomType: '',
    location: '',
    description: '',
    addressInfo: ''
  });

  // 通用的处理输入变化的函数
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value, // 使用输入字段的name属性来更新对应的值
    });
  };
  const addRoom = async () => {
    await contract.methods.addRoom(formValues.rent*1, formValues.roomType, formValues.addressInfo, formValues.location, formValues.description).send({ from: accounts[0]});
    alert('add room successful')
    window.location.reload()
  };

  return (
    <div className="common-box">
      <Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Tenancy Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{height:'400px',overflow:'auto'}}>
            {renderContent[step]()}
        </Modal.Body>
        <Modal.Footer>
        {step=='f1' ? <Button size="lg"  variant="primary" onClick={() => toStep(2)}>
            Next Step
          </Button> : null }
        {
          step=='f2' ? <Button size="lg"  variant="primary" onClick={() => toStep(1)}>
            back
          </Button> : null
        }
        {
          step=='f2' ? <Button size="lg"  variant="primary" onClick={() => toStep(3)}>
            agreed
          </Button> : null
        }  
          
        </Modal.Footer>
      </Modal>
      <div className="content1">
                
                <div className="left-panel">
                  {rooms.map(room => (
                    <RoomCard userType={userType} key={room.roomId} boolRoom={handleShow} room={room} />
                  ))}
                  <div className="room-card">
                    <img src="https://via.placeholder.com/400x200" alt="Room" />
                    <p>Address:<input
                      type="text"
                      name="addressInfo"
                      value={formValues.addressInfo}
                      onChange={handleInputChange}
                    /></p>
                          <p>Block:<input
                      type="text"
                      name="location"
                      value={formValues.location}
                      onChange={handleInputChange}
                    /></p>
                          <p>Room type:<input
                      type="text"
                      name="roomType"
                      value={formValues.roomType}
                      onChange={handleInputChange}
                    /></p>
                          <p>description:<input
                      type="text"
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                    /></p>
                          <p>Price: £<input
                      type="text"
                      name="rent"
                      value={formValues.rent}
                      onChange={handleInputChange}
                    /> per week</p>
                    <Button size="lg"  type="primary" onClick={() => addRoom()}>
                      addRoom
                    </Button> 
                  </div>
                </div>
        </div>
    </div>
  );
};

export default Rooms;
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import useEth from "../../contexts/EthContext/useEth";
const Request = ( {userInfo, rentInfo} ) => {
  const { state: { contract, accounts } } = useEth();
  const [formData, setFormData] = useState({
    category: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formContainerStyle = {
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '20px'
  };

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    height: '300px'
  };

  const toSubmit = async () => {
    console.log('Form submitted:', formData,userInfo.tenantId,rentInfo.roomId);
    await contract.methods.creatRequest(rentInfo.description, userInfo.tenantId*1, formData.category, formData.description, Date.now()).send({ from: accounts[0] });
    alert('submit successful!')
  };

  return (
    <div style={formContainerStyle}>
      <div style={formGroupStyle}>
        <label htmlFor="category" style={labelStyle}>Category</label>
        <input 
          type="text" 
          id="category" 
          name="category" 
          placeholder="Please enter a Category" 
          value={formData.category} 
          onChange={handleChange} 
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="description" style={labelStyle}>Enter full description</label>
        <textarea 
          id="description" 
          name="description" 
          placeholder="Enter full description" 
          value={formData.description} 
          onChange={handleChange} 
          style={textareaStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <Button onClick={() => toSubmit()} size="lg">Submit</Button>
      </div>
    </div>
  );
};

export default Request;
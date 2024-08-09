import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import './mainHome.css';
import styles from '../common.module.css';
import MainInfo from './mainInfo';
import Modal from 'react-bootstrap/Modal';
function Login() {
  const { state: { contract, accounts } } = useEth();
  const [isLogin, setLogin] = React.useState(false);
  const [rentAll, setRent] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});

  const [userType, setUserType] = React.useState(1);
  const [agreementArr, setAgreementArr] = React.useState([])
  useEffect(() => {
    const init = async () => {
      const registerInfo = await contract.methods.hasRegister(accounts[0]).call();
      const uType = await contract.methods.judgeAdType(accounts[0]).call();
      const lAgreementArr = await contract.methods.getAgreementTermsforlord().call({
            from: accounts[0],
      });
      setUserType(uType)
      setAgreementArr(lAgreementArr)
      console.log('Register info',uType, registerInfo,lAgreementArr)
      if(registerInfo.tenantId!=0){
        setLogin(true)
      } else {
        setLogin(false)
      }
      setUserInfo(registerInfo)
    };
    if(contract){
      init();
    }

  }, [contract]);

  
  // const handleEncrypt = () => {
  //   const secretKey = formValues.name+accounts[0];
  //   const ciphertext = CryptoJS.AES.encrypt(formValues.passport, secretKey).toString();
  //   setEncryptedText(ciphertext);
  // };

  // const handleDecrypt = () => {
  //   const secretKey = formValues.name+accounts[0];
  //   const bytes = CryptoJS.AES.decrypt(formValues.passport, secretKey);
  //   const originalText = bytes.toString(CryptoJS.enc.Utf8);
  //   setDecryptedText(originalText);
  // };

  // code
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
    phone: '',
    nationality: '',
    passport: ''
  });
  const validateEmail = (email) => {
    // 简单的 email 验证正则表达式
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    // 简单的 phone 验证正则表达式
    const re = /^\+?[1-9]\d{1,14}$/; // E.164 国际号码格式
    return re.test(String(phone));
  };

  const validateForm = () => {
    const { email, name, phone, nationality, passport } = formValues;

    if (!validateEmail(email)) return false;
    if (!validatePhone(phone)) return false;
    
    // 其他字段简单验证为空
    if (!name || !nationality || !passport) return false;

    return true;
  };
  // 通用的处理输入变化的函数
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value, // 使用输入字段的name属性来更新对应的值
    });
  };
  const getCurdata = () => {
     // 获取当前日期
    const currentDate = new Date();
    // 格式化日期为 yyyy-mm-dd
    const formattedDate = currentDate.toISOString().split('T')[0];
    return formattedDate
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted:', formValues);
    if (!validateForm()) {
      alert("you need to enter every information correctly!");
      // 提交表单
      return
    } 
    if(!isChecked&&userType==2){
      alert('you need to agree with the agreement firstly!')
      return
    }
    const curdate = Date.now();
    await contract.methods.addTenant(accounts[0],curdate, formValues.name, formValues.email, formValues.phone, formValues.nationality, formValues.passport).send({ from: accounts[0] });
    // setLogin(true)
    window.location.reload()
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isChecked, setIsChecked] = useState(false);

  // 事件处理函数，当复选框状态改变时调用
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  return (
    <div className="common-login" >
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>TENANCY AGREEMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='agree-box'>
          {agreementArr.map( (item, key) => (
                <div key={key} className='agree-list'>
                  {item}
                </div>
              ))}
          </div>
        </Modal.Body>
      </Modal>
      {
        (
        isLogin ? <MainInfo userInfo={userInfo} userType={userType}></MainInfo> : 
        <div className={styles.loginContainer}>
          <h2>{userType==1 ? 'Rigester' : 'Rigester to Activate'}</h2>
          <form onSubmit={handleSubmit}>
           <div className={styles.formGroup}>
              <label htmlFor="name">name *</label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email *</label>
               <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Phone *</label>
               <input
                type="number"
                name="phone"
                value={formValues.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">nationality *</label>
               <input
                type="text"
                name="nationality"
                value={formValues.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">passport *</label>
               <input
                type="text"
                name="passport"
                value={formValues.passport}
                onChange={handleInputChange}
              />
            </div>
            {userType==2 ? 
              <div className="aggree-box"><b className="agreeText" onClick={()=>handleShow()}>* agree with the agreement before you submit</b>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            </div> : null
            }
            <Button type="submit" size="lg">Submit</Button>
          </form>
        </div>
        )
      }
      
    </div>
    
  );
}

export default Login;

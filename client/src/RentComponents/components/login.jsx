import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import styles from '../common.module.css';
import MainInfo from './mainInfo';

function Login() {
  const { state: { contract, accounts } } = useEth();
  const [isLogin, setLogin] = React.useState(false);
  const [rentAll, setRent] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});

  const [userType, setUserType] = React.useState(1);
  useEffect(() => {
    const init = async () => {
      const registerInfo = await contract.methods.hasRegister(accounts[0]).call();
      console.log('Register info',registerInfo)
      if(registerInfo.tenantId!=0){
        setLogin(true)
      } else {
        setLogin(false)
      }
      setUserInfo(registerInfo)
    };

    if(contract){
      console.log(accounts[0])
      if(accounts[0]=='0x4B32AE490B3e7904688b0c0A09dFD67794cE2349'){
        setUserType(2)
      } else {
        setUserType(1)
      }
      init();
    }

  }, [contract]);


  // code
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
    phone: '',
    nationality: '',
    passport: ''
  });

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
    const curdate = Date.now();
    await contract.methods.addTenant(accounts[0],curdate, formValues.name, formValues.email, formValues.phone, formValues.nationality, formValues.passport).send({ from: accounts[0] });
    setLogin(true)
  };


  return (
    <div className="common-login" >
      {
        (
        isLogin ? <MainInfo userInfo={userInfo} userType={userType}></MainInfo> : 
        <div className={styles.loginContainer}>
          <h2>Rigester</h2>
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
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Phone *</label>
               <input
                type="text"
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
            <Button type="submit" size="lg">Submit</Button>
          </form>
        </div>
        )
      }
      
    </div>
    
  );
}

export default Login;

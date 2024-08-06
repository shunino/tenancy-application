import React, { useReducer, useCallback, useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button } from 'react-bootstrap';
import web3 from "web3";
import styles from '../common.module.css';
import Alert from 'react-bootstrap/Alert';

function Login({rentInfo}) {
  const { state: { contract, accounts } } = useEth();

  useEffect(() => {
    if(contract){
      // 监听 RentPaid 事件
      contract.events.RentPaid({})
        .on('data', (event) => {
            console.log('RentPaid Event:', event);
            // 在这里处理支付成功的逻辑
            alert('payment successful!')
        })
        .on('error', (error) => {
            // console.error('Event Error:', error);
      });
    }

  }, [contract]);

  // code
  const [formValues, setFormValues] = useState({
    pay: '',
  });

  // 通用的处理输入变化的函数
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value, // 使用输入字段的name属性来更新对应的值
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const rentInfo1 = { ...rentInfo };
    rentInfo1.nextTime = rentInfo.nextTime*1 + 2419200*1000;
    const payMoney = (rentInfo.nextPay*1)/100;
    console.log('pay info',rentInfo1.rentId,rentInfo1.nextTime,rentInfo.nextTime)
    try {
        await contract.methods.payRent(rentInfo1.rentId,rentInfo1.nextTime).send({
            from: accounts[0],
            value: web3.utils.toWei(payMoney+'', 'ether') // 假设租金为1 ether
        });
        alert('payment successful!')
        window.location.reload()
    } catch (error) {
        console.error('Transaction failed:');
    }
  
  };

  const formatDate1 = (timestamp) => {
    const date = new Date(timestamp*1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="common-box" >
        {/*<Alert key="primary" variant="primary">
          Payment Success !
        </Alert>*/}
        <div className={styles.loginContainer} style={{width:'600px'}}>
          <h2>payments</h2>
          {rentInfo.nextTime<rentInfo.endTime ? 

            <form onSubmit={handleSubmit}>
             <div className={styles.formGroup}>
                <label htmlFor="pay">the next deadline of payment : <div style={{fontSize:'24px',color:'red'}}>{formatDate1(rentInfo.nextTime)}</div></label>
                <label htmlFor="pay">the amount of payment : <div style={{fontSize:'24px',color:'red'}}>£{rentInfo.nextPay}</div></label>
              </div>
              <Button type="submit" size="lg">pay Now</Button>
            </form>
            :
            <div style={{'fontSize':'28px','color':'red'}}>you have paid all rent!</div>
          }
          
        </div>
    </div>
    
  );
}

export default Login;

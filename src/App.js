import React,{ Component } from 'react';
import web3 from './utils/InitWeb3';
import { fundingFactoryInstance } from './eth/instance';
import TabCenter from "./display/TabCenter";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentAccount : '',
      platformManager : '',
    }
  }

  //生命周期钩子函数
  async componentWillMount() {
    let accounts = await web3.eth.getAccounts();
    console.log('accounts',accounts);
    let platformManager = await fundingFactoryInstance.methods.platformManager().call();
    console.log('manager:',platformManager);
    this.setState({
      currentAccount : accounts[0],
      platformManager : platformManager,
    })
  }

  render() {
    return (
        <div>
          <h1>梦想众筹平台</h1>
          <img src="https://v1.jinrishici.com/shenghuo/all.svg" alt="poem" />
          {/*<p>管理员地址:{this.state.platformManager}</p>*/}
          <p>当前地址:{this.state.currentAccount}</p>
          <TabCenter/>
        </div>
    )
  }
}

export default App;

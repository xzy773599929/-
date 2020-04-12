//这个js文件用来创建与合约交互的方法
import {fundingFactoryInstance, newFundingInstance} from "./instance";
import web3 from '../utils/InitWeb3';

//获得合约详情
let getFundingDetails = async (index) => {
    //如果调⽤的合约⽅法中明确使⽤了msg.sender，那么必须传⼊from
    let	accounts = await web3.eth.getAccounts();
    //index 1:显示所有众筹合约 2:显示我发起的众筹合约 3:显示我参与的众筹合约
    //整个显示的Card详情逻辑是可以复用的，唯一不同的是返回的众筹数组不同
    //使用if语句进行控制显示
    let currentFundings = [];
    if (index === 1){
        //所有的
        currentFundings = await fundingFactoryInstance.methods.getAllFundings().call();
    }else if (index === 2){
        //我发起的
        currentFundings = await fundingFactoryInstance.methods.getCreatorFundings().call({from:accounts[0]});
    }else if (index === 3){
        //我参与的
        currentFundings = await fundingFactoryInstance.methods.getInvestorFundings().call({from:accounts[0]});
    }
   console.table(currentFundings);

    //对合约地址数组进行遍历
    let detailPromises = currentFundings.map(async function(fundingAddress){
        return new Promise(async (resolve,reject) => {
            try { //获取funding合约实例，每次遍历要用一个新的
                let newInstance = newFundingInstance();
                //填充地址，实例化合约
                newInstance.options.address = fundingAddress;
                //调用方法，返回合约详情
                let creator = await newInstance.methods.creator().call();
                let projectName = await newInstance.methods.projectName().call();
                let supportBalance = await newInstance.methods.supportBalance().call();
                let targetBalance = await newInstance.methods.targetBalance().call();
                let remainTime = await newInstance.methods.getRemainTime().call();
                let currentBalance = await newInstance.methods.getBalance().call();
                let investorsCount = await newInstance.methods.getInvestorsCount().call();
                let detail = {fundingAddress,creator, projectName, supportBalance, targetBalance, remainTime, currentBalance, investorsCount};
                resolve(detail);
            } catch (e) {
                reject(e);
            }
        })
    });
//多个promise处理成一个promise
    let detailInfo = Promise.all(detailPromises);
    return detailInfo;
};

//创建一个众筹合约的方法
let createFunding = async (  projectName, targetBalance, duration, supportBalance ) => {
    return new Promise(async (resolve,reject) => {
        let accounts = await web3.eth.getAccounts();
        //调用创建方法
        try {
            // createFunding(string memory _projectName,uint256 _supportBalance,uint256 _targetBalance,uint256 _durationInSecond)
            let res = await fundingFactoryInstance.methods.createFunding( projectName, supportBalance, targetBalance, duration).send({
                from: accounts[0],
                gas: 3000000,
            });
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
};

//参与众筹的方法
let handleInvestFunc = (fundingAddress, supportBalance) => {
    //封装一个Promise
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress;

            let accounts = await web3.eth.getAccounts();
            //投资
            let res = await fundingInstance.methods.invest().send({
                from: accounts[0],
                gas: 3000000,
                value: supportBalance,
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

//创建一个请求的方法
let createRequest = (fundingAddress, requestAddress, requestBalance, requestDesc) => {
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();
            //发起请求
            let res = await fundingInstance.methods.createRequest(requestDesc, requestBalance, requestAddress).send({
                from: accounts[0],
                gas: 3000000,
            })
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

//获取请求详情的方法
let showRequest = (fundingAddress) => {
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();

            let requestDetails = [];
            //获取请求数量
            let requestCount = await fundingInstance.methods.getRequestsCount().call({from: accounts[0]})
            //遍历请求数量，依次获取每一个请求的详情，使用promise返回
            for (let i = 0; i < requestCount; i++) {
                let requestDetail = await fundingInstance.methods.getRequestDetailByIndex(i).call({from: accounts[0]})
                requestDetails.push(requestDetail);
            }
            resolve(requestDetails)
        } catch (e) {
            reject(e)
        }
    })
}

//投票赞成方法
let approveRequest = (fundingAddress,index) => {
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();

            let res = await fundingInstance.methods.approveRequest(index).send({from: accounts[0]})
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

//实现花费请求方法
let finalizeRequest = (fundingAddress,index) => {
    return new Promise(async (resolve,reject) => {
        try {
            //创建合约实例
            let fundingInstance = newFundingInstance();
            fundingInstance.options.address = fundingAddress;
            let accounts = await web3.eth.getAccounts();

            let res = await fundingInstance.methods.finalizeRequest(index).send({from: accounts[0]})
            resolve(res)
        } catch (e) {
            reject(e)
        }
    })
}

export {
    getFundingDetails,
    createFunding,
    handleInvestFunc,
    createRequest,
    showRequest,
    approveRequest,
    finalizeRequest,
}
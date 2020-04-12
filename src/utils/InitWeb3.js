//引入web3
const Web3 = require("web3");
const web3 = new Web3();

//设置用户自己的provide来填充web3
if(typeof window.web3 !== 'undefined'){
    web3.setProvider(window.web3.currentProvider);
    /*async function getAccount() {
        // eslint-disable-next-line no-undef
        const accountss = await ethereum.enable();
        // const accountz = accountss[0];
        console.log(accountss)
    }
    getAccount();*/
    console.log('Injected web3 found!');
}else {
    //如果浏览器没有web3，那么尝试使用本地环境
    web3.setProvider("http://127.0.0.1:8545");
    console.log('local web3 found!')
}
//导出,ES6语法,default默认导出，在使用时命名可变(import)
export default web3;
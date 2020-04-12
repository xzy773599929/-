let {bytecode,interface} = require('./01-compile');
//引入web3
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const mnemonic = "across true quiz enhance define glare company evidence budget short boost mother"; // 12 word mnemonic
let provider = new HDWalletProvider(mnemonic, "http://127.0.0.1:8545");
// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);
//拼接合约数据
let contract = new web3.eth.Contract(JSON.parse(interface));
let deploy = async () => {
    //1.获取所有用户
    let accounts = await  web3.eth.getAccounts();
    console.log('accounts:',accounts);
    //2.执行部署
    let instance = await contract.deploy({
        data: bytecode,
    }).send({
        from: accounts[0],
        gas: 587089,
        gasPrice: 20,
    });
    console.log('instance address :',instance.options.address);
};
deploy();


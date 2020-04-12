pragma solidity >=0.4.22 <0.7.0;

import './basicFunding.sol';
import './InvestorToFunding.sol';

contract FundingFactory {
    address public platformManager; //众筹平台管理员
    address[] public allFundings; //所有众筹合约的地址的集合
    mapping(address => address[]) creatorFundingMap; //当前账户发起的所有众筹项目的集合
    //定义InvestorToFunding合约
    InvestorToFunding investorToFunding;
    //构造函数
    constructor() public {
        platformManager = msg.sender;
        //实例化InvestorToFunding合约，在创建众筹合约时传入
        investorToFunding = new InvestorToFunding();
    }

    function createFunding(string memory _projectName,uint256 _supportBalance,uint256 _targetBalance,uint256 _durationInSecond) public {
        //1.创建一个新合约，使用new方法，返回一个地址
        address fundingAddress = new CrowFunding(_projectName,_supportBalance,_targetBalance,_durationInSecond,msg.sender,investorToFunding);
        //2.添加合约到集合中
        allFundings.push(fundingAddress);
        //3.添加到我创建的合约集合中
        creatorFundingMap[msg.sender].push(fundingAddress);
    }

    //获取平台所有合约
    function getAllFundings() public view returns(address[] memory){
        return allFundings;
    }

    //获取当前用户创建的所有众筹合约
    function getCreatorFundings() public view returns(address[] memory){
        return creatorFundingMap[msg.sender];
    }

    //获取当前用户参与的所有众筹合约
    function getInvestorFundings() public view returns(address[] memory){
        return investorToFunding.getFundingByInvestor(msg.sender);
    }
}
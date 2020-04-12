pragma solidity >=0.4.22 <0.7.0;

//这个合约维护全局所有人参与的所有合约
contract InvestorToFunding {
    mapping(address => address[]) supportFundingMap; //当前账户参与的所有众筹项目的集合

    //添加指定参与人所参与的众筹数组
    function setFunding(address _investor,address _funding) public {
        supportFundingMap[_investor].push(_funding);
    }

    //获取指定参与人所参与的众筹数组
    function getFundingByInvestor(address _investor) public view returns(address[] memory){
        return supportFundingMap[_investor];
    }
}
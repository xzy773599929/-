pragma solidity >=0.4.22 <0.7.0;

contract CrowFunding {

    address public creator; //项目发起人
    string public projectName; //项目名称
    uint256 public supportBalance; //参与众筹金额,每人投资多少钱
    uint256 public targetBalance; //众筹目标金额
    uint256 public endTime; //众筹截止日期 秒为单位
    address[] public investors; //参与众筹的人，即投资人
    mapping(address => bool) public investorExistMap; //标记一个人是否参与了众筹

    //定义一个枚举，描述申请的状态{投票中，已批准，已完成}
    enum RequestStatus {Voting,Approved,Completed}
    //定义花费请求结构
    struct Request {
        string purpose; //买什么
        uint256 cost; //需要多少钱
        address shopAddress; //向谁购买
        uint256 voteCount; //多少人赞成，超过半数则批准
        mapping(address => bool) investorVoteMap; //赞成人的标记集合，防止一人重复投票多次
        RequestStatus status; //这个申请的状态：投票中，已批准，已完成
    }

    //定义InvestorToFunding合约，（状态变量）在构造函数时接收传过来的InvestorToFunding合约实例
    InvestorToFunding investorToFunding;

    //构造函数，在合约创建的时候添加合约信息
    constructor(string memory _projectName,uint256 _supportBalance,uint256 _targetBalance,uint256 _durationInSecond,address _creator,InvestorToFunding _investorToFunding) public {
        creator = _creator;
        investorToFunding = _investorToFunding; //赋值给状态变量
        projectName = _projectName;
        supportBalance = _supportBalance * 10 ** 18;
        targetBalance = _targetBalance * 10 ** 18;
        //传递进来剩余的秒数，比如众筹30天，则传入30*24*60*60 = 259200秒
        //终止时间 = 当前时间 + 持续时间
        endTime = block.timestamp + _durationInSecond;
    }
    
    //修饰器函数，有些操作仅众筹创建者才可以操作
    modifier onlyCreator() {
        require(msg.sender == creator,"你无权操作");
        _;
    }

    //投资函数
    function invest() public payable {
        require(msg.value == supportBalance,"The support money is not rigth!"); //只支持固定金额
        investors.push(msg.sender); //添加到投资人数组中
        investorExistMap[msg.sender] = true; //标记当前用户参与了众筹
        investorToFunding.setFunding(msg.sender,address(this));
    }

    //众筹失败，退款
    //退款之后这个合约基本就会被废弃，就不处理investors和investorExistMap了
    function drawBack() public onlyCreator() {
        for(uint256 i = 0; i < investors.length; i++){
            investors[i].transfer(supportBalance);
        }
        delete investors;
    }

    //请求可能有多个，定义一个请求数组
    Request[] public allRequests;
    //请求函数
    function createRequest(string memory _purpose,uint256 _cost,address _shopAddress) public onlyCreator() {
        Request memory request = Request({
            purpose : _purpose,
            cost : _cost,
            shopAddress : _shopAddress,
            voteCount : 0,
            status : RequestStatus.Voting
        });
        allRequests.push(request); //新的请求添加至请求数组中
    }

    //批准支付申请
    //1.检验这个人是否投过票，若未投过，则允许投票，反之则退出
    //2.voteCount数据加1
    //3.将该投票人在investorVoteMap映射中的值设置为true
    function approveRequest(uint256 index) public {
        //首先确保是参与众筹的人，否则无权投票
        require(investorExistMap[msg.sender],"无权投票");
        //根据所引值找到特定的请求,一定要用storage标签，设为引用类型，否则无法修改allRequests里面的数据
        Request storage request = allRequests[index];
        //确保没投过票，人手一票
        require(!request.investorVoteMap[msg.sender],"你已经投过票了");
        //如果该请求的状态是已经完成或者批准，就不要再投票了,只投处于投票期间的
        require(request.status == RequestStatus.Voting,"过投票期了");
        //支持票数加一
        request.voteCount++;
        //将当前用户标记为已投票
        request.investorVoteMap[msg.sender] = true;
    }
    
    //实现购买
    function finalizeRequest(uint256 index) public onlyCreator() {
        Request storage request = allRequests[index];
        //合约金额充足才可以执行
        require(address(this).balance >= request.cost,"钱不够");
        //赞成人数过半才能执行
        require(request.voteCount * 2 > investors.length,"赞成人数不足半数");
        //转账给商家
        request.shopAddress.transfer(request.cost);
        //更新请求状态为已完成
        request.status = RequestStatus.Completed;
    }

    //获取合约当前余额
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    //获取投资人数组
    function getInvestors() public view returns(address[] memory){
        return investors;
    }

    //获取众筹剩余时间
    function getRemainTime() public view returns(uint256){
        return endTime - now; 
    }

    //返回投资人数量
    function getInvestorsCount() public view returns(uint256){
        return investors.length;
    }

    //获取请求数量
    function getRequestsCount() public view returns(uint256){
        return allRequests.length;
    }

    //获取某一个申请的具体信息(请求名，花费，消费地址，用户是否已经赞成，赞成数量，该请求状态)
    function getRequestDetailByIndex(uint256 index) public view returns(string memory,uint256,address,bool,uint256,uint){
        //确保下标不越界
        require(index < allRequests.length,"该请求不存在");

        Request storage req = allRequests[index];
        bool isVoted = req.investorVoteMap[msg.sender];
        return(req.purpose,req.cost,req.shopAddress,isVoted,req.voteCount,uint(req.status));
    }
}

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
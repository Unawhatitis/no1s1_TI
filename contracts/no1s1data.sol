pragma solidity >=0.5.16;
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

contract no1s1data{
    using SafeMath for uint256;

    address payable no1s1;
    address adminacc;
    address payable fundingacc;
    address payable defaultuseracc;
    uint256 no1s1balance;
    uint256[] no1s1durations;
   

    
    struct partner{
        string companyname;
        address payable companyaccount;
        string partnertype;
        uint256 workload;
        uint256 workprice;
    }
    
    struct component{
        string materiallocation;
        uint256 materialprice;
        uint256 materialage;
    }
    
    struct condition{
        bool isrenovated;
        uint256 countrenovation;
        string[] renovationlocation;
        string[] renovationprice;
    }
    
    struct Material{
        uint256 materialcount;
        uint256 totalprice;
        mapping (string => component) components;
        mapping (string => condition) conditions;
    }
    

    struct Log{
      uint256 batterycurrent;
      uint256 batteryvoltage;
      uint256 batterystateofcharge;
      uint256 pvvoltage;
      uint256 pvcurrent;
      uint256 systempower;
      uint256 time;
      int256 allowedduration;
      uint256 cost;
    }

    struct UserID{
      uint256 uuid;
      uint256 timereg;
      uint256 ccode;
      address payable account;
      int256 expectedduration;
      uint256 payamount;
      bool haveaccount;
      bool isidentified;
      bool ispaid;
    }

    struct User{
      uint256 uuid;
      string username;
    }
    
    struct accLog{
        uint256 numberOfusers;
        uint256 balanceOfno1s1;
    }

    struct UserUSAGE{
        address account;
        uint256 actualduration;
        int256 paychangeamount;
        uint256 timeex;
        bool grantedentrance;
        bool startedmeditation;
        bool serviceclosed;
        bool paychanged;
        uint256 actualpayment;
    }

    

    /************the material identity**************/


    Log[] public logs;
    User[] private users;
    accLog[] public acclogs;
    //User[] public users;
    //UsageHistory[] private histories;
    //mapping (uint256 => Log[]) logs;
    //mapping (uint256 => No1s1[]) no1s1histories;
    mapping (string => UserID) public usersid;
    mapping (string => UserUSAGE) public usersusage;
    mapping (string => partner) public partners;

    constructor(){
      adminacc=msg.sender;
    }

    modifier onlyAdmin{
      require(msg.sender == adminacc);
      _;
    }

    modifier onlyMe{
      require(msg.sender == no1s1);
      _;
    }

    modifier onlyFundacc{
      require(msg.sender == fundingacc);
      _;
    }
    
    modifier onlyDefault{
      require(msg.sender == defaultuseracc);
      _;
    } 


    event no1s1update(uint batterystateofcharge);
    function broadcastData(uint256 _Bcurrent,uint256 _Bvoltage,uint256 _BSOC,uint256 _Pvoltage,uint256 _Pcurrent,uint256 _Senergy, uint256 _time)public onlyAdmin{

        int weiperchf = 34e13;
        //uint256 costpm = weiperchf; 
        uint256 current_energy=_BSOC;
        int256 _duration;
        if(current_energy >= 75 ){
              _duration = 45;}
        if(current_energy >= 45 ){
            _duration = 25;}
        if(current_energy >= 25 ){
            _duration = 15;}
        if(current_energy <25 ){
            _duration = 5;}
        uint256 _servicecost = uint256(_duration * weiperchf);

        logs.push(Log(
          {batterycurrent: _Bcurrent, 
          batteryvoltage: _Bvoltage,
          batterystateofcharge: _BSOC, 
          pvvoltage: _Pvoltage,
          pvcurrent: _Pcurrent,
          systempower: _Senergy,
          time:_time,
          allowedduration:_duration,
          cost:_servicecost
          }
          ));
        
        emit no1s1update(_BSOC);
    }
    
    event accountInfo(uint256 usernumber, uint256 balance);
    function accountInfoLog() public onlyAdmin{
        acclogs.push(accLog(
            {numberOfusers: users.length,
            balanceOfno1s1: address(this).balance
            }));
        emit accountInfo(users.length,address(this).balance);
    }


    event newUserRegistered(string userName,uint256 confirmationCode); 
    function initNewUser(string memory _username, uint256 _cCode, uint256 _time, uint256 _uuid) public {
      require( usersid[_username].uuid ==  0 , "user name is taken");
      usersid[_username].uuid = _uuid;
      usersid[_username].timereg = _time;
      usersid[_username].ccode = _cCode;
      usersid[_username].account = defaultuseracc;
      usersusage[_username].account = defaultuseracc;
      users.push(User({uuid:_uuid,username:_username}));
      //return _username;
      emit newUserRegistered(_username, _cCode);
      //do i calculate a uuid and ccode here?
      //does it need emit? 
      //does it need return
    }

    function checkStatus()public view returns(int256 c_allowtime,uint256 estimated_cost ,uint256 update_time) {
      /*require (logs.length == 0, "no registered data yet");*/
      int weiperchf = 34e13;
      //uint256 costpm = weiperchf; 
      uint256 current_energy=logs[logs.length-1].batterystateofcharge;
      uint256 last_time=logs[logs.length-1].time;
      int256 _duration;
      if(current_energy >= 75 ){
            _duration = 40;}
        if(current_energy >= 45 ){
            _duration = 20;}
        if(current_energy >= 25 ){
            _duration = 10;}
        if(current_energy <25 ){
            _duration = 5;}
        uint256 servicecost = uint256(_duration * weiperchf);
        return (_duration,servicecost,last_time);
    }
    
    function setUserAccounts(address payable _fundingAddress, address payable _defaultAddress)public onlyAdmin{
      require(_fundingAddress != address(0));
      fundingacc=_fundingAddress;
      defaultuseracc =_defaultAddress;
    }
    
    function setPartner(string memory _partnername, address payable _partnerAddress,string memory _companyname,string memory _partnertype, uint256 _workload,uint256 _workprice) public onlyAdmin{
        partners[_partnername].companyname=_companyname;
        partners[_partnername].companyaccount= _partnerAddress;
        partners[_partnername].partnertype= _partnertype;
        partners[_partnername].workload= _workload;
        partners[_partnername].workprice= _workprice;
    }
    
    
    function whatismyacc() public view returns(address payable,address payable,address){
        return (fundingacc,defaultuseracc,address(this));
    }
    
    function whatismybalance() public view returns(uint256,uint256){
        return (no1s1balance, address(this).balance);
    }

    event whatuuid(uint theuuid);
    function whatisuseruuid() public returns(uint256){
      uint256 lastuuid=users[users.length-1].uuid;
      emit whatuuid(lastuuid);
      return (lastuuid);
    }
    //current information
    event mybalance(uint balance);
    function balanceOf() public returns(uint256){
      return (address(this).balance);
      emit mybalance(address(this).balance);
    }
    event userCount(uint numberOfusers);
    function userNumber() public returns(uint256){
        return (users.length);
        emit userCount(users.length);
    }
    //record of last 10 current_energy
    event accArrays(uint256[], uint256[]);
    function periodInfo() public returns(uint256[] memory,uint256[] memory){
        uint numberofRecords = 10 ;
        if(acclogs.length>= numberofRecords){
            uint256[] memory tenUsers = new uint256[](numberofRecords);
            uint256[] memory tenBalances = new uint256[](numberofRecords);
            for (uint i = 0; i<numberofRecords; i++){
                tenUsers[i] = acclogs[acclogs.length-1-i].numberOfusers;
                tenBalances[i] = acclogs[acclogs.length-1-i].balanceOfno1s1;
                
            }
            return (tenUsers,tenBalances);
            emit accArrays(tenUsers,tenBalances);
        }
        else if(acclogs.length < numberofRecords){
            uint256[] memory tenUsers = new uint256[](acclogs.length);
            uint256[] memory tenBalances = new uint256[](acclogs.length);
            for (uint i = 0; i < acclogs.length; i++){
                tenUsers[i] = acclogs[acclogs.length-1-i].numberOfusers;
                tenBalances[i] = acclogs[acclogs.length-1-i].balanceOfno1s1;
            }
            return (tenUsers,tenBalances);
            emit accArrays(tenUsers,tenBalances);
        }
        //    acclogs[acclogs.length-i].numberOfusers
        //}  
        //for (uint i = 0; i < tokenList[_account].length; i++)
        //Member not found or visible after argument-dependent lookup in struct no1s1data.accLog storage
        //return (acclogs.numberOfusers[acclogs.length-10:acclogs.length-1], acclogs.balanceOfno1s1[acclogs.length-10:acclogs.length-1]);
        /////////////
        //error index range access is only supported for dynamic calldata arrays
        //return (acclogs[acclogs.length-10:acclogs.length-1].numberOfusers, acclogs[acclogs.length-10:acclogs.length-1].balanceOfno1s1); 
         
        //return (acclogs[acclogs.length-lastdig].numberOfusers,acclogs[acclogs.length-lastdig].balanceOfno1s1);
    } 
    
    // function whatisuseruuid2() public view returns(uint256){
    //   uint256 lastuuid=users[users.length-1].uuid;
    //   return (lastuuid);
    // }


    event LastLog(uint pviv, uint soe, uint bsoc, int adur, uint cost);
    function mylastlogs() public returns(uint256,uint256,uint256,int256,uint256){
      uint256 lastPVIV=logs[logs.length-1].pvvoltage;
      uint256 lastSOE=logs[logs.length-1].systempower;
      uint256 lastBSoC=logs[logs.length-1].batterystateofcharge;
      int256 lastAD=logs[logs.length-1].allowedduration;
      uint256 lastC=logs[logs.length-1].cost;
      emit LastLog(lastPVIV,lastSOE,lastBSoC,lastAD,lastC);
      return (lastPVIV,lastSOE,lastBSoC,lastAD,lastC);
    }
    
    // function mylastlogsV() public view returns(uint256,uint256,uint256){
    //   uint256 lastPVIV=logs[logs.length-1].pvvoltage;
    //   uint256 lastSOE=logs[logs.length-1].systempower;
    //   uint256 lastBSoC=logs[logs.length-1].batterystateofcharge;
    //   return (lastPVIV,lastSOE,lastBSoC);
    // }


    /*exucable once every season*/
    // function fundDefault()external onlyFundacc payable{
    //     address payable _to = defaultuseracc;
    //     (bool sent, bytes memory data) = _to.call;/*{value: msg.value}("");*/
    //     require (sent, "payment failed!");
    // }

    function userPay(int _selectedDuration, string calldata _username) external onlyDefault payable returns(uint256){
    /*msg.value* is survice cost*/
    usersid[_username].payamount = msg.value;
    usersid[_username].expectedduration = _selectedDuration;
    usersid[_username].ispaid = true;
    int256 weiperchf = 34e13;
    uint256 minPayment = uint256(_selectedDuration).mul(uint256(weiperchf));
    require(msg.value >= minPayment, "must reach minimum payment amount!");
    no1s1balance = no1s1balance.add(msg.value);
    toContract();
    usersid[_username].isidentified = true;
    usersusage[_username].grantedentrance =  true;
    return msg.value; 
    /*address payable payacc=usersid[_username].account;*/
    /*(bool sent, bytes memory data) = usersid[_username].account.call{value: msg.value}("");*/
    /*ToContract{value:servicecost}(log1, log2, log3);*/
    /*ToContract(servicecost);*/
    /*require (sent, "payment failed!");*/
    }


    function toContract() public payable {
        
    }
    
    event userAction(bool userActionConfirmed);
    function userActive(bool _pressuredetected, bool _dooropened, bool _motiondetected, string memory _username) public {
      require(_pressuredetected == true && _dooropened == true && _motiondetected == true, "user activity action not detected!");
      usersusage[_username].startedmeditation = true;
      emit userAction(true);
    }
    
    function serviceClose(bool _motiondetected, bool _dooropened, bool _handletriggered, string memory _username, uint256 _actualduration, uint256 _timeex) public returns (uint) {
      require(_handletriggered == true && _dooropened == true && _motiondetected == true, "user leave action not detected!");
      usersusage[_username].actualduration = _actualduration;
      usersusage[_username].timeex = _timeex;
      int256 durationdif_min = usersid[_username].expectedduration - int256(_actualduration);
      int256 weiperchf = 34e13;
      //uint256 costpm = weiperchf;
      int256 costdif = durationdif_min * weiperchf;
      no1s1durations.push(_actualduration);
      if (durationdif_min > 10 || durationdif_min < -10){
        usersusage[_username].paychanged = true; 
        usersusage[_username].paychangeamount = costdif;
        usersusage[_username].actualpayment = uint256(int256(usersid[_username].payamount) + costdif);
        no1s1balance= uint256(int256(no1s1balance)+costdif);
        usersusage[_username].serviceclosed = true;
      }
      if ( durationdif_min < 10 && durationdif_min > -10){
          usersusage[_username].actualpayment=usersid[_username].payamount;
          usersusage[_username].serviceclosed = true;
      }
      return no1s1durations.length;
    }


//uint256 historyID = no1s1histories.push(No1s1(_totalpayment,_totalduration));
//      UsageHistory=histories[historyID];
 //     return historyID;




}
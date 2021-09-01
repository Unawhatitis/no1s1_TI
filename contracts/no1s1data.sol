pragma solidity >=0.5.16;
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";

contract no1s1data{
    using SafeMath for uint256;


    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address adminacc; //Account used to deploy contract
    //address payable fundingacc; 
    //address payable defaultuseracc;
    address payable useracc;
    uint256 no1s1balance;
    uint256[] no1s1durations;
    bool private operational = true; 
    
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
      //int256 allowedduration;
      //uint256 cost;
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

    

    /************arrays and mappings**************/


    Log[] public logs;
    User[] private users;
    accLog[] public acclogs;
    //User[] public users;
    //UsageHistory[] private histories;
    //mapping (uint256 => Log[]) logs;
    //mapping (uint256 => No1s1[]) no1s1histories;
    mapping(address => uint8) authorizedContracts;               // Mapping to store authorized contracts that can call into the data contract
    mapping (string => UserID) public usersid;
    mapping (string => UserUSAGE) public usersusage;
    mapping (string => partner) public partners;


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    event no1s1update(uint batterystateofcharge);
    event accountInfo(uint256 usernumber, uint256 balance);
    event newUserRegistered(string userName,uint256 confirmationCode); 
    event whatuuid(uint theuuid);
    event mybalance(uint balance);
    event userCount(uint numberOfusers);
    event accArrays(uint256[], uint256[]);
    event LastLog(uint pviv, uint soe, uint bsoc);
    event userAction(bool userActionConfirmed);
    //Emmitted when new contract is de-/authorized
    event AuthorizedContract(address appContract);
    event DeAuthorizedContract(address appContract);

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/
    constructor(){
      adminacc=msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;
    }

    modifier onlyAdmin{
      require(msg.sender == adminacc,"Caller is not Admin");
      _;
    }


    // modifier onlyFundacc{
    //   require(msg.sender == fundingacc);
    //   _;
    // }
    
    // modifier onlyDefault{
    //   require(msg.sender == defaultuseracc);
    //   _;
    // } 

    modifier onlyUser{
      require(msg.sender == useracc);
    }


    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    
    /**
    * @dev Get operating status of contract
    * @return A bool that is the current operating status
    */
    function isOperational()
                            external view returns (bool)
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus
                            (
                                bool mode
                            )
                            external
                            onlyAdmin
    {
        operational = mode;
    }

    // authorize app contract to call into data contract
    function authorizeContract(address appContract) external onlyAdmin returns(bool)
    {
        authorizedContracts[appContract] = 1;
        emit AuthorizedContract(appContract);
        return true;
    }


    // deauthorize app contract to call into data contract
    function deAuthorizeContract(address appContract) public onlyAdmin returns(bool)
    {
        delete authorizedContracts[appContract];
        emit DeAuthorizedContract(appContract);
        return true;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/
    
    /**
    * @dev Broadcast electrical data from backend to front-end
    * @param _BSOC state of charge of the battery
    * @param _Senergy system energy
    * @param _time time of registration
    * emit Return battery state of charge
    */
    function broadcastData(uint256 _Bcurrent,uint256 _Bvoltage,uint256 _BSOC,uint256 _Pvoltage,uint256 _Pcurrent,uint256 _Senergy, uint256 _time)public onlyAdmin{

        int weiperchf = 34e13;
        //uint256 costpm = weiperchf; 
        uint256 current_energy=_BSOC;
        //int256 _duration;
        // if(current_energy >= 75 ){
        //       _duration = 45;}
        // if(current_energy >= 45 ){
        //     _duration = 25;}
        // if(current_energy >= 25 ){
        //     _duration = 15;}
        // if(current_energy <25 ){
        //     _duration = 5;}
        // uint256 _servicecost = uint256(_duration * weiperchf);

        logs.push(Log(
          {batterycurrent: _Bcurrent, 
          batteryvoltage: _Bvoltage,
          batterystateofcharge: _BSOC, 
          pvvoltage: _Pvoltage,
          pvcurrent: _Pcurrent,
          systempower: _Senergy,
          time:_time
          }
          ));
        
        emit no1s1update(_BSOC);
    }
    
    /**
    * @dev Log user and account information periodically for easy record keeping
    * emit Return number of users and account balance
    */
    function accountInfoLog() public onlyAdmin{
        acclogs.push(accLog(
            {numberOfusers: users.length,
            balanceOfno1s1: address(this).balance
            }));
        emit accountInfo(users.length,address(this).balance);
    }


    /**
    * @dev initiate a new user
    * @param _username username defined by user
    * @param _cCode confirmation code generated through email address (questionable with token system?)
    * @param _uuid a unique id generated with uuid function (questionable with token system)
    * emit the username and confirmation code
    */
    function initNewUser(string memory _username, uint256 _cCode, uint256 _time, uint256 _uuid) public {
      require( usersid[_username].uuid ==  0 , "user name is taken");
      usersid[_username].uuid = _uuid;
      usersid[_username].timereg = _time;
      usersid[_username].ccode = _cCode;
      usersid[_username].account = useracc;
      usersusage[_username].account = useracc;
      users.push(User({uuid:_uuid,username:_username}));
      //return _username;
      emit newUserRegistered(_username, _cCode);
      //do i calculate a uuid and ccode here?
      //does it need emit? 
      //does it need return
    }
    
    
    /**
    * @dev user payment functions
    * @param _selectedDuration duration defined by user
    * @return the payed value
    */
    function userPay(int _selectedDuration, string calldata _username) external onlyUser payable returns(uint256){
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
    }


    function toContract() public payable {
        
    }
    
    /**
    * @dev backend sensor data to confirm the activity of user
    * @param _dooropened electrical door status
    */
    function userActive(bool _pressuredetected, bool _dooropened, bool _motiondetected, string memory _username) public {
      require(_pressuredetected == true && _dooropened == true && _motiondetected == true, "user activity action not detected!");
      usersusage[_username].startedmeditation = true;
      emit userAction(true);
    }

    /**
    * @dev service closed upon exit
    * @param _actualduration user actual duration (need to figure out how to calculate this)
    * @return array duration
    */
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

    /********************************************************************************************/
    /*                                SMART CONTRACT VIEW FUNCTIONS                             */
    /********************************************************************************************/
    
    function whatismyacc() public view returns(address payable,address){
        return (useracc,address(this));
    }
    
    function whatismybalance() public view returns(uint256,uint256){
        return (no1s1balance, address(this).balance);
    }

    
    function whatisuseruuid() public returns(uint256){
      uint256 lastuuid=users[users.length-1].uuid;
      emit whatuuid(lastuuid);
      return (lastuuid);
    }
    //current information
    
    function balanceOf() public returns(uint256){
      return (address(this).balance);
      emit mybalance(address(this).balance);
    }
    
    function userNumber() public returns(uint256){
        return (users.length);
        emit userCount(users.length);
    }
    //record of last 10 current_energy
    
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
    
    function mylastlogs() public returns(uint256,uint256,uint256){
      uint256 lastPVIV=logs[logs.length-1].pvvoltage;
      uint256 lastSOE=logs[logs.length-1].systempower;
      uint256 lastBSoC=logs[logs.length-1].batterystateofcharge;
      //int256 lastAD=logs[logs.length-1].allowedduration;
      //uint256 lastC=logs[logs.length-1].cost;
      emit LastLog(lastPVIV,lastSOE,lastBSoC);
      return (lastPVIV,lastSOE,lastBSoC);
    }

    /********************************************************************************************/
    /*                              SMART CONTRACT FUTURE FUNCTIONS                             */
    /********************************************************************************************/

    function setPartner(string memory _partnername, address payable _partnerAddress,string memory _companyname,string memory _partnertype, uint256 _workload,uint256 _workprice) public onlyAdmin{
    partners[_partnername].companyname=_companyname;
    partners[_partnername].companyaccount= _partnerAddress;
    partners[_partnername].partnertype= _partnertype;
    partners[_partnername].workload= _workload;
    partners[_partnername].workprice= _workprice;
    }

    // function setUserAccounts(address payable _fundingAddress, address payable _defaultAddress)public onlyAdmin{
    //   require(_fundingAddress != address(0));
    //   fundingacc=_fundingAddress;
    //   defaultuseracc =_defaultAddress;
    // }
    
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



}
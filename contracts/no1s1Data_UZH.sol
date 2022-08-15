pragma solidity >=0.5.16;

// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/************************************************** */
/* no1s1 Data Smart Contract                        */
/************************************************** */

// TODO: is ERC721

contract no1s1Data_UZH {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                  // Account used to deploy contract becomes contract admin
    bool private operational = true;           // Main operational state of smart contract. Blocks all state changes throughout the contract if false

    // no1s1 main state variables
    bool no1s1Accessability;                   // Whether no1s1 is accessible
    bool no1s1Occupation;                      // Whether no1s1 is occupied
    enum BatteryState
    {
        Full, // 0
        Good,  // 1
        Low, // 2
        Empty  // 3
    }                                           
    BatteryState no1s1BatteryLevel;            // Battery level of no1s1

    // User and Usage duration counters
    uint256 counterUsers;
    uint256 counterDuration;
    // Escrow balance
    uint256 escrowBalance;

    // Data structure of no1s1 technical system log (hourly)
    struct TechLog{
        uint256 batteryCurrency;
        uint256 batteryVoltage;
        uint256 batteryChargeState;
        uint256 pvVoltage;
        uint256 systemPower;
        uint256 time;
    }

    // Data structure of no1s1 usage log (daily)
    struct UsageLog{
        uint256 Earnings;
        uint256 Escrow;
        uint256 Users;
        uint256 Duration;
        uint256 time;
    }

    // Data structure of no1s1 users
    struct No1s1User {
        uint256 boughtDuration;
        bool accessed;
        uint256 actualDuration;
        bool left;
        uint256 paidEscrow;
    }

    // Arrays
    TechLog[] public no1s1TechLogs;                         // Array to store history of system data logs with struct TechLog
    UsageLog[] public no1s1UsageLogs;                       // Array to store history of system data logs with struct UsageLog

    // Mappings (key value pairs)
    mapping(address => uint256) authorizedContracts;        // Mapping to store authorized contracts that can call into the data contract
    mapping(bytes32 => No1s1User) no1s1Users;               // Mapping to store authorized no1s1 users

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // Emitted when new contract is de-/authorized
    event AuthorizedContract(address appContract);
    event DeAuthorizedContract(address appContract);
    // Emitted when new tech log added
    event TechLogUpdate(uint256 batteryCurrency,uint256 batteryVoltage, uint256 batteryStateOfCharge,uint256 pvVoltage, uint256 systemEnergy, uint256 logTime);
    // Emitted when new purchase was made
    event newQRcode(bytes32 qrCode);
    // Emitted when access suceeded
    event accessSuceeded(uint256 allowedTime);
    // Emitted when user active/inactive
    event userActive(bool userActive);
    // Emitted when user left
    event exitSuccessful(uint256 totalMeditationTime);
    // Emitted when escrow got refunded
    event refundSuccessful(uint256 price, uint256 amountReturned);

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/
    
    /**
    * @dev Constructor
    *      Deploying the no1s1Data contract and the NFT contract for the no1s1 access token
    *      The deploying account becomes contractOwner
    */
    // TODO: add ERC721("no1s1 token", "NO1S1") for ERC721 support
    constructor()
    {
        contractOwner = msg.sender;
        // Initiate state variables
        no1s1Accessability = true;
        no1s1Occupation = true;
        no1s1BatteryLevel = BatteryState.Full;
        counterUsers = 0;
        counterDuration = 0;
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

    /**
    * @dev Modifier that requires the "contractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
      require(msg.sender == contractOwner, "Caller is not contract owner");
      _;
    }

    /**
    * @dev Modifier that requires that the contract calling into the data contract is authorized
    */
    modifier isCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not authorized");
        _;
    }

    /**
    * @dev Modifier that checks whether no1s1 is accessible
    */
    modifier checkAccessability() {
        require(no1s1Accessability == true, "no1s1 is currently closed.");
        _;
    }

    /**
    * @dev Modifier that checks whether no1s1 is occupied
    */
    modifier checkOccupancy() {
        require(no1s1Occupation == true, "no1s1 is currently already occupied.");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

   /**
    * @dev Get operating status of contract
    * @return bool that is the current operating status
    */
    function isOperational() external view returns (bool)
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus(bool mode) public requireContractOwner
    {
        operational = mode;
    }

    /**
    * @dev authorize app contract to call into data contract
    * @return A bool that is the current authorization status
    */
    function authorizeContract(address appContract) public requireIsOperational requireContractOwner returns(bool)
    {
        authorizedContracts[appContract] = 1;
        emit AuthorizedContract(appContract);
        return true;
    }

    /**
    * @dev deauthorize app contract to call into data contract
    * @return A bool that is the current authorization status
    */
    function deAuthorizeContract(address appContract) public requireIsOperational requireContractOwner returns(bool)
    {
        delete authorizedContracts[appContract];
        emit DeAuthorizedContract(appContract);
        return true;
    }

    /********************************************************************************************/
    /*               SMART CONTRACT FUNCTIONS (ONLY CALLABLE FROM APP CONTRACT)                 */
    /********************************************************************************************/

    /**
    * @dev function to modify the main state variable no1s1Accessability. This function is only for admins (not callable from app contract) to reset this state.
    */
    function setAccessabilityStatus(bool mode) external isCallerAuthorized requireIsOperational
    {
        no1s1Accessability = mode;
    }

    /**
    * @dev function to modify the main state variable no1s1Occupation. This function is only for admins (not callable from app contract) to reset this state in case exiting the space is not detected
    */
    function setOccupationStatus(bool mode) external isCallerAuthorized requireIsOperational
    {
        no1s1Occupation = mode;
    }

    /**
    * @dev function for backend to broadcast technical state, store it in no1s1TechLogs, and modify the main state variable no1s1BatteryLevel (hourly?)
    */
    function broadcastData(uint256 _Bcurrent,uint256 _Bvoltage, uint256 _BSOC,uint256 _Pvoltage, uint256 _Senergy, uint256 _Time, uint256 FULL_VALUE, uint256 GOOD_VALUE, uint256 LOW_VALUE) external isCallerAuthorized requireIsOperational
    {
        // Add new tech data log
        no1s1TechLogs.push(TechLog(
          {
            batteryCurrency: _Bcurrent,
            batteryVoltage: _Bvoltage,
            batteryChargeState: _BSOC,
            pvVoltage: _Pvoltage,
            systemPower: _Senergy,
            time:_Time
          }
        ));
        // Update battery state
        // TODO: adjust logic that it is based on battery voltage and currency
        if(_BSOC >= FULL_VALUE){
            no1s1BatteryLevel = BatteryState.Full;
        }
        else if (_BSOC >= GOOD_VALUE){
            no1s1BatteryLevel = BatteryState.Good;
        }
        else if (_BSOC >= LOW_VALUE){
            no1s1BatteryLevel = BatteryState.Low;
        }
        else {
            no1s1BatteryLevel = BatteryState.Empty;
        }
        // Emit event
        emit TechLogUpdate(_Bcurrent, _Bvoltage, _BSOC, _Pvoltage, _Senergy, _Time);
    }

    /**
    * @dev buy function to access no1s1, returns QR code
    */
    function buy(uint256 _selectedDuration, address txSender, string calldata _username, uint256 ESCROW_AMOUNT, uint256 MAX_DURATION, uint256 GOOD_DURATION, uint256 LOW_DURATION) external payable isCallerAuthorized requireIsOperational checkAccessability checkOccupancy
    {
        // check whether no1s1 is accessible and not occupied (modifiers in function headers)
        // check whether the entered duration is below the maximum duration
        require(_selectedDuration <= MAX_DURATION, "You request is longer than the maximum allowed meditation duration.");
        // check if the sent amount is sufficient to cover the escrow
        require(msg.value >= ESCROW_AMOUNT, "Not enough Ether provided.");
        // check whether no1s1 battery level is sufficient for chosen meditation time
        if(_selectedDuration >= GOOD_DURATION){
            require(no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
        }
        else if (_selectedDuration >= LOW_DURATION){
            require(no1s1BatteryLevel == BatteryState.Good || no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
        }
        else if (_selectedDuration > 0){
            require(no1s1BatteryLevel == BatteryState.Low || no1s1BatteryLevel == BatteryState.Good || no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
        }
        // create key to store this order
        bytes32 key = keccak256(abi.encodePacked(txSender, _username)); // username to generate key so QR code is != address
        // check whether user has already bought meditation time
        require(no1s1Users[key].boughtDuration == 0, "You already bought meditation time for no1s1.");
        // add new no1s1 user
        no1s1Users[key] = No1s1User({
            boughtDuration: _selectedDuration,
            accessed: false,
            actualDuration: 0,
            left: false,
            paidEscrow: msg.value
        });
        // Update total escrow balance
        escrowBalance = escrowBalance.add(msg.value);
        // mit event with QR code (key)
        emit newQRcode(key);
    }

    /**
    * @dev function triggered by backend to check whether QR code is valid and authorizes to unlock door
    * @param _key QR code detected by camera
    * returns allowed duration to enter (if 0, door could stay locked)
    */
    //TODO: trigger timer in back-end?
    function checkAccess(bytes32 _key, uint256 GOOD_DURATION, uint256 LOW_DURATION) external isCallerAuthorized requireIsOperational checkAccessability checkOccupancy
    {
        uint256 allowedDuration = no1s1Users[_key].boughtDuration;
        if (allowedDuration != 0) {
            // check again whether no1s1 is accessible and not occupied (modifiers in function headers)
            // check again battery status
            if(allowedDuration >= GOOD_DURATION){
            require(no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
            }
            else if (allowedDuration >= LOW_DURATION){
                require(no1s1BatteryLevel == BatteryState.Good || no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
            }
            else if (allowedDuration > 0){
                require(no1s1BatteryLevel == BatteryState.Low || no1s1BatteryLevel == BatteryState.Good || no1s1BatteryLevel == BatteryState.Full, "no1s1 battery level not sufficient for selected duration.");
            }
            // update occupancy status so noone else can buy access
            no1s1Occupation = false;
            // emit event to unlock door for allowed duration
            emit accessSuceeded(allowedDuration);
        }
        else {
            // revert transaction
            revert("No meditation time bought for this key.");
        }
    }

    /**
    * @dev function triggered by back-end shortly after access() function with sensor feedback (door openend, motion detected)
    * if user has not entered, set occupancy back to not occupied and lock door
    */
    function checkActivity(bool _pressureDetected, bytes32 _key) external isCallerAuthorized requireIsOperational
    {
        // check wether access has been checked
        require(no1s1Occupation == false, "Access key has not been checked yet.");
        // check whether access has already been registered
        require(no1s1Users[_key].accessed == false, "The access has already been registered.");
        // check wether user entered the space.
        // TODO: more sensors? motion?
        if (_pressureDetected == true) {
            // User is active! Update user infromation to accessed
            uint256 escrow = no1s1Users[_key].paidEscrow;
            no1s1Users[_key] = No1s1User({
                boughtDuration: 0,
                accessed: true,
                actualDuration: 0,
                left: false,
                paidEscrow: escrow
            });
            // Emit event
            emit userActive(true);
        }
        else {
            // If not active, revert occupancy state to not occupied
            no1s1Occupation = true;
            // Emit event
            emit userActive(false);
        }
    }

    /**
    * @dev function triggered by backend after leaving no1s1. resets the occupancy state.
    */
    // TODO: careful with input format of _actualDuration [minutes]
    function exit(bool _doorOpened, uint256 _actualDuration, bytes32 _key, uint256 _time, uint256 MEDITATION_PRICE) external isCallerAuthorized requireIsOperational
    {
        // check whether user has accessed
        require(no1s1Users[_key].accessed == true, "The user has not meditated yet!");
        // check whether user left. TODO: more sensors?
        require(_doorOpened == true, "The user has not left the space yet!");
        // update occupancy state
        no1s1Occupation = true;
        // update counters
        counterUsers = counterUsers.add(1);
        counterDuration = counterDuration.add(_actualDuration);
        // update user state
        uint256 escrow = no1s1Users[_key].paidEscrow;
        no1s1Users[_key] = No1s1User({
            boughtDuration: 0,
            accessed: true,
            actualDuration: _actualDuration,
            left: true,
            paidEscrow: escrow
        });
        // Add new usage data log
        no1s1UsageLogs.push(UsageLog(
          {
            Earnings: address(this).balance.sub(escrowBalance).add(_actualDuration.mul(uint256(MEDITATION_PRICE))),
            Escrow: escrowBalance,
            Users: counterUsers,
            Duration: counterDuration,
            time: _time
          }
        ));
        // emit event
        emit exitSuccessful(_actualDuration);
    }

    /**
    * @dev function triggered by user after leaving no1s1. Pays back escrow and sends out confirmation NFT.
    */
    function refundEscrow(address _sender, string calldata _username, uint256 MEDITATION_PRICE) external isCallerAuthorized requireIsOperational
    {
        // recalculate key
        bytes32 key = keccak256(abi.encodePacked(_sender, _username));
        // check whether user has actually redeemed access (entered the space)
        require(no1s1Users[key].accessed == true, "You cannot redeem your escrow, because you have not meditated yet!");
        // check whether user left.
        require(no1s1Users[key].left == true, "You cannot redeem your escrow, because you have not left the space yet!");
        // calculate price for the entered duration
        uint256 actualDuration = no1s1Users[key].actualDuration;
        uint256 price = actualDuration.mul(uint256(MEDITATION_PRICE));
        // Update total escrow balance
        uint256 escrow = no1s1Users[key].paidEscrow;
        escrowBalance = escrowBalance.sub(escrow);
        // Calculate amount to return
        uint256 amountToReturn = uint256(escrow).sub(uint256(price));
        // check if payable duration is smaller then escrow
        if (escrow <= price) {
            // reset user state
            no1s1Users[key] = No1s1User({
                boughtDuration: 0,
                accessed: false,
                actualDuration: 0,
                left: false,
                paidEscrow: 0
            });
            amountToReturn = 0;
        }
        else {
            // reset user state
            no1s1Users[key] = No1s1User({
                boughtDuration: 0,
                accessed: false,
                actualDuration: 0,
                left: false,
                paidEscrow: 0
            });
            // send remaining escrow balance back to buyer
            payable(_sender).transfer(amountToReturn);
            //TODO: mint NFT and send to user, use user counter as ID (unique)
            //_safeMint(_sender, counterUsers);
        }
        // emit event
        emit refundSuccessful(price, amountToReturn);
    }

    /********************************************************************************************/
    /*                                SMART CONTRACT VIEW FUNCTIONS                             */
    /********************************************************************************************/
    
    /**
    * @dev Get operating status of no1s1 (main state variables)
    */
    function howAmI() external view returns (bool accessability, bool occupation, uint256 batteryState, uint256 totalUsers, uint256 totalDuration, uint256 myBalance)
    {
        return (accessability = no1s1Accessability, occupation = no1s1Occupation, batteryState = uint256(no1s1BatteryLevel), totalUsers = counterUsers, totalDuration = counterDuration, myBalance = address(this).balance);
    }

    /**
    * @dev Get address of no1s1
    */
    function whoAmI() external view returns(address no1s1Address)
    {
        return (address(this));
    }

    /**
    * @dev Get balance of no1s1 (without escrow paid)
    */
    function howRichAmI() external view returns(uint256 no1s1Balance)
    {
        return (address(this).balance.sub(escrowBalance));
    }    

    /**
    * @dev get latest entries of UsageLog (max 10)
    */
    function getUsageLog() external view returns(uint256[] memory users, uint256[] memory balances, uint256[] memory escrows, uint256[] memory durations)
    {
            uint256[] memory Users = new uint256[](counterUsers);
            uint256[] memory Balances = new uint256[](counterUsers);
            uint256[] memory Escrows = new uint256[](counterUsers);
            uint256[] memory Durations = new uint256[](counterUsers);
            for (uint i = 0; i < counterUsers; i++){
                Users[i] = no1s1UsageLogs[no1s1UsageLogs.length-1-i].Users;
                Balances[i] = no1s1UsageLogs[no1s1UsageLogs.length-1-i].Earnings;
                Escrows[i] = no1s1UsageLogs[no1s1UsageLogs.length-1-i].Escrow;
                Durations[i] = no1s1UsageLogs[no1s1UsageLogs.length-1-i].Duration;
            }
            return (Users, Balances, Escrows, Durations);
    }

    /**
    * @dev retrieve values needed to buy meditation time
    */
    function checkBuyStatus(uint256 MEDITATION_PRICE, uint256 FULL_DURATION, uint256 GOOD_DURATION, uint256 LOW_DURATION) external view returns(uint256 batteryState, uint256 availableMinutes, uint256 costPerMinute , uint256 lastUpdate)
    {
        // uint256 stateOfCharge = no1s1TechLogs[no1s1TechLogs.length-1].batterystateofcharge;
        uint256 batteryLevel = uint256(no1s1BatteryLevel);
        uint256 time = no1s1TechLogs[no1s1TechLogs.length-1].time;
        uint256 duration;
        if (batteryLevel == 0){
            duration = FULL_DURATION;}
        else if (batteryLevel == 1){
            duration = GOOD_DURATION;}
        else if(batteryLevel == 2){
            duration = LOW_DURATION;}
        else if(batteryLevel == 3){
            duration = 0;}
        return (batteryLevel, duration, MEDITATION_PRICE, time);
    }

    /**
    * @dev retrieve the latest technical logs
    */ 
    function checkLastTechLogs() external view returns(uint256 pvVoltage, uint256 systemPower, uint256 batteryChargeState, uint256 batteryCurrency, uint256 batteryVoltage)
    {
        uint256 lastPVIV = no1s1TechLogs[no1s1TechLogs.length-1].pvVoltage;
        uint256 lastSOE = no1s1TechLogs[no1s1TechLogs.length-1].systemPower;
        uint256 lastBSoC = no1s1TechLogs[no1s1TechLogs.length-1].batteryChargeState;
        uint256 lastBCurrency = no1s1TechLogs[no1s1TechLogs.length-1].batteryCurrency;
        uint256 lastBVoltage = no1s1TechLogs[no1s1TechLogs.length-1].batteryVoltage;
        return (lastPVIV, lastSOE, lastBSoC, lastBCurrency, lastBVoltage);
    }

    /**
    * @dev retrieve user information with key (QR code)
    */ 
    function checkUserKey(bytes32 _key) external view returns(uint256 meditationDuration, bool accessed, uint256 actualDuration, bool left, uint256 escrow)
    {
        return (no1s1Users[_key].boughtDuration, no1s1Users[_key].accessed, no1s1Users[_key].actualDuration, no1s1Users[_key].left, no1s1Users[_key].paidEscrow);
    }

    /**
    * @dev retrieve user information with username
    */ 
    function checkUserName(address _sender, string calldata _username) external view returns(bytes32 qrCode, uint256 meditationDuration, bool accessed, uint256 actualDuration, bool left, uint256 escrow)
    {
        bytes32 key = keccak256(abi.encodePacked(_sender, _username));
        return (key, no1s1Users[key].boughtDuration, no1s1Users[key].accessed, no1s1Users[key].actualDuration, no1s1Users[key].left, no1s1Users[key].paidEscrow);
    }


    /********************************************************************************************/
    /*                                SMART CONTRACT FALLBACK FUNCTION                         */
    /********************************************************************************************/

    /**
    * @dev Payable fallback function.
    */
    fallback () external payable isCallerAuthorized requireIsOperational {}

    /**
    * @dev Payable receive function to enable the contract to receive direct payments.
    */
    receive() external payable {}

}
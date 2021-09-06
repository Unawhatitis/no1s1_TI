pragma solidity >=0.5.16;

// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

/************************************************** */
/* no1s1 App Smart Contract                         */
/************************************************** */

contract no1s1App {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;          // Account used to deploy contract

    No1s1Data no1s1Data;                    // State variable referencing the data contract

    uint256 private constant MEDITATION_PRICE = 0.01 ether;     // Price per minute meditation in no1s1
    uint256 private constant ESCROW_AMOUNT = 0.5 ether;         // Escrow amount to be paid to meditate
    uint256 private constant MAX_DURATION = 60;                 // Maximum allowed duration to meditate per user in minutes
    // Minimum values for battery state of charge
    uint256 private constant FULL_VALUE = 75;
    uint256 private constant GOOD_VALUE = 45;
    uint256 private constant LOW_VALUE = 25;
    // Minimum duration for given battery state of charge
    uint256 private constant GOOD_DURATION = 30;
    uint256 private constant LOW_DURATION = 10;
    
    // Mappings (key value pairs)
    mapping(address => uint256) authorizedBackends;             // Mapping to store authorized backends that can call into the app contract

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // Emitted when new contract is de-/authorized
    event AuthorizedBackend(address backendAddress);
    event DeAuthorizedBackend(address backendAddress);

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

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
    modifier requireBackend()
    {
        require(authorizedBackends[msg.sender] == 1, "Backend is not authorized");
        _;
    }
    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    * tells the App contract where to find the data of the app contract (address)
    */
    constructor(address dataContract)
    {
        contractOwner = msg.sender;
        no1s1Data = No1s1Data(dataContract);
        // register msg.sender as first backend
        authorizeBackend(msg.sender);
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev authorize app contract to call into data contract
    * @return A bool that is the current authorization status
    */
    function authorizeBackend(address backendAddress) public requireContractOwner returns(bool)
    {
        authorizedBackends[backendAddress] = 1;
        emit AuthorizedBackend(backendAddress);
        return true;
    }

    /**
    * @dev deauthorize app contract to call into data contract
    * @return A bool that is the current authorization status
    */
    function deAuthorizeBackend(address backendAddress) public requireContractOwner returns(bool)
    {
        delete authorizedBackends[backendAddress];
        emit DeAuthorizedBackend(backendAddress);
        return true;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
    * @dev function for backend to trigger storing the current state of no1s1 (daily)
    * Pass address of function caller to data contract to enable role modifier
    */
    function setAccessabilityStatus(bool mode) external requireContractOwner
    {
        no1s1Data.setAccessabilityStatus(mode);
    }

    /**
    * @dev function for backend to trigger storing the current state of no1s1 (daily)
    * Pass address of function caller to data contract to enable role modifier
    */
    function setOccupationStatus(bool mode) external requireContractOwner
    {
        no1s1Data.setOccupationStatus(mode);
    }

    /**
    * @dev function to log data in smart contract when broadcasting from backend to frontend
    */
    function broadcastData(uint256 _Bcurrent,uint256 _Bvoltage, uint256 _BSOC,uint256 _Pvoltage, uint256 _Senergy, uint256 _Time) external requireBackend
    {
        no1s1Data.broadcastData(_Bcurrent, _Bvoltage, _BSOC, _Pvoltage, _Senergy, _Time, FULL_VALUE, GOOD_VALUE, LOW_VALUE);
    }

    /**
    * @dev function for backend to trigger storing the current state of no1s1 (daily)
    * Pass address of function caller to data contract to enable role modifier
    */
    function no1s1InfoLog(uint256 _Time) external requireBackend
    {
        no1s1Data.no1s1InfoLog(_Time);
    }

    /**
    * @dev buy function to access no1s1, only pass _selectedDuration and _username!
    */
    function buy(uint256 _selectedDuration, string calldata _username) external payable
    {
        no1s1Data.buy{value: msg.value}(_selectedDuration, msg.sender, _username, ESCROW_AMOUNT, MAX_DURATION, GOOD_DURATION, LOW_DURATION);
    }

    /**
    * @dev function to check whether QR code is valid and authorizes to unlock door
    * Pass address of function caller to data contract to enable role modifier
    */
    function checkAccess(bytes32 _key) external requireBackend
    {
        no1s1Data.checkAccess(_key, GOOD_DURATION, LOW_DURATION);
    }

    /**
    * @dev function triggered by back-end shortly after access() function with sensor feedback
    * Pass address of function caller to data contract to enable role modifier
    */
    function checkActivity(bool _pressureDetected, bytes32 _key) external requireBackend
    {
        no1s1Data.checkActivity(_pressureDetected, _key);
    }

    /**
    * @dev function triggered by user after leaving no1s1. resets the occupancy state, pays back escrow, and sends out confirmation NFT
    */
    function exit(bool _doorOpened, string calldata _username, uint256 _actualDuration) external
    {
        no1s1Data.exit(_doorOpened, msg.sender, _username, _actualDuration, MEDITATION_PRICE);
    }

    // call from data contract
    function isDataContractOperational() external view returns(bool)
    {
        return no1s1Data.isOperational();
    }

    /**
    * @dev Get operating status of no1s1 (main state variables)
    */
    function howAmI() external view returns (bool, bool, uint256, uint256, uint256, uint256)
    {
        return no1s1Data.howAmI();
    }

    /**
    * @dev Get address of no1s1
    */
    function whoAmI() external view returns(address)
    {
        return no1s1Data.whoAmI();
    }

    /**
    * @dev Get balance of no1s1
    */
    function howRichAmI() external view returns(uint256)
    {
        return no1s1Data.howRichAmI();
    }

    /**
    * @dev get latest entries of UsageLog (max 10)
    */
    function getUsageLog() external view returns(uint256[] memory, uint256[] memory, uint256[] memory)
    {
        return no1s1Data.getUsageLog();
    }

    /**
    * @dev retrieve values needed to buy meditation time
    */
    function checkBuyStatus() external view returns(uint256, uint256, uint256 , uint256)
    {
        return no1s1Data.checkBuyStatus(MEDITATION_PRICE);
    }

    /**
    * @dev retrieve the latest technical logs
    */ 
    function checkLastTechLogs() external view returns(uint256, uint256, uint256, uint256, uint256)
    {
        return no1s1Data.checkLastTechLogs();
    }

    /**
    * @dev retrieve user information with key (QR code)
    */ 
    function checkUserKey(bytes32 _key) external view returns(uint256, bool, uint256)
    {
        return no1s1Data.checkUserKey(_key);
    }

    /**
    * @dev retrieve user information with username
    */ 
    function checkUserName(string calldata _username) external view returns(bytes32, uint256, bool, uint256)
    {
        return no1s1Data.checkUserName(msg.sender, _username);
    }

}

/********************************************************************************************/
/*                                     Interface to Data Contract                           */
/********************************************************************************************/

//visibility (also in data contract) must be `external` and signature of functions must match!
interface No1s1Data {
    function setAccessabilityStatus(bool mode) external;
    function setOccupationStatus(bool mode) external;
    function broadcastData(uint256 _Bcurrent,uint256 _Bvoltage, uint256 _BSOC,uint256 _Pvoltage, uint256 _Senergy, uint256 _Time, uint256 FULL_VALUE, uint256 GOOD_VALUE, uint256 LOW_VALUE) external;
    function no1s1InfoLog(uint256 _Time) external;
    function buy(uint256 _selectedDuration, address txSender, string calldata _username, uint256 ESCROW_AMOUNT, uint256 MAX_DURATION, uint256 GOOD_DURATION, uint256 LOW_DURATION) external payable;
    function checkAccess(bytes32 _key, uint256 GOOD_DURATION, uint256 LOW_DURATION) external;
    function checkActivity(bool _pressureDetected, bytes32 _key) external;
    function exit(bool _doorOpened, address txSender, string calldata _username, uint256 _actualDuration, uint256 MEDITATION_PRICE) external;
    function isOperational() external view returns(bool);
    function howAmI() external view returns (bool, bool, uint256, uint256, uint256, uint256);
    function whoAmI() external view returns(address);
    function howRichAmI() external view returns(uint256);
    function getUsageLog() external view returns(uint256[] memory, uint256[] memory, uint256[] memory);
    function checkBuyStatus(uint256 MEDITATION_PRICE) external view returns(uint256, uint256, uint256 , uint256);
    function checkLastTechLogs() external view returns(uint256, uint256, uint256, uint256, uint256);
    function checkUserKey(bytes32 _key) external view returns(uint256, bool, uint256);
    function checkUserName(address, string calldata _username) external view returns(bytes32, uint256, bool, uint256);
}
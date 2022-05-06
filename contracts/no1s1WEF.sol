pragma solidity >=0.5.16;

// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/************************************************** */
/* no1s1 Data Smart Contract                        */
/************************************************** */

// TODO: is ERC721

contract no1s1WEF {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;             // Account used to deploy contract becomes contract admin
    bool private operational = true;           // Main operational state of smart contract. Blocks all state changes throughout the contract if false

    // no1s1 main state variables
    bool no1s1Accessability;                   // Whether no1s1 is accessible
    bool no1s1Occupation;                      // Whether no1s1 is occupied

    // Usage variables
    uint256 private constant MEDITATION_PRICE = 0.001 ether;    // Price per minute meditation in no1s1
    uint256 private constant ESCROW_AMOUNT = 0.1 ether;         // Minimum escrow amount to be paid to meditate

    // User and Usage duration counters
    uint256 counterUsers;
    uint256 counterDuration;
    // Escrow balance
    uint256 escrowBalance;

    // Data structure of no1s1 users
    struct No1s1User {
        address user;
        bool accessed;
        uint256 paidEscrow;
    }

    // Arrays
    uint[] public UsageTimeLog;                             // Array to store history of usage time logs with struct UsageLog

    // Mappings (key value pairs)
    mapping(bytes32 => No1s1User) no1s1Users;               // Mapping to store authorized no1s1 users

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // Emitted when access suceeded
    event accessSuceeded(bool accessGranted);
    // Emitted when user left and escrow got refunded
    event refundSuccessful(uint256 price, uint256 amountReturned);

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/
    
    /**
    * @dev Constructor
    *      Deploying the no1s1Data contract and the NFT contract for the no1s1 access token
    *      The deploying account becomes contractOwner
    */
    constructor()
    {
        contractOwner = msg.sender;
        // Initiate state variables
        no1s1Accessability = true;
        no1s1Occupation = true;
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

    /********************************************************************************************/
    /*               SMART CONTRACT FUNCTIONS                                                   */
    /********************************************************************************************/

    /**
    * @dev function to modify the main state variable no1s1Accessability. This function is only for admins (not callable from app contract) to reset this state.
    */
    function setAccessabilityStatus(bool mode) external requireIsOperational
    {
        no1s1Accessability = mode;
    }

    /**
    * @dev function to modify the main state variable no1s1Occupation. This function is only for admins (not callable from app contract) to reset this state in case exiting the space is not detected
    */
    function setOccupationStatus(bool mode) external requireIsOperational
    {
        no1s1Occupation = mode;
    }

    /**
    * @dev buy function that is triggered from backend when scanning a valid QR code, opens door
    */
    function buy(bytes32 _key) external payable requireIsOperational checkAccessability checkOccupancy
    {
        // check whether no1s1 is accessible and not occupied (modifiers in function headers)
        // check if the sent amount is sufficient to cover the escrow
        require(msg.value >= ESCROW_AMOUNT, "Not enough Ether provided.");
        // add no1s1 user, change accessed to true, update escrow paid
        no1s1Users[_key] = No1s1User({
            user: msg.sender,
            accessed: true,
            paidEscrow: msg.value
        });
        // Update total escrow balance
        escrowBalance = escrowBalance.add(msg.value);
        // update occupancy status so noone else can access
        no1s1Occupation = false;
        // emit event to unlock door
        emit accessSuceeded(true);
    }

    /**
    * @dev function triggered by backend or user when user left no1s1. Resets the occupancy state and refunds escrow.
    */
    // careful with input format of _actualDuration: needs to be minutes!
    function exit(bool _doorOpened, uint256 _actualDuration, bytes32 _key) external requireIsOperational
    {
        // check whether user has accessed
        require(no1s1Users[_key].accessed == true, "The user has not meditated yet!");
        // check whether user left.
        require(_doorOpened == true, "The user has not left the space yet!");
        // update occupancy state
        no1s1Occupation = true;
        // update counters
        counterUsers = counterUsers.add(1);
        counterDuration = counterDuration.add(_actualDuration);
        // Update usageTime array
        UsageTimeLog.push(_actualDuration);
        // calculate price for the entered duration
        uint256 price = _actualDuration.mul(uint256(MEDITATION_PRICE));
        // Update total escrow balance
        uint256 escrow = no1s1Users[_key].paidEscrow;
        escrowBalance = escrowBalance.sub(escrow);
        // Calculate amount to return
        uint256 amountToReturn = uint256(escrow).sub(uint256(price));
        // check if payable duration is smaller then escrow
        if (escrow <= price) {
            // reset user state
            no1s1Users[_key] = No1s1User({
                user: address(0),
                accessed: false,
                paidEscrow: 0
            });
            amountToReturn = 0;
        }
        else {
            address refundAddress = no1s1Users[_key].user;
            // reset user state
            no1s1Users[_key] = No1s1User({
                user: address(0),
                accessed: false,
                paidEscrow: 0
            });
            // send remaining escrow balance back to buyer
            payable(refundAddress).transfer(amountToReturn);
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
    function howAmI() external view returns (uint256 totalUsers, uint256 totalDuration, uint256 myBalance)
    {
        return (counterUsers, counterDuration, address(this).balance);
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
    * @dev get the array usageTimeLog
    */
    function getUsageLog() external view returns(uint[] memory usageTimeLog)
    {
        return (UsageTimeLog);
    }

    /**
    * @dev retrieve user information with key (QR code)
    */ 
    function checkUserKey(bytes32 _key) external view returns(address user,bool accessed, uint256 escrow)
    {
        return (no1s1Users[_key].user, no1s1Users[_key].accessed, no1s1Users[_key].paidEscrow);
    }


    /********************************************************************************************/
    /*                                SMART CONTRACT FALLBACK FUNCTION                         */
    /********************************************************************************************/

    /**
    * @dev Payable fallback function to enable the contract to receive direct payments.
    */
    fallback () external payable requireIsOperational {}

}
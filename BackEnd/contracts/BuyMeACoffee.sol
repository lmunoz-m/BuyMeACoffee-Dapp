//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//* BuyMeACoffe deployed to:  0xb160c561FECc55e153e2910d594f6be831011097

contract BuyMeACoffee {
    //* Event to emit when a Memo is created
    event NewMemo(
        address indexed from,        
        uint256 timestamp,
        string name,
        string message
    );

    //* Struct for Memo
    struct Memo {
        address from;        
        uint256 timestamp;
        string name;
        string message;
    }

    //* Array of all memos received
    Memo[] memos_list;

    //* Address of contract deployer
    address payable owner;

    //* Variable for random number
    //uint256 randNumber;
    //* Deploy Logic
    constructor() {
        owner = payable(msg.sender);
    }

    /*
     * @dev buy a coffee for contract owner
     * @param _name name of the coffe buyer
     * @param _message a message from the coffe buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "You can't buy me a coffe with 0 eth");
       // randNumber = random();
        //* Add the memo to the list
        memos_list.push(Memo(msg.sender, block.timestamp, _name, _message ));

        //* Emit a log event when a new memo is created!
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /*
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /*
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos_list;
    }
}
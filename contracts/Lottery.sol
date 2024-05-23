// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lottery {
    struct Participant {
        string name;
        address participantAddress;
        uint256 amount;
    }

    address private owner;
    Participant[] private participants;
    uint256 public constant requiredPayment = 0.05 ether;

    mapping(address => bool) public participantExists;

    event ParticipantAdded(string name, address participantAddress, uint256 amount);
    event WinnerSelected(string name, address winnerAddress, uint256 amountWon);

    constructor() {
        owner = msg.sender;
    }

    function participate(string memory name) public payable {
        require(msg.value >= requiredPayment, "Please pay atleast or more than 0.05 ETH");
        require(!participantExists[msg.sender], "You cannot participate twice for the lottery");

        participantExists[msg.sender] = true;
        participants.push(Participant(name, msg.sender, msg.value));
        emit ParticipantAdded(name, msg.sender, msg.value);
    }

    function getParticipants() public view returns (Participant[] memory) {
        require(msg.sender == owner, "Only owner can access the participants");
        return participants;
    }

    function chooseWinner(address winner) public payable {
        require(msg.sender == owner, "Only owner can pick the winner");

        Participant memory selectedWinner;
        bool found = false;

        for (uint i = 0; i < participants.length; i++) {
            if (participants[i].participantAddress == winner) {
                selectedWinner = participants[i];
                found = true;
                break;
            }
        }

        require(found == true, "Winner not found in registrations");

        uint256 balanceToSend = address(this).balance;
        payable(winner).transfer(balanceToSend);

        emit WinnerSelected(selectedWinner.name, winner, address(this).balance);
        deleteParticipants();
    }

    function getPrizePool() public view returns (uint256) {
        return address(this).balance;
    }

    function deleteParticipants() internal {
        for (uint i = 0; i < participants.length; i++) {
            delete participantExists[participants[i].participantAddress];
        }
        delete participants;
    }

    function getOwner() public view returns (address) {
        require(msg.sender == owner, "Only owner can access this method");
        return owner;
    }
}
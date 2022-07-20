// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Staking {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    uint256 public s_totalSupply;
    uint256 public limitOfStake = 10;

    struct Staker {
        address userAddress;
        uint256 amount;
        uint256 blockNumber;
        uint256 stakeTime;
    }

    // Staker[] public stakes;

    mapping(address => Staker[]) public stakes;
    mapping(address => uint256) public staker_balance;

    constructor(address _stakeToken, address _rewardToken) {
        stakingToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
    }

    function stake(uint256 amount, uint256 timeInSeconds) public {
        require(amount > 0, "Please Enter Amount");
        require(stakes[msg.sender].length < limitOfStake, "Limit Exceed");
        s_totalSupply += amount;
        staker_balance[msg.sender] += amount;
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender].push(
            Staker({
                userAddress: msg.sender,
                amount: amount,
                blockNumber: block.number,
                stakeTime: block.timestamp + timeInSeconds
            })
        );

        console.log(stakes[msg.sender].length);
    }

    function reward(address _address) public view returns (uint256) {
        uint256 total;
        for (uint256 i = 0; i < stakes[_address].length; i++) {
            if (stakes[_address][i].userAddress == _address) {
                uint256 rew = block.number - stakes[_address][i].blockNumber;
                total += rew;
            }
        }

        return total * 1 ether;
    }

    function claimedReward() public {
        uint256 rew = reward(msg.sender);
        require(rew > 0, "You Don't have Reward");
        rewardToken.transfer(msg.sender, rew);
        for (uint256 i = 0; i < stakes[msg.sender].length; i++) {
            if (
                stakes[msg.sender][i].userAddress == msg.sender &&
                stakes[msg.sender][i].stakeTime > block.timestamp
            ) {
                stakes[msg.sender][i].blockNumber = block.number;
            }
        }
    }

    function withdraw(uint256 index) public {
        Staker storage todo = stakes[msg.sender][index];
        require(block.timestamp > todo.stakeTime, "Can't Withdraw Yet");
        require(todo.userAddress == msg.sender, "Only Owner Can Withdraw");
        stakingToken.transfer(msg.sender, todo.amount);
        staker_balance[msg.sender] -= todo.amount;
        delete stakes[msg.sender][index];
    }
}

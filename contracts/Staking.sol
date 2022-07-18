// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {

    IERC20 public stakingToken;
    IERC20 public rewardToken;
    uint256 public s_totalSupply;

    mapping(address => uint256) public sTake_balances;
    mapping(address => uint256) public blockTimeStart;


       constructor(address _stakeToken,address _rewardToken) {
        stakingToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
    }

    function stake(uint256 amount) public {
        require(amount > 0,"Please Enter Amount");
        sTake_balances[msg.sender] += amount;
        s_totalSupply += amount;
        blockTimeStart[msg.sender] = block.number;
        stakingToken.transferFrom(msg.sender, address(this), amount);
    }


    function reward(address _address) public view returns(uint256){
         return (block.number - blockTimeStart[_address]) * 1 ether;
        
    }

    function claimedReward () public {
        uint256 rew = reward(msg.sender);
        require(rew > 0,"You Don't have Reward");
        rewardToken.transfer(msg.sender, rew);
        blockTimeStart[msg.sender] = block.number;
    }
    function withdraw(uint256 amount) public {
        require(sTake_balances[msg.sender] >= amount , "You Don't have enough Ether");
        sTake_balances[msg.sender] -= amount;
        s_totalSupply -= amount;
        stakingToken.transfer(msg.sender, amount);
    }
}
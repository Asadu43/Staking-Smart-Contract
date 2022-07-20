const { network, ethers, deployments } = require("hardhat")
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { RewardToken} from "../../typechain";

let staking: Contract;
let rewardToken: RewardToken;
let deployer: any;
let user: any;
let stakeAmount: any;

describe.only("Staking TEST", async function () {


  before(async function () {
    const accounts = await ethers.getSigners()
    deployer = await accounts[0]
    user = await accounts[1]

    const MasterInstance = await ethers.getContractFactory("RewardToken");
    rewardToken = await MasterInstance.deploy();
    const Staking = await ethers.getContractFactory("Staking")

    staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    stakeAmount = ethers.utils.parseEther("100000")
  })


  async function increaseTime(n: any): Promise<void> {
    for (let index = 0; index < n; index++) {
      await ethers.provider.send('evm_mine');
    }

  }


  it("Approve Token ", async function () {
    // console.log(rewardToken.functions)
    await rewardToken.approve(staking.address, stakeAmount)
  })

  interface IStakes {
    userAddress:string,
    amount:BigNumber,
    blockNumber:BigNumber;
  }

  it("Stake Token ", async function () {
    await staking.connect(deployer).stake(ethers.utils.parseEther("100"),120) // 100000 tokens
    // increaseTime(20)
    await staking.connect(deployer).stake(ethers.utils.parseEther("200"),160) // 100000 tokens
    // increaseTime(20)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280) // 100000 tokens

    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)
    await staking.connect(deployer).stake(ethers.utils.parseEther("300"),280)


    await expect( staking.connect(deployer).stake(ethers.utils.parseEther("100"),100)).to.revertedWith("Limit Exceed")
   
  })




  it("REWARD Token ", async function () {
    increaseTime(200)
    // console.log(await staking.connect(deployer).claimedReward())
    console.log(await staking.reward(deployer.address))
    await staking.connect(deployer).claimedReward()
  })


  it("User Don't have Reward", async function () {
    await expect(staking.connect(user).claimedReward()).to.revertedWith("You Don't have Reward")
  })

  it("REWARD Two", async function () {
    console.log(await staking.reward(deployer.address))
    await staking.connect(deployer).claimedReward()
  })

  it("WithDraw ", async function () {
    await staking.connect(deployer).withdraw(0)
    expect(await staking.staker_balance(deployer.address)).to.be.equal(ethers.utils.parseEther("2600"))
  })

})
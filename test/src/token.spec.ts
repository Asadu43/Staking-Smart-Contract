const { network, ethers, deployments } = require("hardhat")
import { Contract } from "ethers";
import { RewardToken, RewardToken__factory } from "../../typechain";

let staking:Contract;
let rewardToken:RewardToken;
let deployer:any;
let stakeAmount:any;

describe("Staking Test", async function () {
    

    before(async function () {
        const accounts = await ethers.getSigners()
        deployer = await accounts[0]

        const MasterInstance = await ethers.getContractFactory("RewardToken");
         rewardToken = await MasterInstance.deploy();
       const Staking = await ethers.getContractFactory("Staking")

       staking = await Staking.deploy(rewardToken.address,rewardToken.address);
        stakeAmount = ethers.utils.parseEther("100000")
    })


    async function increaseTime(duration: number): Promise<void> {
      ethers.provider.send("evm_increaseTime", [duration]);
      ethers.provider.send("evm_mine", []);
    }


    it("Approve Token ", async function () {
      console.log(rewardToken.functions)
        await rewardToken.approve(staking.address, stakeAmount)
    })

    it("Stake Token ", async function () {
      await staking.stake(stakeAmount) // 100000 tokens
      const startingEarned = await staking.earned(deployer.address)
      console.log(`Starting Earned ${startingEarned} tokens`)
    })


    it("Staked Token ", async function () {
      // console.log(await staking.getStaked(deployer.address))
        await staking.getStaked(deployer.address)
    })

    it("Should allow users to stake and claim rewards", async function () {
        await increaseTime(86400)
        await increaseTime(1)
        const endingEarned = await staking.earned(deployer.address)
        console.log(`Ending Earned ${endingEarned} tokens`)
    })

    it("Reward Token ", async function () {
      console.log(await staking.s_rewards(deployer.address))
      console.log(await staking.s_userRewardPerTokenPaid(deployer.address))
      console.log(await staking.s_balances(deployer.address))
        await staking.s_rewards(deployer.address)
        await staking.s_userRewardPerTokenPaid(deployer.address)
        await staking.s_balances(deployer.address)
    })
})
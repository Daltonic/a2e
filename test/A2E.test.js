const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe('Contracts', () => {
  let contract, result
  const title = 'First Question'
  const description = 'Update apartment'
  const tags = 'js, php, dalum'
  const price = 2.7

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('AnswerToEarn')
    ;[deployer, owner, commentor1] = await ethers.getSigners()

    contract = await Contract.deploy()
    await contract.deployed()
  })

  describe('Question', () => {
    it('Should confirm question in array', async () => {
      result = await contract.showQuestions()
      expect(result).to.have.lengthOf(0)

      await contract.addQuestion(title, description, tags, {
        value: toWei(price),
      })

      result = await contract.showQuestions()
      expect(result).to.have.lengthOf(1)
    })
  })
})

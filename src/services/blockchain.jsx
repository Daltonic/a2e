import abi from '../abis/src/contracts/AnswerToEarn.sol/AnswerToEarn.json'
import address from '../contracts/contractAddress.json'
import { getGlobalState, setGlobalState } from '../store'
import { ethers } from 'ethers'
import { logOutWithCometChat } from './Chat'

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const { ethereum } = window
const contractAbi = abi.abi
let tx

const getEthereumContract = async () => {
  const currentChainId = ethereum.networkVersion
  const contractAddress = address[currentChainId]
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const contracts = new ethers.Contract(contractAddress, contractAbi, signer)

  return contracts
}

const WalletConnectedStatus = async () => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', function (chainId) {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async function () {
      setGlobalState('connectedAccount', accounts[0])
      await WalletConnectedStatus()
      await logOutWithCometChat().then(() => {
        setGlobalState('currentUser', null)
      })
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      alert('Please connect wallet')
      console.log('No accounts found')
    }
  } catch (err) {
    reportError(err)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (err) {
    reportError(err)
  }
}

const createQuestion = async ({ title, question, tags, prize }) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.addQuestion(title, question, tags, {
      value: toWei(prize),
    })
    await tx.wait()

    await getQuestions()
  } catch (err) {
    reportError(err)
  }
}

const editQuestion = async ({ id, title, question, tags }) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.updateQuestion(id, title, question, tags)
    await tx.wait()

    await getQuestions()
  } catch (err) {
    reportError(err)
  }
}

const deleteQuestion = async (id) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.deleteQuestion(id)
    await tx.wait()

    await getQuestions()
  } catch (err) {
    reportError(err)
  }
}

const createComment = async ({ questionId, commentText }) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.addComment(questionId, commentText)
    await tx.wait()

    await getComments(questionId)
    await getQuestion(questionId)
    await getQuestions()
  } catch (err) {
    reportError(err)
  }
}

const editComment = async ({ questionId, commentId, commentText }) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.updateComment(questionId, commentId, commentText)
    await tx.wait()
    await getComments(questionId)
  } catch (err) {
    reportError(err)
  }
}

const deleteComment = async ({ questionId, commentId }) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    tx = await contract.deleteComment(questionId, commentId)
    tx.wait()

    await getComments(questionId)
  } catch (err) {
    reportError(err)
  }
}

const getQuestions = async () => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    const questions = await contract.showQuestions()
    setGlobalState('questions', structuredQuestion(questions))
  } catch (err) {
    reportError(err)
  }
}

const getQuestion = async (questionId) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    const question = await contract.showQuestion(questionId)
    setGlobalState('question', structuredQuestion([question])[0])

    await getComments(questionId)
  } catch (err) {
    reportError(err)
  }
}

const getComments = async (questionId) => {
  try {
    if (!ethereum) return alert('Please install metamask')
    const contract = await getEthereumContract()

    const comments = await contract.getComments(questionId)
    setGlobalState('comments', structuredComment(comments))
  } catch (err) {
    reportError(err)
  }
}

const structuredQuestion = (questions) =>
  questions
    .map((question) => ({
      id: question.id.toNumber(),
      title: question.questionTitle,
      description: question.questionDescription,
      owner: question.owner.toLowerCase(),
      createdAt: Number(question.created + '000'),
      updated: Number(question.updated + '000'),
      answers: question.answers.toNumber(),
      prize: fromWei(question.prize),
      tags: question.tags,
      paidout: question.paidout,
      winner: question.winner.toLowerCase(),
      refunded: question.refunded,
    }))
    .reverse()

const structuredComment = (comments) =>
  comments
    .map((comment) => ({
      id: comment.id.toNumber(),
      questionId: comment.questionId.toNumber(),
      commentText: comment.commentText,
      owner: comment.owner.toLowerCase(),
      deleted: comment.deleted,
      createdAt: Number(comment.created + '000'),
      updatedAt: Number(comment.updated + '000'),
    }))
    .reverse()

const payWinner = async (questionId, commentId) => {
  try {
    if (!ethereum) return alert('Please install metamask')

    const contract = await getEthereumContract()
    const connectedAccount = getGlobalState('connectedAccount')

    tx = await contract.payBestComment(questionId, commentId, {
      from: connectedAccount,
    })
    await tx.wait()

    await getComments(questionId)
    await getQuestion(questionId)
    await getQuestions()
  } catch (err) {
    reportError(err)
  }
}

export {
  getEthereumContract,
  WalletConnectedStatus,
  connectWallet,
  createQuestion,
  editQuestion,
  deleteQuestion,
  createComment,
  editComment,
  deleteComment,
  getQuestions,
  getQuestion,
  getComments,
  payWinner,
}

import { createGlobalState } from "react-hooks-global-state";
import moment from 'moment';


const {setGlobalState, useGlobalState, getGlobalState} = createGlobalState({
    addModal: "scale-0",
    updateModal: "scale-0",
    addComment: "scale-0",
    deleteQuestionModal: "scale-0",
    deleteCommentModal: "scale-0",
    updateCommentModal: "scale-0",
    chatModal:'scale-0',
    chatCommandModal:'scale-0',
    authChatModal:'scale-0',
    paymentModal: 'scale-0',
    connectedAccount:'',
    questions:[],
    question:null,
    singleQuestion:null,
    comments:[],
    comment:null,
    contract:null,
    group:null,
    currentUser:null,
    messages:[]
})

const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}

const daysRemaining = (days) => {
  const todaysdate = moment()
  days = Number((days + '000').slice(0))
  days = moment(days).format('YYYY-MM-DD')
  days = moment(days)
  days = days.diff(todaysdate, 'days')
  return days == 1 ? '1 day' : days + ' days'
}

function returnTime(timestamp) {
		    const currentTime = new Date();
		    let difference = currentTime - timestamp;
		    let seconds = Math.floor(difference / 1000);
		    let minutes = Math.floor(seconds / 60);
		    let hours = Math.floor(minutes / 60);
		    let days = Math.floor(hours / 24);
		    let weeks = Math.floor(days / 7);
		    let months = Math.floor(weeks / 4);
		    let years = Math.floor(months / 12);

		    if (seconds < 60) {
		        return seconds + (seconds === 1 ? ' second' : ' seconds');
		    } else if (minutes < 60) {
		        return minutes + (minutes === 1 ? ' minute' : ' minutes');
		    } else if (hours < 24) {
		        return hours + (hours === 1 ? ' hour' : ' hours');
		    } else if (days < 7) {
		        return days + (days === 1 ? ' day' : ' days');
		    } else if (weeks < 4) {
		        return weeks + (weeks === 1 ? ' week' : ' weeks');
		    } else if (months < 12) {
		        return months + (months === 1 ? ' month' : ' months');
		    } else {
		        return years + (years === 1 ? ' year' : ' years');
		    }
}









export {setGlobalState, useGlobalState, getGlobalState , truncate, daysRemaining, returnTime}
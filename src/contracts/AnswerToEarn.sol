//SPDX-License-Identifier:MIT
pragma solidity >= 0.7.0 < 0.9.0;

contract AnswerToEarn {
    
   struct QuestionStruct {
        uint id;
        string questionTitle;
        string questionDescription;
        address owner;
        address winner;
        bool paidout;
        bool refunded;
        bool deleted;
        uint updated;
        uint created;
        uint answers;
        string tags;
        uint256 prize;
    }

    struct CommentStruct {
        uint id;
        uint questionId;
        string commentText;
        address owner;
        bool deleted;
        uint created;
        uint updated;
    }

    event Action (
        uint id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );

    modifier ownerOnly() {
        require(msg.sender == owner,"Reserved for owner only");
        _;
    }

    address public owner;
    uint256 public platformCharge = 5;
    uint public totalQuestion;

    mapping(uint => bool) questionExists;
    mapping(uint => CommentStruct[]) commentsOf;

    QuestionStruct[] public questions;

    constructor() {
        owner = msg.sender;
    }

    function addQuestion(
        string memory questionTitle,
        string memory questionDescription,
        string memory tags
    ) public payable {
        require(bytes(questionTitle).length > 0,"Fill up empty fields");
        require(bytes(questionDescription).length > 0,"Fill up empty fields");
        require(bytes(tags).length > 0,"Fill up empty fields");
        require(msg.value > 0 ether, "Insufficient fund");

        QuestionStruct memory question;
        questionExists[questions.length] = true;
        totalQuestion++;

        question.id = questions.length;
        question.questionTitle = questionTitle;
        question.questionDescription = questionDescription;
        question.tags = tags;
        question.prize = msg.value;
        question.owner = msg.sender;
        question.updated = block.timestamp;
        question.created = block.timestamp;

        questions.push(question);

        emit Action (
            questions.length,
            "Question created",
            msg.sender,
            block.timestamp
       );
    }

    function updateQuestion(
      uint id,
      string memory questionTitle,
      string memory questionDescription,
      string memory tags
    ) public  returns(bool) {
        require(questionExists[id] == true,"Question does not exist or have been removed!");
        require(bytes(questionTitle).length > 0,"Fill up empty fields");
        require(bytes(tags).length > 0,"Fill up empty fields");
        require(bytes(questionDescription).length > 0,"Fill up empty fields");
        require(msg.sender == questions[id].owner , "Invalid action!");


        questions[id].questionTitle = questionTitle;
        questions[id].tags = tags;
        questions[id].questionDescription = questionDescription;
        questions[id].updated = block.timestamp;

        emit Action (
            id,
            "Question updated",
            msg.sender,
            block.timestamp
       );

        return true;
    }


    function deleteQuestion(uint id) public  returns (bool) {
        require(msg.sender == questions[id].owner , "Invalid action!");
        require(questionExists[id] == true,"Question does not exist or have been removed!");

        totalQuestion--;
        questions[id].deleted = true;
        questionExists[id] = false;

        emit Action (
            id,
            "Question deleted",
            msg.sender,
            block.timestamp
       );

        return true;
    }
 

    function showQuestions() public view returns(QuestionStruct[] memory propQuestion) {
        uint count = 0;
        for(uint i = 0; i < questions.length; i++) {
            if(!questions[i].deleted) {
                count++;
            }
        }
        propQuestion = new QuestionStruct[](count);
        uint index = 0;
        for(uint i = 0; i < questions.length; i++) {
            if(!questions[i].deleted) {
                propQuestion[index] = questions[i];
                index++;
            }
        }
    }


    function showQuestion(uint id) public view returns(QuestionStruct memory ) {
        return questions[id];
    }

    function isQuestionOwner(uint id) public view returns (bool) {
        return msg.sender == questions[id].owner;
    }

    function addComment(
        uint questionId,
        string memory _commentText
    ) public returns (bool) {
        require(bytes(_commentText).length > 1,"Required field!");
        require(questionExists[questionId] == true,"Question does not exist or have been removed!");

        CommentStruct memory comment;

        comment.id = commentsOf[questionId].length;
        comment.questionId = questionId;
        comment.commentText = _commentText;
        comment.owner = msg.sender;
        comment.created = block.timestamp;
        comment.updated = block.timestamp;
        questions[questionId].answers++;
        commentsOf[questionId].push(comment);

        emit Action (
            comment.id,
            "comment created",
            msg.sender,
            block.timestamp
       );
        return true;
    } 

    function updateComment(
        uint questionId,
        uint id,
        string memory _commentText
    ) public returns (bool) {
       require(questionExists[questionId], "Question not found");
       require(msg.sender == commentsOf[questionId][id].owner, "Unauthorized entity");
       require(bytes(_commentText).length > 0,"Required field!");

       commentsOf[questionId][id].commentText = _commentText;
       commentsOf[questionId][id].updated = block.timestamp;

        emit Action (
            id,
            "comment updated",
            msg.sender,
            block.timestamp
       );

        return true;
    }

    function deleteComment(uint questionId, uint id) public returns (bool) {
        require(questionExists[questionId], "Question not found");
        require(msg.sender == commentsOf[questionId][id].owner, "Unauthorized entity");

        commentsOf[questionId][id].deleted = true;
        commentsOf[questionId][id].updated = block.timestamp;
        questions[questionId].answers--;

        emit Action (
            id,
            "comment deleted",
            msg.sender,
            block.timestamp
       );
        return true;
    }

    function getComments(uint questionId) public view returns(CommentStruct[] memory) {
        return commentsOf[questionId];
    }

    function getcomment(uint questionId,uint id) public view returns(CommentStruct memory) {
        return commentsOf[questionId][id];
    }

    function isCommentOwner(uint id,uint questionId) public view returns (bool) {
        return msg.sender == commentsOf[questionId][id].owner;
    }

    function payBestComment(uint questionId, uint id) public {
        require(questionExists[questionId], "Question not found");
        require(!questions[questionId].paidout, "Question already paid out");
        require(msg.sender == questions[questionId].owner, "Unauthorized entity");

        uint256 reward = questions[questionId].prize;
        uint256 tax = reward * platformCharge / 100;
        address winner = commentsOf[questionId][id].owner;
        questions[questionId].paidout = true;
        questions[questionId].winner = winner;
        
        payTo(winner, reward - tax);
        payTo(owner, tax);
    }

    function refund(uint questionId) public {
        require(questionExists[questionId], "Question not found");
        require(!questions[questionId].paidout, "Question already paid out");
        require(!questions[questionId].refunded, "Owner already refunded");
        require(msg.sender == questions[questionId].owner, "Unauthorized entity");

        uint256 reward = questions[questionId].prize;
        questions[questionId].refunded = true;
        
        payTo(questions[questionId].owner, reward);
    }

    function payTo(address to, uint amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function changeFee(uint256 fee) public {
        require(msg.sender == owner, "Unauthorized entity");
        require(fee > 0 && fee <= 100, "Fee must be between 1 - 100");
        platformCharge = fee;
    }
}
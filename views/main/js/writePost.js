// Fetching Date
var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();
var output = d.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;
// Post the question -> sent to node js for storing question in database.
$(document).ready(function(){
    $("#sendQues").click(function(){
        if($('#ques').val() == ""){
            alert("Add your question buddy!");
            return;
        }
        $.post("/publishPost",
        {
            ques: $("#ques").val(),
            tags:$("#tags").val(),
            name: $("#name").text(),
            upvotes: 0,
            downvotes: 0,
            dateOfPublish: output
        });
            alert("Question Sucessfully Submitted");
    });
    $('.addComment').on('click', function (event) {
        $(this).next('.myCommentDiv').toggle('swing');
    });
});
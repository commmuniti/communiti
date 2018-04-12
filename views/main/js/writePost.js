// Fetching Date
var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();
var output = d.getFullYear() + '/' +
    (month<10 ? '0' : '') + month + '/' +
    (day<10 ? '0' : '') + day;

function btnClick(foo, bar){
    alert(foo);
    var x = document.getElementById(foo).getAttribute("qcom");
    var cont = document.getElementById(x).value;
    $.post("/publishComment",
        {
            content: cont,
            ques_id: foo,
            name: document.getElementById("name").innerHTML,
            likes: 0,
            dislikes: 0,
            dateOfPublish: output
        });
    alert("Comment published! \n Refresh the page!");
    location.reload();
}

// Post the question -> sent to node js for storing question in database.
$(document).ready(function(){
    $("#sendQues").click(function(){
        $.post("/publishPost",
        {
            ques: $("#ques").val(),
            tags: $("#tags").val(),
            name: $("#name").text(),
            upvotes: 0,
            downvotes: 0,
            dateOfPublish: output
        });
        alert("Question published! \n Refresh the page!");
        $("#ques").val('');
        tags: $("#tags").val('');
        $(".fques").toggle('swing');
        location.reload();
    });
    // $(".postComment").click(function(){
    //     var x = $(".postComment").text();
    //     alert(x);
    //     alert($(x).val());
    //     // $.post("/publishComment",
    //     // {
    //     //     content: $(".curr-comment").val(),
    //     //     ques: $(".postComment").text(),
    //     //     name: $("#name").text(),
    //     //     likes: 0,
    //     //     dislikes: 0,
    //     //     dateOfPublish: output
    //     // });
    //     // alert("Comment published! \n Refresh the page!");
    //     // location.reload();
    // });
    $(".btn-group > .btn").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
    });
    $('.addComment').on('click', function (event) {
        $(this).next('.myCommentDiv').toggle('swing');
    });
    $('.addQues').on('click', function (event) {
        $(this).next(".fques").toggle('swing');
    });
});


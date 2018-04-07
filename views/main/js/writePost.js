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
            $.post("/publishPost",
            {
              ques: $("#ques").text(),
              name: $("#name").text(),
              upvotes: 0,
              downvotes: 0,
              dateOfPublish: output
            });
			  alert("Question Sucessfully Submitted");
        });
    });
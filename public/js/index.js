// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
let selectedStudentId;
var handleLessonExpand = function () {
  var id = $(this).attr("data-id");
  $(".lesson").css("background-color", "white");
  $(this).css("background-color", "whitesmoke");

  $(".lesson-body").css("display", "none");
  $("#" + id + "-lesson").css("display", "block");
};

var handleStudentExpand = function () {
  var id = $(this).attr("data-id");
  selectedStudentId = id;
  $("#students-container").css("visibility", "visible");
  $(".student").css("background-color", "white");
  $(".lesson").css("background-color", "white");
  $(this).css("background-color", "whitesmoke");

  $(".student-body").css("display", "none");
  $(".lesson-body").css("display", "none");
  $("#" + id + "-student").css("display", "block");
};

// Add event listeners to the submit and delete buttons
$(document).on("click", ".lesson", handleLessonExpand);
$(document).on("click", ".student", handleStudentExpand);

$("#password, #confirm_password").on("keyup", function () {
  if ($("#password").val() === $("#confirm_password").val()) {
    $("#message")
      .html("Matching")
      .css("color", "green");
  } else {
    $("#message")
      .html("Not Matching")
      .css("color", "red");
  }
});

$(function () {
  // toggles the display for student modal
  $(document).on("click", "#student-modal", function (event) {
    event.preventDefault();
    // show the modal
    // console.log(event);
    $("#addStudentModal").css("display", "flex");
  });

  $(document).on("click", "#update-student-modal", function (event) {
    event.preventDefault();
    // show the modal
    // console.log(event);

    $("#updateStudentModal").css("display", "flex");
  });

  // toggles the display for lesson modal
  $(document).on("click", "#lesson-modal", function (event) {
    event.preventDefault();
    // show the modal
    $("#addLessonModal").css("display", "flex");
  });

  // event handler to add a student
  $(document).on("click", "#add-student", function () {
    // console.log(event);
    let firstName = $("#first-name")
      .val()
      .trim();
    let lastName = $("#last-name")
      .val()
      .trim();
    let password = $("#new-password")
      .val()
      .trim();
    // Will need to validate eventually
    let email = $("#new-email")
      .val()
      .trim();
    let phone = $("#new-phone")
      .val()
      .trim();
    let notes = $("#new-notes")
      .val()
      .trim();

    let body = {
      firstName,
      lastName,
      password,
      email,
      phone,
      notes
    };
    let url = "/api/student";

    $.ajax({
      method: "POST",
      url,
      data: body
    }).then(res => {
      if (res) {
        document.location.reload(true);
      }
    })
      .catch(err => {
        if (err) {
          return;
        }
      });

    // hide modal
    $("#addStudentModal").hide();
  });

  // event handler to add a lesson
  $(document).on("click", "#add-lesson", function (event) {
    event.preventDefault();
    let topic = $("#topic")
      .val()
      .trim();
    let content = $("#content")
      .val()
      .trim();

    let body = {
      topic,
      body: content,
      StudentId: selectedStudentId
    };

    let url = "/api/lesson";

    // make the ajax request
    $.ajax({
      method: "POST",
      url,
      data: body
    }).then(result => {
      if (result) {
        let { id, topic, body, createdAt, StudentId } = result; //eslint-disable-line
        // append the newly created lesson to the page
        let div = $("<div>");
        div.attr("data-id", id);
        div.addClass("list-group-item lesson");
        let span = $("<span>");
        let h3 = $("<h3>");

        h3.text(topic);
        let p = $("<p>");
        p.addClass("date");
        p.text(createdAt);
        span.append(h3).append(p);

        div.append(span);

        // append to div
        $(`#student-${StudentId}`).append(div); // eslint-disable-line
      }
      // hide the modal
      $("#addLessonModal").hide();
    })
      .catch(err => {
        if (err) {
          return;
        }
      });
  });

  $(document).on("click", "#cancel-modal", function () {
    $("#addStudentModal").hide();
    $("#addLessonModal").hide();
  });

  // Logout
  $(document).on("click", "#logout", function () {
    $.ajax({
      method: "POST",
      url: "/logout"
    })
      .then(response => {
        if (response) {
          document.location.reload(true);
        }
      })
      .catch(err => {
        if (err) {
          return;
        }
      });
  });

  // delete a student
  $(document).on("click", "#delete-student", function () {
    let id = $(this)
      .parent()
      .attr("data-id");

    let url = `/api/student/${id}`; // eslint-disable-line

    $.ajax({
      method: "DELETE",
      url: url
    })
      .then(response => {
        if (response) {
          document.location.reload(true);
        }
      })
      .catch(err => {
        if (err) {
          return;
        }
      });
  });

  // delete a lesson
  $(document).on("click", "#delete-lesson", function () {
    let id = $(this)
      .parent()
      .attr("data-id");

    let url = `/api/lesson/${id}`; // eslint-disable-line

    $.ajax({
      method: "DELETE",
      url: url
    })
      .then(response => {
        if (response) {
          $(this)
            .parent()
            .remove();
          $(`#${id}-lesson`).css("display", "none");
        }
      })
      .catch(err => {
        if (err) {
          return;
        }
      });
  });
});

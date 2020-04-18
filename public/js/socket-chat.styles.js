// @ts-nocheck
/* 
  funciones para renderizar a usuarios
 */

var params = new URLSearchParams(window.location.search);

if (!params.has("name") || !params.has("room")) {
  window.location.href = "/index.html";
  throw new Error("El nombre y la sala son necesarios.");
}

var data = {
  name: params.get("name"),
  room: params.get("room"),
};

var users = $("#divUsers");
var formSend = $("#formSend");
var txtMsg = $("#txtMsg");
var divChatbox = $("#divChatbox");

function renderUsers(persons) {
  // [{},{}}

  let html = "";
  html += "<li>";
  html +=
    '<a href="javascript:void(0)" class="active"> Chat de <span>' +
    data.room +
    "</span></a>";
  html += "</li>";

  for (var i = 0; i < persons.length; i++) {
    html += "<li><a data-id='" + persons[i].id + "' href='javascript:void(0)'>";
    html +=
      "<img src='assets/images/users/1.jpg' alt='user-img' class='img-circle'>";
    html +=
      "<span>" +
      persons[i].name +
      "  <small  class='text-success'>online</small></span>";
    html += "</a></li>";
  }

  users.html(html);
}

function renderMsg(msg, isIm) {
  //console.log(msg)

  let date = new Date(msg.date);
  let time = date.getHours() + ":" + date.getMinutes();

  let classMsg = msg.name === "Administrador" ? "danger" : "info";

  let html = "";

  if (isIm) {

    html += '<li class="reverse animated fadeIn">';
    html += '  <div class="chat-content">';
    html += "    <h5>" + msg.name + "</h5>";
    html += '    <div class="box bg-light-inverse">' + msg.msg + "</div>";
    html += "  </div>";
    html += '  <div class="chat-img">';
    html += '    <img src="assets/images/users/5.jpg" alt="user" />';
    html += "  </div>";
    html += '  <div class="chat-time">' + time + "</div>";
    html += "</li>";

  } else {

    html += '<li class="animated fadeIn">';
    html += '    <div class="chat-img">';

    if (msg.name !== "Administrador") {
    html += '        <img src="assets/images/users/1.jpg" alt="user" />';
    }

    html += "    </div>";
    html += '    <div class="chat-content">';
    html += "        <h5>" + msg.name + "</h5>";
    html += '        <div class="box bg-light-' + classMsg + '">';
    html += msg.msg;
    html += "        </div>";
    html += "    </div>";
    html += '    <div class="chat-time">' + time + "</div>";
    html += "</li>";
  }

  divChatbox.append(html);
}

function scrollBottom() {
  // selectors
  var newMessage = divChatbox.children("li:last-child");

  // heights
  var clientHeight = divChatbox.prop("clientHeight");
  var scrollTop = divChatbox.prop("scrollTop");
  var scrollHeight = divChatbox.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

// Listeners
users.on("click", "a", function () {
  // @ts-ignore
  let id = $(this).data("id");

  if (id) {
    console.log(id);
  }
});

formSend.on("submit", function (e) {
  e.preventDefault();

  if (txtMsg.val().trim().length === 0) {
    return;
  }

  // Enviar mensaje
  socket.emit("createMsg", { user: data.name, msg: txtMsg.val() }, (resp) => {
    if (resp.ok) {
      txtMsg.val("").focus();
      renderMsg(resp.message,true);

      scrollBottom();
    }
  });
});

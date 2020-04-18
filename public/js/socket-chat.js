// @ts-ignore
var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has("name") || !params.has("room")) {
  window.location.href = "/index.html";
  throw new Error("El nombre y la sala son necesarios.");
}

var data = {
    name: params.get('name'),
    room: params.get('room'),
};


socket.on("connect", () => {
  socket.emit("enter-chat", data,(resp)=>{
      console.log('Usuarios conectados',resp)
        renderUsers(resp.data);
  });

});

// desconectado
socket.on("disconnect", () => {
  console.log("Perdimos conexión con el servidor");
});


// Escuchar información del servidor
socket.on("createMsg", (message) => {
  //console.log("chat:", data);
    renderMsg(message,false);
    scrollBottom();

});

//Cuando un usuario entra o sale del chat
socket.on("listPeople", (people) => {
  console.log("Nuevo listado", people);
   renderUsers(people);
});

//Recibir mensaje privado
socket.on("msgPrivate", (msg) => {
  console.log("Nuevo mensaje privado", msg);
});


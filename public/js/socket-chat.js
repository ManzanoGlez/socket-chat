// @ts-ignore
var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has("name") || !params.has("room")) {
  window.location.href = "index.html";
  throw new Error("El nombre y la sala son necesarios.");
}

var data = {
    name: params.get('name'),
    room: params.get('room'),
};


socket.on("connect", () => {
  socket.emit("enter-chat", data,(resp)=>{
      console.log('Usuarios conectados',resp)
  });
});

// desconectado
socket.on("disconnect", () => {
  console.log("Perdimos conexión con el servidor");
});

// Enviar mensaje a todos
socket.emit(
  "sendMsg",
  {
    user: "Jorge Manzano",
    msg: "Hola Mundo",
  },
  (resp) => {
    console.log("respuesta server: ", resp);
  }
);

// Enviar mensaje a privado
socket.emit(
  "msgPrivate",
  {
    to: "EDRme87u8PHRjXZCAAAA",
    msg: "Hola",
  },
  (resp) => {
    console.log("respuesta server: ", resp);
  }
);



// Escuchar información del servidor
socket.on("createMsg", (data) => {
  console.log("chat:", data);
});

//Cuando un usuario entra o sale del chat
socket.on("listPeople", (people) => {
  console.log("Nuevo listado", people);
});

//Recibir mensaje privado
socket.on("msgPrivate", (msg) => {
  console.log("Nuevo mensaje privado", msg);
});


const { io } = require("../server");
const { Users } = require("../classes/users");
const { createMsg } = require("../utils/utils");

const users = new Users();

io.on("connection", (client) => {


  client.on("enter-chat", (data, callback) => {
    if (!data.name || !data.room) {
      return callback({
        ok: false,
        msg: "El nombre y sala es necesario",
      });
    }

    console.log(`A entrado: ${data.name}`);

    //Unir a un usuario a una sala
    client.join(data.room)

    //agregar persona al chat
      users.addPerson(client.id, data.name,data.room);

    // Actualiza las personas que estan conectadas
    //client.broadcast.emit("listPeople", users.getAllPeople());

    // Actualiza las personas que estan conectadas en una sala
    client.broadcast.to(data.room).emit("listPeople", users.getPeopleByRoom(data.room));

    //Notifica que un usuario entro el chat
    client.broadcast.to(data.room).emit("createMsg",createMsg( "Administrador", `${data.name} se unió.` ));



    return callback({
      ok: true,
      data: users.getPeopleByRoom(data.room),
    });
  });

  client.on("createMsg", (data,callback) => {
    let person = users.getPerson(client.id);

    let message = createMsg(person.name, data.msg);

    client.broadcast.to(person.room).emit("createMsg", message);

      return callback({
        ok: true,
        message
      });
  });

  client.on("disconnect", () => { 
    let personDeleted = users.removePerson(client.id);

    //Notifica que un usuario abandono el char
    client.broadcast.to(personDeleted.room).emit("createMsg",
        createMsg(
          "Administrador",
          `${personDeleted.name} ha abandonado el chat.`
        )
      );

    // Actualiza las personas que estan conectadas
    client.broadcast 
      .to(personDeleted.room)
      .emit("listPeople", users.getPeopleByRoom(personDeleted.room));
  });

  client.on("msgPrivate", (data) => {
    let person = users.getPerson(client.id);

    client.broadcast.to(data.to).emit("msgPrivate", createMsg(person.name,data.msg));
  });
});

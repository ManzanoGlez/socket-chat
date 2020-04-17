class Users {
  constructor() {
    this.people = [];
  }

  addPerson(id, name,room) {
    let person = { id, name,room };

    this.people.push(person);

    return this.people;
  }

  getPerson(id) {
    return this.people.filter((person) => (person.id === id))[0];
  }

  getAllPeople() {
    return this.people;
  }

  removePerson(id) {
    
    let outPerson = this.getPerson(id);

    this.people = this.people.filter((person) => person.id != id);

    return outPerson;
  }

  getPeopleByRoom(room) {

    return this.people.filter((person) => person.room === room);

  }
}

module.exports = {
  Users,
};

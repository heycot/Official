"use strict"
module.exports = class Role {
  constructor(id, role) {
    this.mId = id;
    this.mRole = role;
  }
  getMId() {
      return this.mid;
  }
  getMRole() {
      return this.mRole;
  }
  setMId(id) {
      this.mId = id;
  }
  setMRole(role) {
      this.mRole = role;
  }
}
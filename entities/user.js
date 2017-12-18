'use strict';
module.exports = class User{
    constructor(id, username, fullname, email, password, roleId, roleName) {
        this.mId = id;
        this.mUsername = username;
        this.mFullname = fullname;
        this.mEmail = email;
        this.mPassword = password;
        this.mRoleId = roleId;
        this.mRoleName = roleName;
    }

    getMId() {
        return this.mId;
    }

    getMUsername() {
        return this.mUsername;
    }

    getMFullname() {
        return this.mFullname;
    }

    getMEmail() {
        return this.mEmail;
    }

    getMPassword() {
        return this.mPassword;
    }

    getMRoleId() {
        return this.mRoleId;
    }

    getMRoleName() {
        return this.mRoleName;
    }

    setMId(id) {
        this.mId = id;
    }

    setMUsername(username) {
        this.mUsername = usename;
    }

    setMFullname(fullname) {
        this.mFullname = fullname;
    }

    setMEmail(email) {
        this.mEmail = email;
    }

    setMPassword(password) {
        this.mPassword = password;
    }

    setMRoleId(roleId) {
        this.mRoleId = roleId;
    }

    setMRoleName() {
        this.mRoleName = roleName;
    }
}
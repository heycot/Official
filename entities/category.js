'use strict';
module.exports = class Category {
	constructor(id, name, createAt, updateAt) {
		this.mId = id;
		this.mName = name;
		this.mCreateAt = createAt;
		this.mUpdateAt = updateAt;
	}

	getMId() {
		return this.mId;
	}

	getMName() {
		return this.mName;
	}

	getMCreateAt() {
		return this.mCreateAt;
	}

	getMUpdateAt() {
		return this.mUpdateAt;
	}

	setMId(id) {
		this.mId = id;
	}

	setMName(name) {
		this.mName = name;
	}

	setMCreateAt(createAt) {
		this.mCreateAt = createAt;
	}

	setMUpdateAt(updateAt) {
		this.mUpdateAt = updateAt;
	}



} 
'use strict';
module.exports = class Comment {
	constructor(id, userId, username, bookId, content, createAt, status, bookName) {
		this.mId = id;
		this.mUserId = userId;
		this.mUsername = username;
		this.mBookId = bookId;
		this.mContent = content;
		this.mCreateAt = createAt;
		this.mStatus = status;
		this.mBookName = bookName;
	}
} 
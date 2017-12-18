'use strict';
module.exports = class Book {
	constructor(id, name, summary, seriesId, catId, userCreateId,
	 createAt, author, fileName,
	  image, sumVote, sumScore, avgScore, status, catName, seriesName, userName) {
		this.mId = id;
		this.mName = name;
		this.mSummary = summary;
		this.mSeriesId = seriesId;
		this.mCatId = catId;
		this.mUserCreateId = userCreateId;
		this.mCreateAt = createAt;
		this.mAuthor = author;
		
		this.mFileName = fileName;
		this.mImage = image;
		this.mSumVote = sumVote;
		this.mSumScore = sumScore;
		this.mAvgScore = avgScore;
		this.mStatus = status;
		this.mCatName = catName;
		this.mSeriesName = seriesName;
		this.mUserName = userName;
		
	}
} 
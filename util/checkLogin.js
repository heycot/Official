
function ensureAuthenticated(req, res, next) {
    console.log(typeof req.user)
    if(typeof req.user == 'undefined'){
    	req.flash('error_msg', "You are not logged in");
        res.redirect('/admin/login');
    }else{
    	if(req.isAuthenticated() && req.user.mRoleId != 3) {
        	return next();
    	}else{
    		if(req.user.mRoleId == 3){
    			res.redirect("/");
    		}
    	}
    }

    /*if(req.isAuthenticated() && req.user.mRoleId != 3) {
        return next();
    } else {
    	if(typeof req.user !== undefined && req.user.mRoleId == 3){
    		res.redirect("/");
    	}else{
    		req.flash('error_msg', "You are not logged in");
        	res.redirect('/admin/login');
    	}
        
    }*/
}
module.exports = {
    ensureAuthenticated : ensureAuthenticated
}
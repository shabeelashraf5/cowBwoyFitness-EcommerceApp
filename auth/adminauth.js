
const checkManager = function(req, res, next) {
    if (req.user && req.user.role === 'manager') { 

      next(); 
    } else {
      console.log('Access denied. User role:', req.user.role);
      res.status(403).send('Access denied'); 
    }
  };


  module.exports ={
    
    checkManager

}



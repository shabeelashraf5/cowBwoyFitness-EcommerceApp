const isLogin = async  function(req, res, next ) {
   
    try{
        if(req.session.email){
        }else{
            res.redirect('/admin')
        }
        next()
    }catch (error){
        console.log(error.message)
    }
}



const isLogout = async function(req,res,next) {

    try{
        if(req.session.email){
         res.redirect('/admin/dashboard')
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
   
    isLogin, isLogout

}

const isLogin = async  function(req, res, next ) {
   
    try{
        if(req.session.customerId){
        }else{
            res.redirect('/login')
        }
        next()
    }catch (error){
        console.log(error.message)
    }
}



const isLogout = async function(req,res,next) {

    try{
        if(req.session.customerId){
         res.redirect('/home')
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
   
    isLogin, isLogout

}
const nodemailer = require('nodemailer');
const { token } = require('morgan');

const sentMail = async function (fname,email, token){

    try {

        const transporter = nodemailer.createTransport({
            
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const mailOption ={
            from: process.env.SMTP_USER,
            to:email,
            subject:'For Reset Password',
            html:'<h2> Hello '+fname+', please click to <a href="http://cowbwoy.shop/reset-password/?token='+token+'">Reset</a> your password<h2>'
        }

        transporter.sendMail(mailOption, function(error,info){

            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent", info.response)
            }
        })
        
    }catch{

        console.log('Error Occured')
    }
    
} 


module.exports ={

    sentMail

}
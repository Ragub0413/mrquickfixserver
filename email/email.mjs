import nodemailer from "nodemailer";

const mailSender = async (email,title,body,attachments) =>{
    try{
        let transporter = nodemailer.createTransport({
            secure:true,
            host:'smtp.gmail.com',
            port: 465,
            auth:{
                user:'mrquickofficialph@gmail.com',
                pass:'dxviwdorgyeutbur'
            }
        });
        let info = await transporter.sendMail({
            from: 'mrquickofficialph@gmail.com',
            to:email,
            subject: title,
            html: body,
            attachments:attachments
        });
        console.log("Email info: ", info);
        return info;

    }catch(err){
        console.log(err.message);
    }
}

export default mailSender;
import nodemailer from "nodemailer";
const sendEmail = async( { from = process.env.EMAIL , to , cc , bcc , subject ,text , html , attachments = [] } = {} ) =>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        secure:true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
      },
    });

    const emailInfo = await transporter.sendMail({
        from: `"Rahma Foo 👻" <${from}>`, // sender address
        to, // list of receivers
        cc, //mention someone
        bcc,//hidden mention
        subject, // Subject line
        text,   // plain text body
        html,  // html body
        attachments
      });
    return  emailInfo.accepted.length < 1 ? false : true
    
}

export default sendEmail





// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
// }
// });

// const info = await transporter.sendMail({
//     from: `"Rr Foo 👻" <${ process.env.EMAIL}>`, // sender address
//     to: "rr@gmail.com", // list of receivers//cc :mention someone//bcc:hidden mention
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//     attachments:[
//         {
//         filename:"DummyName.txt",
//         content:"hello Node.js"
//         },
//         // {
//         //     filename:"DummyName22.txt",
//         //     path:"./dtext.txt"
//         // },
//         // {
//         //     filename:"DummyName22.txt",
//         //     path:"./dtext.txt",
//         //     contentType:"application/pdf"
//         // }
//     ]
//   });
//   console.log(info);
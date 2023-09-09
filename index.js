import path from 'path'
import { fileURLToPath } from "url"
import dotenv from 'dotenv'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname , `./config/.env`)})
import  express  from "express"
import bootstrap from "./src/index.router.js"
import sendEmail from './src/utils/email.js'
import  { createInvoice } from "./src/utils/pdf.js";
const app = express()
const port = process.env.PORT || 5000



app.use(`/uploads`,express.static("./src/uploads"))
bootstrap(app,express)



app.listen(port,()=>{
    console.log(`port is running on port.......${port}`);
})
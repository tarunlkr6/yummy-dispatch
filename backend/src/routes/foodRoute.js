import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'
import multer from 'multer' //for image storage 


const  foodRouter = express.Router()

// image storage engine
const storage = multer.diskStorage({
    destination:'uploads',
    filename: (req,file,cb)=>{
        return cb(null,`${Date.now()}, ${file.originalname}`)
    }
})

//middleware
const upload = multer({storage:storage})

foodRouter.post('/add',upload.single('image'),addFood)
foodRouter.get('/list',listFood)
foodRouter.post('/remove',removeFood)



export{foodRouter}

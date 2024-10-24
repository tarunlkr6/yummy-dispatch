import {FoodItem} from "../models/food.model.js";
import fs from 'fs'


//add food item
const addFood = async (req, res)=>{

    let image_filename = `${req.file.filename}` //store, the uploaded file name into this (image_filename) variable

    const food = new FoodItem({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    })

    try {
        await food.save()
        res.json({ success: true, message: 'Food Added' })
    } catch (error) {
        // throw new Error('Error')
        console.log(error)
        res.json({ success: false, message: error })
    }
}


// all food list
const listFood = async(req,res) => {
    try {
        const foods = await FoodItem.find({})
        res.json({success: true, data: foods})
    } catch (error) {
        console.log(`Error: ${error}`)
        res.json({success: false, message: 'error'})
    }
}


//remove food item 
const removeFood = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, ()=> {})

        await FoodItem.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'Food removed successfully'})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: 'Error'})
    }
}


export {addFood, listFood, removeFood}
import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const customFileName = `image_${Date.now()}${path.extname(file.originalname)}`
        cb(null, customFileName)
    }
})

export const upload = multer({
    storage
})
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    search() {
        // search by restaurant name
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {}

        this.query = this.query.find({ ...keyword })
        return this
    }

    searchMenu() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { itemName: { $regex: this.queryStr.keyword, $options: "i" } },
                { category: { $regex: this.queryStr.keyword, $options: "i" } }
            ]
        } : {}

        this.query = this.query.find({ ...keyword })
        return this
    }

    filter() {
        const duplicate = { ...this.queryStr }

        const fields = ["keyword", "page", "limit"]
        fields.forEach((key) => delete duplicate[key])

        let queryStr = JSON.stringify(duplicate)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }
    filterByOpenStatus() {
        if (this.queryStr.openNow === 'true') {
            const currentHour = new Date.getHours()
            this.query = this.query.find({
                openingTime: { $lte: currentHour },
                closingTime: { $gte: currentHour }
            })
        }
        return this
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

export { ApiFeatures }
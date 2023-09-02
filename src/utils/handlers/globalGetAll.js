import { StatusCodes } from "http-status-codes";
import { paigination } from "../pagination.js";




export const getAll = (model) =>{
    
    return async (req, res, next) => {
    // const { size, page } = req.query;
    const { limit, skip } = paigination(page, size);
    const excluded = ["sort", "page", "size", "fields", "searchKey"];
    let queryFields = { ...req.query };
    
    excluded.forEach((ele) => {
        delete queryFields[ele];
    });
    
    queryFields = JSON.parse(JSON.stringify(queryFields).replace(
        /gt|gte|lte|lt/g,
        (match) => `$${match}`
    ))
    
    console.log(queryFields);
    
    const modelCounts = await model.countDocuments();
    
    let reqQuery = model.find(queryFields);
    reqQuery.skip(skip).limit(limit);
    reqQuery.sort(req.query.sort?.replace(/,/g, ' '));
    reqQuery.find({
        $or: [
            { name: { $regex: req.query.searchKey } },
            { description: { $regex: req.query.searchKey } },
        ]
    });  
    reqQuery.select(req.query.fields?.replace(/,/g, ' '));
    console.log(req.query.sort?.replace(/,/g, ' '));
    const result = await reqQuery;

    const countsObject = {};
    countsObject[`${model.modelName}Count`] = modelCounts;
    
    const totalPages = Math.ceil(modelCounts / size) || 1;
    
    res.status(StatusCodes.ACCEPTED).json({
        message: "Done",
        result,
        ...countsObject,
        totalPages,
        page: (page || 1),
    });
};
}

// export const getAll = (model,name) =>{
    
//     return async (req, res, next) => {
//     const { size, page } = req.query;
//     const { limit, skip } = paigination(page, size);
//     const excluded = ["sort", "page", "size", "fields", "searchKey"];
//     let queryFields = { ...req.query };
    
//     excluded.forEach((ele) => {
//         delete queryFields[ele];
//     });
    
//     queryFields = JSON.parse(JSON.stringify(queryFields).replace(
//         /gt|gte|lte|lt/g,
//         (match) => `$${match}`
//     ))
    
//     // console.log(queryFields);
    
    
//     let reqQuery = model.find(queryFields);
//     reqQuery.skip(skip).limit(limit);
//     reqQuery.sort(req.query.sort?.replace(/,/g, ' '));
//     reqQuery.find({
//         $or: [
//             { name: { $regex: req.query.searchKey } },
//             { description: { $regex: req.query.searchKey } },
//         ]
//     });  
//     reqQuery.select(req.query.fields?.replace(/,/g, ' '));
//     console.log(req.query.sort?.replace(/,/g, ' '));
//     const result = await reqQuery;

//     const countsObject = {};
//     countsObject[`${model.modelName}Count`] = modelCounts;
        
//     res.status(StatusCodes.ACCEPTED).json({
//         message: "Done",
//         model:`${name} result`,
//         result,
//         ...countsObject,
//         totalPages,
//         page: (page || 1),
//     });
// };
// }




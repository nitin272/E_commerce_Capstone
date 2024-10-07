import * as yup from 'yup'

export const ValidationSchemaForm = yup.object({
    productName : yup.string().min(2,"Product name must be at least 2 characters").required("Please enter product name"),
    category : yup.string().required("Please select category"),
    material : yup.string().required("Please select material"),
    description : yup.string().min(10).required("Please select description"),
    price : yup.number().required("Please enter price"),
    stock : yup.number().min(0,"Stock can not be less than 0").required("Please enter available stock"),
    height : yup.number().min(0.1,"height must be valid").required("Please enter height"),
    length : yup.number().min(0.1,"length must be valid").required("Please enter length"),
    width : yup.number().min(0.1,"width must be valid").required("Please enter width"),
    dimenstionUnit : yup.string().min(1,"Please enter weight unit").required("Please enter dimenstions unit"),
    weight : yup.number().required("Please enter product weight"),
    weightUnit: yup.string().min(1,"Please enter weight unit").required("Please enter weight unit"),
    productImg : yup.array().min(1).max(4).required("Product image is required"),
    ownerImg : yup.array().min(1).required("Owner image is required")
})
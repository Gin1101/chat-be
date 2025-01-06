import JoiCore from "joi"
import DateExtension from "@joi/date";

const Joi = JoiCore.extend(DateExtension)

const loginSchema = Joi.object().keys({ username: Joi.string().required(), password: Joi.string().min(6).required() });

// user
const getUserListSchema = Joi.object().keys({
    page: Joi.number().integer().min(1),
    size: Joi.number().integer().min(0).max(100),
    username: Joi.string().allow(""),
});

const addSubTractMoneySchema = Joi.object().keys({
    amount: Joi.number().invalid(0).required()
})

const rewardsMoneySchema = Joi.object().keys({
    amount: Joi.number().greater(0).required()
})

const updateUserSchema = Joi.object().keys({
    isDisabled: Joi.number().valid(0, 1),
    orderDisabled: Joi.number().valid(0, 1),
    password: Joi.string().min(6).max(30),
    password_withdraw: Joi.string().min(3).max(100),
    bank: Joi.object().keys({
        bankName: Joi.string().required(),
        accountNumber: Joi.string().required(),
        holder: Joi.string().required(),
    }),
    vip: Joi.number().valid(0, 1, 2, 3, 4, 5),
    role: Joi.number().valid(0, 1, 2)
})
// user

const createAgentSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
});
// agent

// end agent

const getTransactionListSchema = Joi.object().keys({
    page: Joi.number().integer().min(1),
    size: Joi.number().integer().min(0).max(100),
    type: Joi.string().valid("deposit", "withdrawal"),
    username: Joi.string().allow(""),
    status: Joi.number().valid(0, 1, 2)
});

const approveTransactionSchema = Joi.object().keys({
    status: Joi.number().integer().valid(1, 2).required(),
    note: Joi.string()
});

const updateTransactionSchema = Joi.object().keys({
    note: Joi.string()
});

const getOrderList = Joi.object().keys({
    page: Joi.number().integer().min(1),
    size: Joi.number().integer().min(0).max(100),
    username: Joi.string().allow(""),
    status: Joi.number().valid(0, 1, 2)
});


// product

const setProductResultSchema = Joi.object().keys({
    result: Joi.array().items(Joi.number().valid(1, 2, 3, 4, 5, 6).required()).required()
});

const editProductSchema = Joi.object().keys({
    betOptions: Joi.array().items(Joi.object({
        _id: Joi.string().required(),
        id: Joi.string().required(),
        name: Joi.string(),
        max: Joi.number().min(1),
        rate: Joi.number().min(0)
    }))
}).required().min(1);

// orders
const setOrderResultSchema = Joi.object().keys({
    win: Joi.number().valid(0, 1, 2).allow("")
});


// config
const setSystemConfigSchema = Joi.object().keys({
    ref: Joi.string().required(),
    doiben: Joi.number().greater(0).required(),
    xucxac5p: Joi.number().greater(0).required(),
    xucxac3p: Joi.number().greater(0).required(),
    haitrung3p: Joi.number().greater(0).required(),
    haitrung5p: Joi.number().greater(0).required(),
    batrung3p: Joi.number().greater(0).required(),
    batrung5p: Joi.number().greater(0).required(),
    loi_xucxac3p: Joi.number().greater(0).required(),
    loi_xucxac5p: Joi.number().greater(0).required(),

    seo_title: Joi.string().required().allow(""),
    seo_desc: Joi.string().required().allow(""),
    home_notify: Joi.string().required().allow(""),
});


const setChatSettingsSchema = Joi.object().keys({
    schedule: Joi.array().items({
        from: Joi.date().format("HH:mm").raw().required(),
        to: Joi.date().format("HH:mm").raw().required(),
    }).length(7),
    message: Joi.string().allow(""),
    message2: Joi.string().allow("")
})

export default {
    loginSchema,
    getUserListSchema,
    addSubTractMoneySchema,
    rewardsMoneySchema,
    updateUserSchema,
    getTransactionListSchema,
    approveTransactionSchema,
    updateTransactionSchema,
    getOrderList,
    setProductResultSchema,
    editProductSchema,
    setSystemConfigSchema,
    setChatSettingsSchema,
    setOrderResultSchema,
    createAgentSchema
}

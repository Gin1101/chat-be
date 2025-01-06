import userRouter from "#src/modules/User/user.route.js"
import authRouter from "#src/modules/Auth/auth.route.js"
import adminRouter from "#src/modules/Admin/admin.route.js"
import utilRouter from "#src/modules/util/util.route.js"

function initRoutes(app){
    app.use("/api/user", userRouter)
    app.use("/api/auth", authRouter)
    app.use("/api/admin", adminRouter)
    app.use('/api/util', utilRouter)
}


export default initRoutes
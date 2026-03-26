import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers
        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)
        const isLegacyToken = token_decode === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
        const isAdminPayload = typeof token_decode === 'object' && token_decode?.role === 'admin'

        if (!isLegacyToken && !isAdminPayload) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }

        if (isAdminPayload) {
            req.admin = { id: token_decode.id, email: token_decode.email }
        }

        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin;
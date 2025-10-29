import { envVariables } from "../config/envVariables.js"
import User from "../modules/user/user.model.js"
import ApiError from "./ApiError.js"
import { generateToken, verifyToken } from "./jwt.js"

export const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVariables.JWT_ACCESS_SECRET, envVariables.JWT_ACCESS_EXPIRE)

    const refreshToken = generateToken(jwtPayload, envVariables.JWT_REFRESH_SECRET, envVariables.JWT_REFRESH_EXPIRE)


    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVariables.JWT_REFRESH_SECRET)

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new ApiError(400, "User does not exist")
    }
    if (isUserExist.isDeleted) {
        throw new ApiError(400, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVariables.JWT_ACCESS_SECRET, envVariables.JWT_ACCESS_EXPIRE)

    return accessToken
}
import bcrypt from "bcrypt"
import User from "../user/user.model.js"
import ApiError from "../../utils/ApiError.js"
import { envVariables } from "../../config/envVariables.js"
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens.js"

const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (payload, decodedToken) => {
    if (payload.id != decodedToken.userId) {
        throw new ApiError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new ApiError(401, "User does not exist")
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(envVariables.BCRYPT_SALT_ROUNDS)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}

const setPassword = async (userId, plainPassword) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new ApiError(400, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcrypt.hash(
        plainPassword,
        Number(envVariables.BCRYPT_SALT_ROUNDS)
    )

    const credentialProvider = {
        provider: "credential",
        providerId: user.email
    }

    const auths = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()
}

const changePassword = async (oldPassword, newPassword, decodedToken) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isOldPasswordMatch) {
        throw new ApiError(403, "Old Password does not match");
    }

    user.password = await bcrypt.hash(newPassword, Number(envVariables.BCRYPT_SALT_ROUNDS))

    user.save();
}

export const AuthServices = {
    getNewAccessToken,
    changePassword,
    setPassword,
    resetPassword
}
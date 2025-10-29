import { envVariables } from "../config/envVariables"

export const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: envVariables.NODE_ENV === "production",
            sameSite: "none"
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: envVariables.NODE_ENV === "production",
            sameSite: "none"
        })
    }
}
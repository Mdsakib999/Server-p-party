import { envVariables } from "../config/envVariables.js";
import User from "../modules/user/user.model.js";
import { Roles } from "./roles.js";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVariables.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    // const hashedPassword = await bcrypt.hash(
    //   envVariables.SUPER_ADMIN_PASSWORD,
    //   Number(envVariables.BCRYPT_SALT_ROUNDS)
    // );

    const authProvider = {
      provider: "credential",
      providerId: envVariables.SUPER_ADMIN_EMAIL,
    };

    const payload = {
      name: "BNP SUPER ADMIN",
      role: Roles[2],
      email: envVariables.SUPER_ADMIN_EMAIL,
      password: envVariables.SUPER_ADMIN_PASSWORD,
      isVerified: true,
      auths: [authProvider]
    };

    const superAdmin = await User.create(payload);
    console.log("Super Admin Created Successfully! \n");
    console.log(superAdmin);
  } catch (error) {
    console.log(error);
  }
};

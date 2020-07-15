const MsAdmin = require("../../models/msadmins");
const { hashPassword } = require("./passwordUtils");
const log = require("debug")("log");

//create default super-admin if not exists
exports.createDefaultAdmin = async () => {
  //search for default admin user
  try {
    const msAdmin = await MsAdmin.findOne({
      sysdefined: true,
      role: "superadmin",
    });

    if (msAdmin) {
      log("\n \t Minimal account found");
      return msAdmin.id;
    }
  } catch (error) {
    throw new Error(`Error getting minimal account: ${error.message}`);
  }

  try {
    //if not found read in SUPER_ADMIN_PASSWORD, SUPER_ADMIN_EMAIL from env
    log("\n \t Minimal account not found ... creating");

    //check email
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

    //if no password found exit requesting the variable
    if (!superAdminEmail) {
      throw new Error(
        "Please specify a SUPER_ADMIN_EMAIL environment variable. Exiting ..."
      );
    }

    //check password
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    //if no password found exit requesting the variable
    if (!superAdminPassword) {
      throw new Error(
        "Please specify a SUPER_ADMIN_PASSWORD environment variable. Exiting ..."
      );
    }

    //hash the password
    const hashedPassword = await hashPassword(superAdminPassword);

    //create a default admin account and log on screen
    const newAdmin = new MsAdmin({
      fullname: "Default system admin account",
      password: hashedPassword,
      email: superAdminEmail, //TODO: we need a custom email validator on schema
      sysdefined: true,
      role: "superadmin",
    });

    await newAdmin.save();
    log("\n \t Minimal account created successfully");

    //TO-DO wipe details from .env file after successful creation
    return newAdmin.id;
  } catch (error) {
    //log(error.message);
    throw new Error(`An error occured creating account ${error.message}`);
  }
};

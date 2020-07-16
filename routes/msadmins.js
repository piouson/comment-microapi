const express = require("express");
const { sysAuthMW, superAdminMW } = require("../middleware/auth");
const msAdminsCtrl = require("../controllers/msAdminsController");
const validMW = require("../middleware/validation");
const validationRules = require("../utils/validationRules").msAdmins;

const router = express.Router();

// ------- Unguarded/open routes ----------
router.post(
  "/login",
  validMW(validationRules.loginAdminSchema),
  msAdminsCtrl.loginSysAdmin
);

// --------- DONT TOUCH!!! -------------
//apply middleware at top of chain
router.use(sysAuthMW);

/**
 * POST routes
 */

router.post(
  "/create",
  validMW(validationRules.createSingleMsAdminSchema),
  msAdminsCtrl.createSingleMsAdmin
);

router.post(
  "/change-password",
  validMW(validationRules.changeMsAdminPasswordSchema),
  msAdminsCtrl.changeMsAdminPassword
);

/**
 * PATCH routes
 */
router.patch(
  "/",
  validMW(validationRules.updateSingleMsAdminSchema),
  msAdminsCtrl.updateSingleMsAdmin
);

//------------SUPERADMIN Routes---------------
//middleware to block non-superadmin roles
router.use(superAdminMW);

/**
 * GET routes
 */
router.get(
  "/",
  validMW(validationRules.getAllMsAdminsSchema),
  msAdminsCtrl.getAllMsAdmins
);

router.get(
  "/:msAdminId",
  validMW(validationRules.getSingleMsAdminSchema),
  msAdminsCtrl.getSingleMsAdmin
);

/**
 * PATCH routes
 */

router.patch(
  "/:msAdminId/enable",
  validMW(validationRules.enableDisableMsAdminSchema),
  msAdminsCtrl.enableDisableMsAdmin(false)
);

router.patch(
  "/:msAdminId/disable",
  validMW(validationRules.enableDisableMsAdminSchema),
  msAdminsCtrl.enableDisableMsAdmin(true)
);

/**
 * DELETE routes
 */

module.exports = router;

/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

	/* --------- FRONT Request  ----------------*/
	/* Root routing */
	'GET /': 'FrontDashboardController.getDashboard',

	/* Auth routing */
	'GET /login': 'AuthController.login',
  'GET /logout': 'AuthController.logout',
  'GET /register': 'AuthController.register',

  'POST /auth/local': 'AuthController.callback',
  'POST /auth/local/:action': 'AuthController.callback',
  'GET /auth/:provider': 'AuthController.provider',
  'GET /auth/:provider/callback': 'AuthController.callback',

	/* User routing */
  'GET /user': 'FrontUserController.myAccount',
  'POST /user/update': 'FrontUserController.update',
  'POST /user/delete': 'FrontUserController.delete',
  'POST /user/changePassword': 'FrontUserController.changePassword',
  'GET /user/getAllUsers': 'FrontUserController.getAllUsers',
  'GET /user/getDevicesByUser': 'FrontUserController.getDevicesByUser',
  'GET /forgetPassword': 'FrontUserController.forgetPassword',
  'POST /sendNewPassword': 'FrontUserController.sendNewPassword',

	/* Device routing */
  'GET /device': 'FrontDeviceController.index',
  'POST /device/create': 'FrontDeviceController.create',
  'GET /device/open': 'FrontDeviceController.open',
  'GET /device/close': 'FrontDeviceController.close',
  'GET /device/checkState': 'FrontDeviceController.checkState',
  'POST /device/update': 'FrontDeviceController.update',
  'POST /device/delete': 'FrontDeviceController.delete',
  'GET /device/getAllDevices': 'FrontDeviceController.getAllDevices',
  'GET /device/getUsersByDevice': 'FrontDeviceController.getUsersByDevice',

	/* --------- API Request  ----------------*/

	/* Auth routing */
	'POST /api/auth/local': 'AuthController.callback',
	'POST /api/auth/local/:action': 'AuthController.callback',
	'GET /api/auth/:provider': 'AuthController.provider',
	'GET /api/auth/:provider/callback': 'AuthController.callback',

	/* User routing */
	'GET /api/user/:id': 'UserController.myAccount',
	'PUT /api/user/update/:id': 'UserController.update',
	'DELETE /api/user/delete/:id': 'UserController.delete',
	'PUT /api/user/changePassword/:id': 'UserController.changePassword',
	'GET /api/user/getAllUsers': 'UserController.getAllUsers',
	'GET /api/user/getDevicesByUser/:id': 'UserController.getDevicesByUser',
    'POST /api/sendNewPassword': 'UserController.sendNewPassword',

	/* Device routing */
	'GET /api/device': 'DeviceController.index',
	'POST /api/device/create': 'DeviceController.create',
	'POST /api/device/open': 'DeviceController.open',
	'POST /api/device/close': 'DeviceController.close',
	'GET /api/device/checkState': 'DeviceController.checkState',
	'PUT /api/device/update': 'DeviceController.update',
	'DELETE /api/device/delete': 'DeviceController.delete',
	'GET /api/device/getAllDevices': 'DeviceController.getAllDevices',
	'GET /api/device/getUsersByDevice': 'DeviceController.getUsersByDevice'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};

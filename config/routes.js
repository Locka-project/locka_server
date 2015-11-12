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

	/* User Front routing */
  'GET /user': 'FrontUserController.myAccount',
	'GET /:lang/user': 'FrontUserController.myAccount',
  'POST /user/update': 'FrontUserController.update',
  'POST /user/delete': 'FrontUserController.delete',
  'POST /user/changePassword': 'FrontUserController.changePassword',
  'GET /user/getAllUsers': 'FrontUserController.getAllUsers',
  'GET /user/getDevicesByUser': 'FrontUserController.getDevicesByUser',
  'GET /forgetPassword': 'FrontUserController.forgetPassword',
	'GET /user/:id': 'FrontUserController.getUserById',
  'POST /sendNewPassword': 'FrontUserController.sendNewPassword',

	/* Device Front routing */
  'GET /device': 'FrontDeviceController.index',
  'POST /device/create': 'FrontDeviceController.create',
  'GET /device/open': 'FrontDeviceController.open',
  'GET /device/close': 'FrontDeviceController.close',
  'POST /device/update': 'FrontDeviceController.update',
  'POST /device/delete': 'FrontDeviceController.delete',
  'GET /device/getAllDevices': 'FrontDeviceController.getAllDevices',
  'GET /device/getUsersByDevice': 'FrontDeviceController.getUsersByDevice',
  'GET /device/logs': 'FrontDeviceController.getLogs',
  
  /* Lock identifier */
  'GET /lock/:id': 'FrontIdentifierController.getLock',

	/* --------- API Request  ----------------*/

	/* Auth routing */
	'POST /api/auth/local': 'AuthController.callback',
	'POST /api/auth/local/:action': 'AuthController.callback',
	'GET /api/auth/:provider': 'AuthController.provider',
	'GET /api/auth/:provider/callback': 'AuthController.callback',

	/* User routing */
	'GET /api/users': 'UserController.myAccount',
	'PUT /api/users/:id': 'UserController.update',
	'DELETE /api/users/:id': 'UserController.delete',
	'PUT /api/users/:id/changePassword': 'UserController.changePassword',
	'GET /api/users/getAllUsers': 'UserController.getAllUsers',
  'POST /api/users/:id/sendNewPassword': 'UserController.sendNewPassword',
	'GET /api/users/:id/forgetPassword': 'UserController.forgetPassword',
	'GET /api/users/:id/subscribe': 'UserController.getMyLock',

	/* Device routing */
	'GET /api/devices': 'DeviceController.index',
	'POST /api/devices/create': 'DeviceController.create',
	'PUT /api/devices/:id/open': 'DeviceController.open',
	'PUT /api/devices/:id/close': 'DeviceController.close',
	'PUT /api/devices/:id/update': 'DeviceController.update',
	'DELETE /api/devices/:id/delete': 'DeviceController.delete',
	'GET /api/devices/getAllDevices': 'DeviceController.getAllDevices',
	'GET /api/devices/getUsersByDevice': 'DeviceController.getUsersByDevice',

	/* ----------- Socket IO --------- */
	'GET /socket/devices/subscribe': 'FrontDashboardController.getMyLock',
	'GET /socket/users/logs/subscribe': 'FrontDashboardController.watchLogs',
	'GET /api/user/subscribe': 'UserController.getMyLock',
	'GET /api/devices/subscribe/:identifier': 'DeviceController.subscribe',

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

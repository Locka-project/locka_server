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
	'GET /': 'DashboardController.getDashboard',

	/* Auth routing */
	'GET /login': 'AuthController.login',
  'GET /logout': 'AuthController.logout',
  'GET /register': 'AuthController.register',

  'POST /auth/local': 'AuthControllerFront.callback',
  'POST /auth/local/:action': 'AuthControllerFront.callback',
  'GET /auth/:provider': 'AuthControllerFront.provider',
  'GET /auth/:provider/callback': 'AuthControllerFront.callback',

	/* User routing */
  'GET /user': 'UserControllerFront.myAccount',
  'POST /user/update': 'UserControllerFront.update',
  'POST /user/delete': 'UserControllerFront.delete',
  'POST /user/changePassword': 'UserControllerFront.changePassword',
  'GET /user/getAllUsers': 'UserControllerFront.getAllUsers',
  'GET /user/getDevicesByUser': 'UserControllerFront.getDevicesByUser',
  'POST /user/forgetPassword': 'UserControllerFront.forgetPassword',

	/* Device routing */
  'GET /device': 'DeviceControllerFront.index',
  'POST /device/create': 'DeviceControllerFront.create',
  'GET /device/open': 'DeviceControllerFront.open',
  'GET /device/close': 'DeviceControllerFront.close',
  'GET /device/checkState': 'DeviceControllerFront.checkState',
  'POST /device/update': 'DeviceControllerFront.update',
  'POST /device/delete': 'DeviceControllerFront.delete',
  'GET /device/getAllDevices': 'DeviceControllerFront.getAllDevices',
  'GET /device/getUsersByDevice': 'DeviceControllerFront.getUsersByDevice',

	/* --------- API Request  ----------------*/

	/* Auth routing */
	'POST /api/auth/local': 'AuthController.callback',
	'POST /api/auth/local/:action': 'AuthController.callback',
	'GET /api/auth/:provider': 'AuthController.provider',
	'GET /api/auth/:provider/callback': 'AuthController.callback',

	/* User routing */
	'GET /api/user': 'UserController.myAccount',
	'PUT /api/user/update': 'UserController.update',
	'DELETE /api/user/delete': 'UserController.delete',
	'PUT /api/user/changePassword': 'UserController.changePassword',
	'GET /api/user/getAllUsers': 'UserController.getAllUsers',
	'GET /api/user/getDevicesByUser': 'UserController.getDevicesByUser',
	'GET /api/user/forgetPassword': 'UserController.forgetPassword',

	/* Device routing */
	'GET /api/device': 'DeviceController.index',
	'POST /api/device/create': 'DeviceController.create',
	'POST /api/device/open': 'DeviceController.open',
	'POST /api/device/close': 'DeviceController.close',
	'GET /api/device/checkState': 'DeviceController.checkState',
	'PUT /api/device/update': 'DeviceController.update',
	'DELETE /api/device/delete': 'DeviceController.delete',
	'GET /api/device/getAllDevices': 'DeviceController.getAllDevices',
	'GET /api/device/getUsersByDevice': 'DeviceController.getUsersByDevice',

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

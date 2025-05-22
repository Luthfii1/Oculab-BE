/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - email
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *               accessPin:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: User already exists or duplicate ID
 */

/**
 * @swagger
 * /user/get-all-user-data:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       404:
 *         description: No users found
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /user/update-user/{userId}:
 *   put:
 *     summary: Update user information (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *         example: user-id-1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (optional)
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LAB]
 *                 description: User's role in the system (optional)
 *                 example: LAB
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address (cannot be changed - will result in error if different)
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: user-id-1234
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     role:
 *                       type: string
 *                       example: LAB
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Email cannot be changed
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: Email addresses are not allowed to be modified.
 *       401:
 *         description: Unauthorized - Token required
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: RESOURCE_NOT_FOUND
 *                     description:
 *                       type: string
 *                       example: No user found with the provided ID.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/update-user-password/{userId}:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose password to update
 *         example: user-id-1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - previousPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *                 example: newSecurePassword123
 *               previousPassword:
 *                 type: string
 *                 description: The current password for verification
 *                 example: oldPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User's password updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: user-id-1234
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     newPassword:
 *                       type: string
 *                       example: newSecurePassword123
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid previous password
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The previous password provided is incorrect.
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/update-user-accessPin/{userId}:
 *   put:
 *     summary: Update user access PIN
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose access PIN to update
 *         example: user-id-1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newAccessPin
 *               - previousAccessPin
 *             properties:
 *               newAccessPin:
 *                 type: string
 *                 description: The new access PIN for the user
 *                 example: "123456"
 *               previousAccessPin:
 *                 type: string
 *                 description: The current access PIN for verification
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Access PIN updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User's access PIN updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: user-id-1234
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     newAccessPin:
 *                       type: string
 *                       example: "123456"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid previous password
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The previous access PIN provided is incorrect.
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/delete-user/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       400:
 *         description: User ID missing
 *       404:
 *         description: User not found
 */

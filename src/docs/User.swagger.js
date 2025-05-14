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
 *     summary: Get all users (admin only)
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
 * /user/update-user-password/{userId}:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
 *               previousPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       400:
 *         description: Missing input, incorrect previous password, or unchanged password
 *       404:
 *         description: User not found
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

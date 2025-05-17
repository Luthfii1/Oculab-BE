/**
 * @swagger
 * tags:
 *   name: Examinations
 *   description: Examination management and data retrieval
 */

/**
 * @swagger
 * /examination/get-unfinished-examination-card-data/{userId}:
 *   get:
 *     summary: Get unfinished examination card data for a user
 *     tags: [Examinations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve unfinished examinations for
 *         example: user-id-1234
 *     responses:
 *       200:
 *         description: Unfinished examination card data retrieved successfully
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
 *                   example: Unfinished examination card data retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: exam-id-1234
 *                       slideId:
 *                         type: string
 *                         example: slide-0001
 *                       examinationPlanDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-11-01T08:00:00.000Z
 *                       statusExamination:
 *                         type: string
 *                         enum: [NOTSTARTED, INPROGRESS, NEEDVALIDATION]
 *                         example: NEEDVALIDATION
 *                       patientName:
 *                         type: string
 *                         example: Patient Name
 *                       patientDob:
 *                         type: string
 *                         format: date-time
 *                         example: 1990-01-01T00:00:00.000Z
 *       400:
 *         description: User ID is required
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
 *                   example: User ID is required
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The request is missing the required user ID.
 *       404:
 *         description: User not found or no examinations found
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
 *                   example: No examinations found for this user
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: No unfinished examinations found for this user.
 *       500:
 *         description: Internal server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: INTERNAL_SERVER
 *                     description:
 *                       type: string
 *                       example: An unexpected error occurred.
 */

/**
 * @swagger
 * /examination/get-finished-examination-card-data/{date}/{userId}:
 *   get:
 *     summary: Get finished examination card data for a user on a specific date
 *     tags: [Examinations]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to retrieve finished examinations for (YYYY-MM-DD)
 *         example: 2024-05-15
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve finished examinations for
 *         example: user-id-1234
 *     responses:
 *       200:
 *         description: Finished examination card data retrieved successfully
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
 *                   example: Finished examination card data retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: exam-id-5678
 *                       slideId:
 *                         type: string
 *                         example: slide-0002
 *                       examinationDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-05-15T10:30:00.000Z
 *                       statusExamination:
 *                         type: string
 *                         enum: [FINISHED]
 *                         example: FINISHED
 *                       patientName:
 *                         type: string
 *                         example: Patient Name
 *                       patientDob:
 *                         type: string
 *                         format: date-time
 *                         example: 1990-01-01T00:00:00.000Z
 *                       dpjpName:
 *                         type: string
 *                         example: Doctor Name
 *                       finalGradingResult:
 *                         type: string
 *                         enum: ["Negative", "Scanty", "Positive 1+", "Positive 2+", "Positive 3+"]
 *                         example: "Positive 1+"
 *       400:
 *         description: Missing parameters or invalid date
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
 *                   example: Invalid date format. Please use YYYY-MM-DD format.
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The provided date is in an invalid format. Please use YYYY-MM-DD.
 *       404:
 *         description: User not found or no examinations found for the date
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
 *                   example: No finished examinations found for this date
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: No finished examinations found for this date.
 *       500:
 *         description: Internal server error
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
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: INTERNAL_SERVER
 *                     description:
 *                       type: string
 *                       example: An unexpected error occurred.
 */

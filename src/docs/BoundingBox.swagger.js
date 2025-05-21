/**
 * @swagger
 * tags:
 *   name: BoundingBoxes
 *   description: Management of FOV bounding boxes and their status
 */

/**
 * @swagger
 * /boundingBox/get-bounding-box-data/{fovId}:
 *   get:
 *     summary: Get all bounding boxes for a specific FOV
 *     tags: [BoundingBoxes]
 *     parameters:
 *       - in: path
 *         name: fovId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the FOV to retrieve bounding boxes for
 *         example: fov-id-1234
 *     responses:
 *       200:
 *         description: Bounding box data retrieved successfully
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
 *                   example: Bounding box data retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     frameWidth:
 *                       type: integer
 *                       example: 600
 *                     frameHeight:
 *                       type: integer
 *                       example: 600
 *                     boxes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: box-id-5678
 *                           order:
 *                             type: integer
 *                             example: 1
 *                           xCoordinate:
 *                             type: number
 *                             example: 296.5
 *                           yCoordinate:
 *                             type: number
 *                             example: 224
 *                           width:
 *                             type: number
 *                             example: 23
 *                           height:
 *                             type: number
 *                             example: 30.5
 *                           status:
 *                             type: string
 *                             enum: [UNVERIFIED, VERIFIED, FLAGGED]
 *                             example: UNVERIFIED
 *       400:
 *         description: FOV ID is required
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
 *                   example: FOV ID is required
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The request is missing the required FOV ID.
 *       404:
 *         description: FOV not found or no bounding box data available
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
 *                   example: No bounding box data available yet for this FOV
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: RESOURCE_NOT_FOUND
 *                     description:
 *                       type: string
 *                       example: The FOV exists but does not have any bounding box data yet.
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
 *                       example: INTERNAL_ERROR
 *                     description:
 *                       type: string
 *                       example: An error occurred while processing the request.
 */

/**
 * @swagger
 * /boundingBox/update-box-status/{boxId}:
 *   put:
 *     summary: Update the status of a specific bounding box
 *     tags: [BoundingBoxes]
 *     parameters:
 *       - in: path
 *         name: boxId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the box to update
 *         example: box-id-5678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boxStatus
 *             properties:
 *               boxStatus:
 *                 type: string
 *                 enum: [UNVERIFIED, VERIFIED, FLAGGED]
 *                 description: New status for the box
 *                 example: VERIFIED
 *     responses:
 *       200:
 *         description: Box status updated successfully
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
 *                   example: Box status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: box-id-5678
 *                     order:
 *                       type: integer
 *                       example: 1
 *                     xCoordinate:
 *                       type: number
 *                       example: 296.5
 *                     yCoordinate:
 *                       type: number
 *                       example: 224
 *                     width:
 *                       type: number
 *                       example: 23
 *                     height:
 *                       type: number
 *                       example: 30.5
 *                     status:
 *                       type: string
 *                       enum: [UNVERIFIED, VERIFIED, FLAGGED]
 *                       example: VERIFIED
 *       400:
 *         description: Box ID is required or invalid status
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
 *                   example: Box status is required in request body
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       example: The request body must include a boxStatus field.
 *       404:
 *         description: Box not found
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
 *                   example: Box not found
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: RESOURCE_NOT_FOUND
 *                     description:
 *                       type: string
 *                       example: No box found for the provided ID.
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
 *                       example: INTERNAL_ERROR
 *                     description:
 *                       type: string
 *                       example: An error occurred while processing the request.
 */

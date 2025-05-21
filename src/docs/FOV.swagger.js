/**
 * @swagger
 * /fov/post-fov-data/v2/{examinationId}:
 *   post:
 *     summary: Create a new FOV data entry with optional bounding boxes
 *     description: |
 *       This endpoint creates a new Field of View (FOV) data entry and associates it with the specified examination.
 *       It can optionally include bounding boxes for detected objects within the FOV image.
 *       The bounding boxes will be created as separate entities in the database and linked to the FOV.
 *       This API is used primarily by the ML system to submit detection results.
 *     tags: [FOV]
 *     parameters:
 *       - in: path
 *         name: examinationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the examination to add FOV data to
 *         example: exam-id-1234
 *     requestBody:
 *       required: true
 *       description: FOV data with optional bounding boxes. The bounding boxes should specify x,y coordinates and dimensions of detected objects.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - type
 *               - order
 *               - systemCount
 *               - confidenceLevel
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Optional custom ID for the FOV data (UUID format). If not provided, a UUID will be automatically generated.
 *                 example: fov-id-5678
 *               image:
 *                 type: string
 *                 description: URL or path to the FOV image (required). This is the main image used for display.
 *                 example: https://example.com/images/fov-01.jpg
 *               imageOriginal:
 *                 type: string
 *                 description: URL or path to the original unprocessed image (optional)
 *                 example: https://example.com/images/original/fov-01.jpg
 *               imageMLAnalyzed:
 *                 type: string
 *                 description: URL or path to the ML-analyzed version of the image showing detection overlays (optional)
 *                 example: https://example.com/images/analyzed/fov-01.jpg
 *               type:
 *                 type: string
 *                 description: Type of the FOV (required) - must be a valid FOV type as defined in the system
 *                 example: 1-9 BTA
 *               order:
 *                 type: integer
 *                 description: Order or sequence number of the FOV (required) - used for ordering FOVs within an examination
 *                 example: 7
 *               comment:
 *                 type: array
 *                 description: Comments or notes about the FOV (optional) - can include detection notes or observations
 *                 items:
 *                   type: string
 *                 example: ["Presence of BTA detected", "Further analysis recommended"]
 *               systemCount:
 *                 type: integer
 *                 description: Count of objects detected by the automated system (required) - can be 0 if no objects detected
 *                 example: 0
 *               confidenceLevel:
 *                 type: number
 *                 format: float
 *                 description: Confidence level of the detection (required) - a value between 0.0 and 1.0
 *                 example: 0.89
 *               frameWidth:
 *                 type: integer
 *                 description: Width of the frame in pixels (optional) - defaults to 600 if not provided
 *                 example: 600
 *               frameHeight:
 *                 type: integer
 *                 description: Height of the frame in pixels (optional) - defaults to 600 if not provided
 *                 example: 600
 *               boxes:
 *                 type: array
 *                 description: Bounding boxes for detected objects (optional) - if provided, each box must contain x, y, width, and height
 *                 items:
 *                   type: object
 *                   required:
 *                     - x
 *                     - y
 *                     - width
 *                     - height
 *                   properties:
 *                     x:
 *                       type: number
 *                       description: X-coordinate of the top-left corner of the box (required) - relative to the image frame
 *                       example: 296.5
 *                     y:
 *                       type: number
 *                       description: Y-coordinate of the top-left corner of the box (required) - relative to the image frame
 *                       example: 224
 *                     width:
 *                       type: number
 *                       description: Width of the box in pixels (required)
 *                       example: 23
 *                     height:
 *                       type: number
 *                       description: Height of the box in pixels (required)
 *                       example: 30.5
 *     responses:
 *       201:
 *         description: FOV data created successfully with all associated bounding boxes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response - always "success" for successful operations
 *                   example: success
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 201
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: FOV data with bounding boxes created successfully
 *                 data:
 *                   type: object
 *                   description: The created FOV data object with all its properties
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the FOV
 *                       example: fov-id-5678
 *                     image:
 *                       type: string
 *                       description: URL or path to the FOV image
 *                       example: https://example.com/images/fov-01.jpg
 *                     imageOriginal:
 *                       type: string
 *                       description: URL or path to the original unprocessed image
 *                       example: https://example.com/images/original/fov-01.jpg
 *                     imageMLAnalyzed:
 *                       type: string
 *                       description: URL or path to the ML-analyzed version of the image
 *                       example: https://example.com/images/analyzed/fov-01.jpg
 *                     type:
 *                       type: string
 *                       description: Type of the FOV
 *                       example: 1-9 BTA
 *                     order:
 *                       type: integer
 *                       description: Order or sequence number of the FOV
 *                       example: 7
 *                     comment:
 *                       type: array
 *                       description: Comments or notes about the FOV
 *                       items:
 *                         type: string
 *                       example: ["Presence of BTA detected", "Further analysis recommended"]
 *                     systemCount:
 *                       type: integer
 *                       description: Count from the automated system
 *                       example: 0
 *                     confidenceLevel:
 *                       type: number
 *                       description: Confidence level of the detection (0.0-1.0)
 *                       example: 0.89
 *                     verified:
 *                       type: boolean
 *                       description: Whether this FOV has been verified by a human expert
 *                       example: false
 *                     boundingBoxData:
 *                       type: object
 *                       description: Information about the bounding boxes associated with this FOV
 *                       properties:
 *                         boxes:
 *                           type: array
 *                           description: Array of box IDs that can be referenced for details
 *                           items:
 *                             type: string
 *                           example: ["box-id-1", "box-id-2"]
 *                         frameWidth:
 *                           type: integer
 *                           description: Width of the frame in pixels
 *                           example: 600
 *                         frameHeight:
 *                           type: integer
 *                           description: Height of the frame in pixels
 *                           example: 600
 *       400:
 *         description: Missing required fields or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response - always "error" for error responses
 *                   example: error
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: Error message describing what went wrong
 *                   example: Image is required
 *                 data:
 *                   type: object
 *                   description: Additional error details
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       description: Type of error - indicates the category of the error
 *                       example: VALIDATION_ERROR
 *                     description:
 *                       type: string
 *                       description: Detailed description of the error
 *                       example: The request is missing required fields.
 *       404:
 *         description: Examination or patient not found - occurs when the specified examinationId doesn't exist or has no associated patient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response - always "error" for error responses
 *                   example: error
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: Error message describing what resource was not found
 *                   example: Examination not found
 *                 data:
 *                   type: object
 *                   description: Additional error details
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       description: Type of error - indicates the category of the error
 *                       example: RESOURCE_NOT_FOUND
 *                     description:
 *                       type: string
 *                       description: Detailed description of the error
 *                       example: The requested resource could not be found.
 *       409:
 *         description: Duplicate FOV ID - occurs when the provided _id already exists in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response - always "error" for error responses
 *                   example: error
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 409
 *                 message:
 *                   type: string
 *                   description: Error message describing the conflict
 *                   example: Duplicate ID
 *                 data:
 *                   type: object
 *                   description: Additional error details
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       description: Type of error - indicates the category of the error
 *                       example: DUPLICATE_ERROR
 *                     description:
 *                       type: string
 *                       description: Detailed description of the error
 *                       example: The provided ID already exists.
 *       500:
 *         description: Internal server error - occurs for unexpected errors during processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response - always "error" for error responses
 *                   example: error
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: Error message describing the server error
 *                   example: Failed to create FOV data
 *                 data:
 *                   type: object
 *                   description: Additional error details
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       description: Type of error - indicates the category of the error
 *                       example: INTERNAL_SERVER
 *                     description:
 *                       type: string
 *                       description: Detailed description of the error
 *                       example: An error occurred while processing the request.
 */

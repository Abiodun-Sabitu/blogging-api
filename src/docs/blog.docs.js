/**
 * @swagger
 * tags:
 *   - name: Blog
 *     description: Blog management
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all published blogs
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of blogs per page
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Blog state (published or draft)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Blog title (search)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Field to order by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: asc or desc
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single published blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Sorry, we couldn't find the blog you are looking for. It may have been deleted or is not published yet.
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog (draft)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Blog created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Title and body are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Title and body are required
 *       409:
 *         description: Title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Title already exists, please use a different title.
 */

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Blog updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: You do not have permission to update this blog. Only the blog owner can make changes.
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Sorry, we couldn't find the blog you want to update. It may have been deleted or never existed.
 */

/**
 * @swagger
 * /blogs/{id}/publish:
 *   patch:
 *     summary: Publish a blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog published
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Your blog has been published successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Already published
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: This blog is already published!
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: You can only publish your own blogs. Please make sure you're the owner of this blog.
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: We couldn't find the blog you want to publish. It may have been deleted or never existed
 */

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Blog deleted successfully!
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: You do not have permission to delete this blog. Only the blog owner can delete it.
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Sorry, we couldn't find the blog you want to delete. It may have already been removed or never existed.
 */

/**
 * @swagger
 * /blogs/user/blogs:
 *   get:
 *     summary: Get all blogs for the logged-in user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         title:
 *           type: string
 *           example: My First Blog
 *         description:
 *           type: string
 *           example: This is a blog about Node.js
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["nodejs", "express"]
 *         body:
 *           type: string
 *           example: Lorem ipsum dolor sit amet...
 *         author:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 60d0fe4f5311236168a109cb
 *             first_name:
 *               type: string
 *               example: John
 *             last_name:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john@example.com
 *         state:
 *           type: string
 *           example: published
 *         read_count:
 *           type: integer
 *           example: 5
 *         reading_time:
 *           type: string
 *           example: 2 mins
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-06-17T12:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-06-17T12:00:00.000Z
 */
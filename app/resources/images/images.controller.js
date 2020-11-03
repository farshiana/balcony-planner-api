import aws from 'aws-sdk';
import config from '../../config/aws.config';

const awsConfig = config[process.env.NODE_ENV];
aws.config.update({
    secretAccessKey: awsConfig.secretAccessKey,
    accessKeyId: awsConfig.accessKeyId,
    region: awsConfig.region,
});

/**
 * @swagger
 * /images:
 *   post:
 *     tags:
 *       - Images
 *     description: Uploads an image
 *     responses:
 *       201:
 *         description: The URL of the uploaded image
 *       500:
 *         description: Internal error
 */
// eslint-disable-next-line import/prefer-default-export
export const addImage = async (req, res) => {
    try {
        const s3 = new aws.S3();
        const buffer = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        const response = await s3.upload({
            Bucket: awsConfig.bucket,
            Key: `images/image-${Date.now()}.jpeg`,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read',
        }).promise();

        res.status(201).send({ url: response.Location });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const s3 = new XAWS.S3({
   signatureVersion: 'v4'
})

const recipesBucket = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const recipeId = event.pathParameters.recipeId
   const uploadUrl = getUploadUrl(recipeId)
   return {
      statusCode: 201,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(
         {
            uploadUrl
         }
      )
   }
}

function getUploadUrl(recipeId: string) {
   return s3.getSignedUrl('putObject', {
      Bucket: recipesBucket,
      Key: recipeId
   })
}
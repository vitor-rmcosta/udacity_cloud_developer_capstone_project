import 'source-map-support/register'
import { getUserId } from '../utils'
import { getRecipes } from '../../businessLogic/recipes'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const userId = getUserId(event);

   const items = await getRecipes(userId);

   return {
      statusCode: 200,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({items})
   }
}
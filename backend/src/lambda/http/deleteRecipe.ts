import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteRecipes } from '../../businessLogic/recipes'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId

  console.log("Deleting recipe ID "+recipeId);
  
  await deleteRecipes(recipeId);

   return {
      statusCode: 200,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         recipeId
      })
   }
  
}

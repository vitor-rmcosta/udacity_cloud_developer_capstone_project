import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { RecipeRequest } from '../../requests/RecipeRequest'
import { updateRecipe } from '../../businessLogic/recipes'
import { getUserId } from '../utils'
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

   const userId = getUserId(event);
   const recipeId = event.pathParameters.recipeId;
   const toUpdateRecipe: RecipeRequest = JSON.parse(event.body)

   console.log("The item sent "+toUpdateRecipe);

   if(!toUpdateRecipe.name || !toUpdateRecipe.description || !toUpdateRecipe.preparationTime || !toUpdateRecipe.ingredients || toUpdateRecipe.ingredients.length == 0){
      return {
         statusCode: 400,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
         },
         body: JSON.stringify(
            {
               item: toUpdateRecipe
            }
            )
         }
   }
   
   const item = await updateRecipe(toUpdateRecipe, recipeId, userId);

   console.log("Item updated "+item);

   return {
      statusCode: 201,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
         item
      })
   }
}

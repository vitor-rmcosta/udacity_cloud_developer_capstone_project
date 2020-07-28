import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { RecipeRequest } from '../../requests/RecipeRequest'
import { createRecipe } from '../../businessLogic/recipes'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

   const userId = getUserId(event);
   const newRecipe: RecipeRequest = JSON.parse(event.body);

   console.log("Creating new recipe");
   console.log(newRecipe);
   
   if(!newRecipe.name || !newRecipe.description || !newRecipe.preparationTime || !newRecipe.ingredients || newRecipe.ingredients.length == 0){
      return {
         statusCode: 400,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
         },
         body: JSON.stringify(
            {
               item: newRecipe
            }
            )
         }
   }
   const newItem = await createRecipe(newRecipe, userId);

   console.log("Item created");
   console.log(newItem);

   return {
      statusCode: 201,
      headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(
         {
            item: {
               ...newItem,
            }
         }
      )
   }
}

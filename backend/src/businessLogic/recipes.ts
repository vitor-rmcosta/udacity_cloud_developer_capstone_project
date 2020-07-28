import { RecipeAccess } from '../dataLayer/recipeAccess'
import { RecipeRequest } from '../requests/RecipeRequest'
import * as uuid from 'uuid'

const recipesBucket = process.env.IMAGES_S3_BUCKET
const recipeAccess = new RecipeAccess()

export async function getRecipes(userId : string){
   return await recipeAccess.getRecipes(userId);
}
export async function deleteRecipes(recipeId : string){
   return await recipeAccess.deleteRecipe(recipeId);
}
export async function updateRecipe(toUpdate : RecipeRequest, recipeId : string, userId : string){

   console.log("Retrieving existing recipe");
   
   const existingRecipe = await recipeAccess.getRecipe(recipeId);

   console.log(existingRecipe);
   
   const updatedItem = {
      recipeId: recipeId,
      userId: userId,
      attachmentUrl: existingRecipe.attachmentUrl,
      ...toUpdate
   }

   console.log("Updating "+updatedItem);
   
   return await recipeAccess.updateRecipe(updatedItem);
}
export async function createRecipe(newRecipe : RecipeRequest, userId : string){

   const recipeId = uuid.v4();

   const newItem = {
      userId,
      recipeId,
      ...newRecipe,
      attachmentUrl: `https://${recipesBucket}.s3.amazonaws.com/${recipeId}`
   }

   return await recipeAccess.createRecipe(newItem);
}


 
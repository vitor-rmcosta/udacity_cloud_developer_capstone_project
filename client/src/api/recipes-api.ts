import { apiEndpoint } from '../config'
import { Recipe } from '../types/Recipe';
import { RecipeRequest } from '../types/RecipeRequest';
import Axios from 'axios'

export async function getRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Recipes:', response.data)
  return response.data.items
}

export async function createRecipe(
  idToken: string,
  newRecipe: RecipeRequest
): Promise<Recipe> {
  const response = await Axios.post(`${apiEndpoint}/recipes`,  JSON.stringify(newRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function updateRecipe(
  idToken: string,
  recipeId: string,
  updateRecipe: RecipeRequest
): Promise<Recipe> {
  const response = await Axios.patch(`${apiEndpoint}/recipes/${recipeId}`, JSON.stringify(updateRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function deleteRecipe(
  idToken: string,
  recipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  recipeId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/recipes/${recipeId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

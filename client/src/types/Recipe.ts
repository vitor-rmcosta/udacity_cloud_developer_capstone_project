import { Ingredient } from '../types/Ingredient'

export interface Recipe {
   recipeId: string
   name: string
   preparationTime: string
   ingredients: Ingredient[]
   description: string
   attachmentUrl?: string
}

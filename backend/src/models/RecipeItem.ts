export interface RecipeItem {
  userId: string
  recipeId: string
  name: string
  ingredients : any[],
  description: string,
  preparationTime: string,
  attachmentUrl?: string
}

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { RecipeItem } from '../models/RecipeItem'

export class RecipeAccess {

   constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly recipesTable = process.env.RECIPES_TABLE,
      private readonly userIdIndex = process.env.USER_ID_INDEX) {}
   
   async createRecipe(newItem : RecipeItem): Promise<RecipeItem> {
      await this.docClient
         .put({
            TableName: this.recipesTable,
            Item: newItem
         }).promise();
      return newItem
   }

   async updateRecipe(newItem : RecipeItem): Promise<RecipeItem> {
      await this.docClient
         .put({
            TableName: this.recipesTable,
            Item: newItem
         }).promise();
      return newItem
   }

   async getRecipe(recipeId : string){
      const result = await this.docClient.get({
         TableName: this.recipesTable,
         Key:{
            recipeId: recipeId
          },
      }).promise()
   
      return result.Item
   }

   async getRecipes(userId : string){
      const result = await this.docClient.query({
         TableName: this.recipesTable,
         IndexName: this.userIdIndex,
         KeyConditionExpression: 'userId = :userId',
         ExpressionAttributeValues: {
            ':userId': userId,
         },
      }).promise()
   
      return result.Items
   }

   async deleteRecipe(recipeId: string) {
      await this.docClient
         .delete({
            Key: {
               recipeId: recipeId
            },
            TableName: this.recipesTable,
         })
         .promise()
      return recipeId
   }
   
}
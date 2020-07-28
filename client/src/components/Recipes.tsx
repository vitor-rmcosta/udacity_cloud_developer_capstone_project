import dateFormat from 'dateformat'
import { History } from 'history'
import { Form, Table, ItemContent } from 'semantic-ui-react'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Dropdown,
  Item,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Loader,
  Modal
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes, getUploadUrl, uploadFile, updateRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'

interface RecipesProps {
  auth: Auth
  history: History
}

interface Ingredient{
   name: string,
   quantity: any 
}

interface RecipesState {
  recipes: Recipe[],
  ingredients : Ingredient[],
  name: string,
  description: string,
  preparationTime: string,
  newIngredientName: string,
  newIngredientQuantity: any,
  loadingRecipes: boolean,
  showAddNew: boolean,
  recipeId: string,
  file: any
}

const ingredients = [
   { key: 'brownrice', text: 'Brown Rice', value: 'Brown Rice' },
   { key: 'carrot', text: 'Carrot', value: 'Carrot' },
   { key: 'garlic', text: 'Garlic', value: 'Garlic' },
   { key: 'onio', text: 'Onion', value: 'Onion' },
 ]

const quantity = [
   { key: '1', text: '1', value: '1', },
   { key: '2', text: '2', value: '2', },
   { key: '3', text: '3', value: '3', },
   { key: '4', text: '4', value: '4', },
   { key: '5', text: '5', value: '5', },
]

export class Recipes extends React.Component<RecipesProps, RecipesState> {
   state: RecipesState = {
    recipes: [],
    ingredients : [],
    name : "",
    description : "",
    preparationTime: "",
    newIngredientName: '',
    newIngredientQuantity : 1,
    loadingRecipes: true,
    showAddNew: false,
    recipeId: "",
    file: undefined
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   this.setState({ name: event.target.value });
  } 

  handlePreparationTime = (event: React.ChangeEvent<HTMLInputElement>) => {
   this.setState({ preparationTime: event.target.value });
  } 

  handleDescriptionChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
     this.setState({ description: event.currentTarget.value });
  } 

  handleIngredientChange = (event: React.SyntheticEvent<HTMLElement> , {value} : any) => {
      this.setState({ newIngredientName: value });
  }

  handleIngredientQuantityChange = (event: React.SyntheticEvent<HTMLElement> , {value} : any) => {
    this.setState({ newIngredientQuantity: value });
  }

  toggleModal = (event: React.SyntheticEvent<HTMLElement> , {value} : any) => {
   this.setState({
      name : "",
      description : "",
      preparationTime: "",
      recipeId: "",
      ingredients : [],
      showAddNew: !this.state.showAddNew
   });
  }

  handleAddIngredient = (event : any) => {
      let ingredients = this.state.ingredients;
      let ingredient = this.state.ingredients.find(ing => ing.name === this.state.newIngredientName);
      if(ingredient){
         let total = parseInt(ingredient.quantity) + parseInt(this.state.newIngredientQuantity);
         ingredient.quantity = total;
      }else{
         ingredients.push({name : this.state.newIngredientName, quantity : this.state.newIngredientQuantity});
      }
      this.setState({
         ingredients: ingredients
      });
      event.preventDefault();
  }

   handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      this.setState({
      file: files[0]
      })
   }

   editRecipe = async (recipeId: string) => {
      let toEdit = this.state.recipes.find(recipe => recipe.recipeId == recipeId);
      if(toEdit){
         this.setState({
            name : toEdit.name,
            description : toEdit.description,
            preparationTime: toEdit.preparationTime,
            recipeId: toEdit.recipeId,
            ingredients : toEdit.ingredients,
            showAddNew: true,
         });
      }
   }
   deleteRecipe = async (recipeId: string) => {
      console.log("clicou aqui");
      try {
         await deleteRecipe(this.props.auth.getIdToken(), recipeId)
         this.setState({
            recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
         })
      } catch {
         alert('Recipe deletion failed')
      }
   }

   removeIngredient = async (event : any, pos: number) => {
     let ingredients = this.state.ingredients;
     ingredients.splice(pos, 1);
     this.setState({
         ingredients: ingredients
      });
   }

   updateRecipeItem = async (event: React.MouseEvent) => {
      if(this.state.file){
         const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.state.recipeId);
         await uploadFile(uploadUrl, this.state.file);
      }
      try{
         await updateRecipe(this.props.auth.getIdToken(), this.state.recipeId ,{
            name : this.state.name,
            ingredients : this.state.ingredients,
            description : this.state.description,
            preparationTime : this.state.preparationTime
         });
         const recipes = await getRecipes(this.props.auth.getIdToken())
         this.setState({
            recipes,
            showAddNew: false
         });
      }catch {
         alert('Recipe update failed');
      }
   }

   saveNewRecipe = async (event: React.MouseEvent) => {
      try{
         const newRecipe = await createRecipe(this.props.auth.getIdToken(), {
            name : this.state.name,
            ingredients : this.state.ingredients,
            description : this.state.description,
            preparationTime : this.state.preparationTime
         })
         this.setState({
           recipes: [...this.state.recipes, newRecipe],
           ingredients : [],
           name : "",
           description : "",
           preparationTime : "",
           newIngredientName : "",
           newIngredientQuantity : "",
           showAddNew : false
         })
      }catch {
         alert('Recipe creation failed');
      }
  }

  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipes,
        loadingRecipes: false
      });
    } catch (e) {
      console.log(`Failed to fetch recipes: ${e.message}`);
      this.setState({loadingRecipes: false});
    }
  }

  render() {
    return (
      <div>
        <Button basic color='blue' onClick={this.toggleModal}>Save New Recipe</Button>

        {this.renderCreateRecipeInput()}

        <Header as="h3">Your recipes</Header>

        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {  
    return (
      <Grid.Row>
        <Grid.Column width={16}>
            <Modal open={this.state.showAddNew}>
               <Modal.Header>Save New Recipe</Modal.Header>
               <Modal.Content>        
                  <Grid.Row>
                     <Grid.Column width={16}>
                        <Form>
                           {
                              this.state.recipeId ?
                                 <Form.Field required width={16}>
                                    <label>Recipe Image</label>
                                    <input type="file" accept="image/*" placeholder="Image to upload" onChange={this.handleFileChange}/>
                                 </Form.Field>
                              :
                              null
                           }
                           <Form.Group>
                              <Form.Field required width={12}>
                                 <label>Recipe Name</label>
                                 <Input onChange={this.handleNameChange} value={this.state.name} />
                              </Form.Field>
                              <Form.Field required width={4}>
                                 <label>Preparation time</label>
                                 <Input type="number" value={this.state.preparationTime} label={{ basic: true, content: 'minutes' }} labelPosition='right' onChange={this.handlePreparationTime} />
                              </Form.Field>
                           </Form.Group>
                           <Form.Group>
                              <Form.Field width={12}>
                                 <label>Choose the ingredients (one or more)</label>
                                 <Dropdown
                                    fluid
                                    selection
                                    search
                                    options={ingredients}
                                    onChange={this.handleIngredientChange}
                                    name="ingredient"
                                 
                                 />
                              </Form.Field>
                              <Form.Select
                                 fluid
                                 label='Quantity'
                                 options={quantity}
                                 width={2}
                                 onChange={this.handleIngredientQuantityChange}
                                 name="ingredient"
                              />
                              <Form.Field width={2}>
                              <label>&nbsp;</label>
                                 <Button onClick={this.handleAddIngredient}>Add</Button>
                              </Form.Field>
                           </Form.Group>
                              {
                                 this.state.ingredients.length > 0 ? 
                                    <Form.Group>
                                       <Table celled striped>
                                          <Table.Header>
                                             <Table.Row>
                                                <Table.HeaderCell colSpan='3'>Ingredients</Table.HeaderCell>
                                             </Table.Row>
                                          </Table.Header>
                                          <Table.Body>
                                             {this.state.ingredients.map((recipe, pos) => 
                                                <Table.Row key={pos}>
                                                   <Table.Cell collapsing>
                                                      {recipe.name}
                                                   </Table.Cell>
                                                   <Table.Cell>{recipe.quantity} itens</Table.Cell>
                                                   <Table.Cell collapsing textAlign='right'>
                                                      <Button compact basic onClick={(e) => this.removeIngredient(e, pos)} color='red'>x</Button>
                                                   </Table.Cell>
                                                </Table.Row>
                                             )}
                                          </Table.Body>
                                       </Table>
                                    </Form.Group>
                                 :
                                    null
                              }
                              <Form.TextArea required value={this.state.description} onChange={this.handleDescriptionChange} label='Description' placeholder='Describe here how to prepare this recipe.' />
                        </Form>
                     </Grid.Column>
                  </Grid.Row>
               </Modal.Content>
               <Modal.Actions>
                  <Button onClick={this.toggleModal} negative>Cancel</Button>
                  {
                     this.state.recipeId ?
                        <Button onClick={this.updateRecipeItem} positive icon='checkmark'labelPosition='right' content='Update'/>
                     :
                        <Button onClick={this.saveNewRecipe} positive icon='checkmark'labelPosition='right' content='Save'/>
                  }
               </Modal.Actions>
           </Modal>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Retrieving your recipes...
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
     if(!this.state.recipes || this.state.recipes.length == 0){
         return(
            <div style={{textAlign: "center"}}>You don't have any saved recipe.</div>
         )
     }else{
         let items = this.state.recipes.map((recipe, pos) => {
            return <Item key={pos}>
                     <Item.Image size='tiny' src={recipe.attachmentUrl} />
                        
                     <Item.Content>
                        <Item.Header as='a'>{recipe.name}</Item.Header>
                        <Item.Meta>{recipe.preparationTime} Minutes Preparation</Item.Meta>
                        <Item.Description>
                           {recipe.description}
                        </Item.Description>
                        <Item.Extra> 
                           <Button basic compact color="red" floated='right' onClick={() => this.deleteRecipe(recipe.recipeId)}>
                              Delete
                           </Button>
                           <Button basic compact color="blue" floated='right' onClick={() => this.editRecipe(recipe.recipeId)}>
                              Edit
                           </Button>
                           {recipe.ingredients.map((ingredient, position) => {
                              return <Label key={position}>{ingredient.name} ({ingredient.quantity} items)</Label>
                           })}
                        </Item.Extra>
                     </Item.Content>
                  </Item> 
            ;
         });
         return(
            <Grid.Row>
               <Grid.Column width={16}>
                  <Item.Group>
                     {items}
                  </Item.Group>            
               </Grid.Column>
            </Grid.Row>
         )
     }
  }

}

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/
import Application from '@ioc:Adonis/Core/Application'
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.post('/register' , 'UsersController.register')

  Route.post('/login' , 'UsersController.login')

  Route.resource('/country' , 'CountriesController').middleware({'*' : 'auth'})

  Route.resource('/category' , 'CategoriesController').middleware({'*' : 'auth'})

  Route.resource('/ad' , 'AdsController').middleware({'*' : 'auth'})

  Route.get('/myAds/:page' , 'AdsController.myAds').middleware('auth')

  Route.get('/latestAds/:number' , 'AdsController.latestAds').middleware('auth')

  Route.get('/mostLiked/:number' , 'AdsController.mostLiked').middleware('auth')

  Route.resource('/comment' , 'CommentsController').middleware({'*' : 'auth'})

  Route.resource('/user' , 'UsersController').middleware({'*' : 'auth'})

}).prefix('/api/v1')

Route.get('uploads/:filename', async ({ response, params }) => {
  response.download(Application.makePath('/public/uploads', params.filename))
})
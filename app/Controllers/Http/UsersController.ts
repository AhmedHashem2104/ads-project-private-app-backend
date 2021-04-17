import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema , rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
    public async register ({ response , request , auth }: HttpContextContract) {
        const usersSchema = schema.create({
            username: schema.string({} , [
                rules.unique({ column : 'username' , table : 'users' })
            ]),
            nickname: schema.string.optional(),
            email: schema.string({} , [
                rules.email(),
                rules.unique({ column : 'email' , table : 'users' })
            ]),
            password : schema.string({} , [
                rules.minLength(8),
                rules.maxLength(15),
                rules.confirmed()
            ]),
            // country_id: schema.number()
          })
          const messages = {
              'username.required' : `username is required`,
              'username.unique' : `username is already exists`,
              'nickname.string' : `nickname should be string`,
              'email.required' : `email is required`,
              'email.email' : `email should be valid email`,
              'email.unique' : `email is already exists`,
              'password.required' : `password is required`,
              'password.minLength' : `password should be between 8 - 15 characters`,
              'password.maxLength' : `password should be between 8 - 15 characters`,
              'password_confirmation.confirmed' : `password does not match`
            //   'country_id.required' : `country is required`,
            //   'country_id.number' : `country should be number`
          }
        const validatedData = await request.validate({
            schema: usersSchema,
            messages : messages
          })
        validatedData.nickname = validatedData.username.replace(/\s+/g, '-').toLowerCase()
        const query = await User.create(validatedData)
        const token = await auth.use('api').attempt(validatedData.email, validatedData.password)
        return response.status(200).json({
            user : query,
            token : token
        })
      }

      public async login ({ response , request , auth }: HttpContextContract) {
        const usersSchema = schema.create({
            email: schema.string({} , [
                rules.email(),
            ]),
            password : schema.string({} , [
                rules.minLength(8),
                rules.maxLength(15)
            ])
          })
          const messages = {
              'email.required' : `email is required`,
              'email.email' : `email should be valid email`,
              'password.required' : `password is required`,
              'password.minLength' : `password should be between 8 - 15 characters`,
              'password.maxLength' : `password should be between 8 - 15 characters`
          }
        const validatedData = await request.validate({
            schema: usersSchema,
            messages : messages
          })
        const token = await auth.use('api').attempt(validatedData.email, validatedData.password)
        return response.status(200).json({
            user : auth.user,
            token : token
        })
      }

      public async index ({ response }: HttpContextContract) {
        const query = await User.all()
        if(query.length === 0)
          return response.status(400).json({ message : 'No Data Found' })
        return response.status(200).json(query)
      }
      public async show ({ response , params }: HttpContextContract) {
        const query = await User.query().where('id' , params.id).first()
        if(!query)
          return response.status(400).json({
            message : 'No Data Found'
          })
        return response.status(200).json(query)
      }

      public async update ({ response , request , params }: HttpContextContract) {
        const usersSchema = schema.create({
          username: schema.string.optional({} , [
            rules.unique({ column : 'username' , table : 'users' })
        ]),
        nickname: schema.string.optional(),
        password : schema.string.optional({} , [
            rules.minLength(8),
            rules.maxLength(15),
            rules.confirmed()
        ]),
        })
        const messages = {
          'username.string' : `username shoule be valid string`,
          'username.unique' : `username is already exists`,
          'nickname.string' : `nickname should be string`,
          'password.string' : `password should be between 8 - 15 characters`,
          'password.minLength' : `password should be between 8 - 15 characters`,
          'password.maxLength' : `password should be between 8 - 15 characters`,
          'password_confirmation.confirmed' : `password does not match`
        //   'country_id.required' : `country is required`,
        //   'country_id.number' : `country should be number`
      }
      const validatedData = await request.validate({
          schema: usersSchema,
          messages : messages
        })
        try{
          await User.query().where('id' , params.id).update(validatedData)
          return response.status(200).json({
            message : 'Country updated successfully'
          })
        }
        catch(err){
          return response.status(400).json({
            message : 'No thing to be updated'
          })
        }
      }

      public async destroy ({ response , params }: HttpContextContract) {
        try{
          const query = await User.findOrFail(params.id)
          await query.delete()
          return response.status(200).json({
            message : 'User deleted successfully'
          })
        }
        catch(err){
          return response.status(400).json({
            message : 'No thing to be deleted'
          })
        }
      }
}

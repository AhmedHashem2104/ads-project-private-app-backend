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
                rules.confirmed(),
                rules.minLength(8),
                rules.maxLength(15)
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
              'password.requried' : `password is required`,
              'password.minLength' : `password should be between 8 - 15 characters`,
              'password.maxLength' : `password should be between 8 - 15 characters`,
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
}

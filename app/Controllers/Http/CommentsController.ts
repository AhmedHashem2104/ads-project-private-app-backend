import { schema , rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async index ({ response }: HttpContextContract) {
    const query = await Comment.all()
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)
  }

  public async store ({ response , request , auth }: HttpContextContract) {
    const commentsSchema = schema.create({
      message : schema.string(),
      receiver_id : schema.number(),
      ad_id : schema.number()
    })
    const messages = {
        'message.required' : `message is required`,
        'message.string' : `message should be string`,
        'receiver_id.required' : `receiver id is required`,
        'receiver_id.number' : `receiver id should be a number`,
        'ad_id.required' : `ad id is required`,
        'ad_id.number' : `ad id should be a number`
    }
    const validatedData = await request.validate({
      schema: commentsSchema,
      messages : messages
    })
    const query = await Comment.create({...validatedData , sender_id : auth.user?.id})
    return response.status(200).json(query)

  }

  public async show ({ response , params }: HttpContextContract) {
    const query = await Comment.query().where('id' , params.id).first()
    if(!query)
      return response.status(400).json({
        message : 'No Data Found'
      })
    return response.status(200).json(query)

  }


  public async update ({ response , request , params }: HttpContextContract) {
    const commentsSchema = schema.create({
      message : schema.string.optional()
    })
    const messages = {
        'message.string' : `message should be string`
    }
    const validatedData = await request.validate({
      schema: commentsSchema,
      messages : messages
    })
    try{
      await Comment.query().where('id' , params.id).update(validatedData)
      return response.status(200).json({
        message : 'Comment updated successfully'
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
      const query = await Comment.findOrFail(params.id)
      await query.delete()
      return response.status(200).json({
        message : 'Comment deleted successfully'
      })
    }
    catch(err){
      return response.status(400).json({
        message : 'No thing to be deleted'
      })
    }
  }
}

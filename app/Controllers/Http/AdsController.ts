import { schema , rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ad from 'App/Models/Ad'
import Application from '@ioc:Adonis/Core/Application'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

export default class AdsController {
  public async index ({ response }: HttpContextContract) {
    const query = await Ad.all()
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)
  }

  public async latestAds ({ response , params }: HttpContextContract) {
    const query = await Ad.query().limit(params.number).orderBy('id' , 'desc')
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)
  }

  public async mostLiked ({ response , params }: HttpContextContract) {
    const query = await Ad.query().limit(params.number).orderBy('likes' , 'desc').orderBy('id' , 'desc')
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)
  }

  public async store ({ response , request , auth }: HttpContextContract) {
    let youtubeLink = request.input('youtube')
    if(youtubeLink){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = youtubeLink?.match(regExp);
      if(match&&match[7].length==11){
        youtubeLink = match[7]
        console.log('dwef', youtubeLink)
        request.all().youtube = youtubeLink
      }
      else{
        return response.status(400).json({
          message : `please enter valid youtube url`
        })
      }
    }
    const adsSchema = schema.create({
      name: schema.string({} , [
          rules.unique({ column : 'name' , table : 'ads' }),
      ]),
      description: schema.string(),
      image: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg' , 'webp']
      }),
      video: schema.file.optional({
        size: '50mb',
        extnames: ['mp4' , 'webm' , 'mkv']
      }),
      youtube: schema.string.optional({} , [
        // rules.url(),
        rules.unique({ column: 'youtube' , table : 'ads' })
      ]),
      category_id: schema.number(),
      country_id: schema.number()
    })
    const messages = {
        'name.required' : `name is required`,
        'name.unique' : `name is already exists`,
        'description.required' : `description is required`,
        'image.file' : `image is required`,
        'image.file.size' : `image should be under 2mb`,
        'image.file.extname' : `image should be (jpg , png , jpeg , webp)`,
        'video.file' : `icon is required`,
        'video.file.size' : `icon should be under 50mb`,
        'video.file.extname' : `icon should be (mp4 , webm , mkv)`,
        'youtube.unique' : `youtube is already exists`,
        // 'youtube.url' : `youtube should be valid url`,
        'category_id.required' : `category should be selected`,
        'category_id.number' : `category should be a number`,
        'country_id.required' : `country should be selected`,
        'country_id.number' : `country should be a number`
    }
    const validatedData = await request.validate({
      schema: adsSchema,
      messages : messages
    })
    const query = await Ad.create({...validatedData , user_id : auth.user?.id , image : validatedData.image?.fileName , video : validatedData.video?.fileName})
    await validatedData.image.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.image.extname}`
    })
    if(validatedData.video)
    await validatedData.video.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.video.extname}`
    })
    await imagemin([`public/uploads/${validatedData.image.fileName}`], {
      destination: 'public/uploads',
      plugins: [
          imageminWebp({quality: 30})
      ]
    })
    return response.status(200).json(query)
  }

  public async show ({ response , params }: HttpContextContract) {
    const query = await Ad.query().where('id' , params.id).first()
    if(!query)
      return response.status(400).json({
        message : 'No Data Found'
      })
    return response.status(200).json(query)

  }

  public async update ({ response , request , params }: HttpContextContract) {
    let youtubeLink = request.input('youtube')
    if(youtubeLink){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = youtubeLink?.match(regExp);
      if(match&&match[7].length==11){
        youtubeLink = match[7]
        request.all().youtube = youtubeLink
      }
      else{
        return response.status(400).json({
          message : `please enter valid youtube url`
        })
      }
    }
    const adsSchema = schema.create({
      name: schema.string.optional(),
      description: schema.string.optional(),
      image: schema.file.optional({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg' , 'webp']
      }),
      video: schema.file.optional({
        size: '50mb',
        extnames: ['mp4' , 'webm']
      }),
      youtube: schema.string.optional({} , [
        // rules.url(),
        // rules.unique({ column: 'youtube' , table : 'ads' })
      ]),
      category_id: schema.number.optional(),
      country_id: schema.number.optional()
    })
    const messages = {
      'name.string' : `name should be valid string`,
      'description.string' : `description should be valid string`,
      'image.file' : `image should be (jpg , png , jpeg , webp)`,
      'image.file.size' : `image should be under 2mb`,
      'image.file.extname' : `image should be (jpg , png , jpeg)`,
      'video.file' : `video should be (mp4 , webm)`,
      'video.file.size' : `video should be under 50mb`,
      'video.file.extname' : `video should be (mp4 , webm)`,
      'youtube.string' : `youtube should be valid youtube url`,
      // 'youtube.unique' : `youtube is already exists`,
      // 'youtube.url' : `youtube should be valid url`,
      'category_id.number' : `category should be a number`,
      'country_id.number' : `country should be a number`
  }
    const validatedData = await request.validate({
      schema: adsSchema,
      messages : messages
    })
    if(validatedData.image){
    await validatedData.image.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.image.extname}`
    })
    await imagemin([`public/uploads/${validatedData.image.fileName}`], {
      destination: 'public/uploads',
      plugins: [
          imageminWebp({quality: 30})
      ]
    })
    }
    if(validatedData.video){
    await validatedData.video.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.video.extname}`
    })
    }
    try{
      await Ad.query().where('id' , params.id).update({...validatedData , image : validatedData.image?.fileName , video : validatedData.video?.fileName})
      return response.status(200).json({
        message : 'Ad updated successfully'
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
      const query = await Ad.findOrFail(params.id)
      await query.delete()
      return response.status(200).json({
        message : 'Ad deleted successfully'
      })
    }
    catch(err){
      return response.status(400).json({
        message : 'No thing to be deleted'
      })
    }
  }
}

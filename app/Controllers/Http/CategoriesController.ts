import { schema , rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Application from '@ioc:Adonis/Core/Application'
import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'

export default class CategoriesController {
  public async index ({ response }: HttpContextContract) {
    const query = await Category.all()
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)
  }

  public async store ({ response , request }: HttpContextContract) {
    const categoriesSchema = schema.create({
      name: schema.string({} , [
          rules.unique({ column : 'name' , table : 'categories' }),
      ]),
      description: schema.string(),
      image: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      }),
      icon: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })
    })
    const messages = {
        'name.required' : `name is required`,
        'name.unique' : `name is already exists`,
        'description.required' : `description is required`,
        'image.file' : `image is required`,
        'image.file.size' : `image should be under 2mb`,
        'image.file.extname' : `image should be (jpg , png , jpeg)`,
        'icon.file' : `icon is required`,
        'icon.file.size' : `icon should be under 2mb`,
        'icon.file.extname' : `icon should be (jpg , png , jpeg)`
    }
    const validatedData = await request.validate({
      schema: categoriesSchema,
      messages : messages
    })
    await validatedData.image.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.image.extname}`
    })
    await validatedData.icon.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.icon.extname}`
    })
    await imagemin([`public/uploads/${validatedData.image.fileName}` , `public/uploads/${validatedData.icon.fileName}`], {
      destination: 'public/uploads',
      plugins: [
          imageminWebp({quality: 30})
      ]
    })
    const query = await Category.create({...validatedData , image : validatedData.image.fileName , icon : validatedData.icon.fileName})
    return response.status(200).json(query)
  }

  public async show ({ response , params }: HttpContextContract) {
    const query = await Category.query().where('id' , params.id).first()
    if(!query)
      return response.status(400).json({
        message : 'No Data Found'
      })
    return response.status(200).json(query)
  }


  public async update ({ response , request , params }: HttpContextContract) {
    const categoriesSchema = schema.create({
      name: schema.string.optional(),
      description: schema.string.optional(),
      image: schema.file.optional({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      }),
      icon: schema.file.optional({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg']
      })
    })
    const messages = {
        'name.string' : `name should be valid string`,
        'description.string' : `description should be valid string`,
        'image.file' : `image should be valid file`,
        'image.file.size' : `image should be under 2mb`,
        'image.file.extname' : `image should be (jpg , png , jpeg)`,
        'icon.file' : `icon should be valid file`,
        'icon.file.size' : `icon should be under 2mb`,
        'icon.file.extname' : `icon should be (jpg , png , jpeg)`
    }
    const validatedData = await request.validate({
      schema: categoriesSchema,
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
    if(validatedData.icon){
    await validatedData.icon.move(Application.publicPath('uploads') , {
      name: `${new Date().getTime()}.${validatedData.icon.extname}`
    })
    await imagemin([`public/uploads/${validatedData.icon.fileName}`], {
      destination: 'public/uploads',
      plugins: [
          imageminWebp({quality: 30})
      ]
    })
    }
    try{
      await Category.query().where('id' , params.id).update({...validatedData , image : validatedData.image?.fileName , icon : validatedData.icon?.fileName})
      return response.status(200).json({
        message : 'Category updated successfully'
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
      const query = await Category.findOrFail(params.id)
      await query.delete()
      return response.status(200).json({
        message : 'Category deleted successfully'
      })
    }
    catch(err){
      return response.status(400).json({
        message : 'No thing to be deleted'
      })
    }
  }
}

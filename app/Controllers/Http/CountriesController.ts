import { schema , rules } from '@ioc:Adonis/Core/Validator';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Country from 'App/Models/Country'

export default class CountriesController {
  public async index ({ response }: HttpContextContract) {
    const query = await Country.all()
    if(query.length === 0)
      return response.status(400).json({ message : 'No Data Found' })
    return response.status(200).json(query)

  }


  public async store ({ response , request }: HttpContextContract) {
    const countriesSchema = schema.create({
      name: schema.string({} , [
          rules.unique({ column : 'name' , table : 'countries' }),
      ]),
      iso: schema.string({} , [
        rules.unique({ column : 'iso' , table : 'countries' }),
      ]),
      code: schema.string({} , [
      rules.unique({ column : 'code' , table : 'countries' }),
      ]),
    })
    const messages = {
        'name.required' : `name is required`,
        'name.unique' : `name is already exists`,
        'iso.required' : `iso is required`,
        'iso.unique' : `iso is already exists`,
        'code.required' : `code is required`,
        'code.unique' : `code is already exists`,
    }
  const validatedData = await request.validate({
      schema: countriesSchema,
      messages : messages
    })
    const query = await Country.create(validatedData)
    return response.status(200).json(query)

  }

  public async show ({ response , params }: HttpContextContract) {
    const query = await Country.query().where('id' , params.id).first()
    if(!query)
      return response.status(400).json({
        message : 'No Data Found'
      })
    return response.status(200).json(query)

  }


  public async update ({ response , request , params }: HttpContextContract) {
    const countriesSchema = schema.create({
      name: schema.string.optional(),
      iso: schema.string.optional(),
      code: schema.string.optional(),
    })
    const messages = {
        'name.required' : `name should be string`,
        'iso.required' : `iso should be string`,
        'code.required' : `code should be string`,
    }
  const validatedData = await request.validate({
      schema: countriesSchema,
      messages : messages
    })
    try{
      await Country.query().where('id' , params.id).update(validatedData)
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
      const query = await Country.findOrFail(params.id)
      await query.delete()
      return response.status(200).json({
        message : 'Country deleted successfully'
      })
    }
    catch(err){
      return response.status(400).json({
        message : 'No thing to be deleted'
      })
    }
  }
}

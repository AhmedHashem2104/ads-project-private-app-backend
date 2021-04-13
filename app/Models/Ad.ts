import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ad extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string
  
  @column()
  public description: string

  @column()
  public image: string

  @column()
  public video: string

  @column()
  public youtube: string

  @column()
  public likes: number

  @column()
  public user_id: number

  @column()
  public category_id: number

  @column()
  public country_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

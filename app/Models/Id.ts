import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Id extends BaseModel {
  @column({ isPrimary: true })
  public id: number
 
  @column()
  public qTag: string
 
  @column()
  public hospitalName: string
 
  @column()
  public hospitalAddress: string
 
  @column()
  public NIK: number
 
  @column()
  public name: string
 
  @column()
  public dateOfBirth: Date
 
  @column()
  public wallet: string

  @column.dateTime({ serializeAs: null})
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username').unique().notNullable()
      table.string('nickname').notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('avatar').notNullable()
      table.string('password', 180).notNullable()
      table.integer('country_id').unsigned().references('id').inTable('countries').onUpdate('CASCADE').onDelete('CASCADE')
      table.string('remember_me_token').nullable()
      table.timestamps(true , true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

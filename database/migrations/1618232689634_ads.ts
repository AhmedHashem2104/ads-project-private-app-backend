import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ads extends BaseSchema {
    protected tableName = 'ads'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name').notNullable()
            table.string('description').notNullable()
            table.string('image').notNullable()
            table.string('video').notNullable()
            table.string('youtube').unique().nullable()
            table.integer('likes').unsigned().defaultTo(0)
            table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
            table.integer('category_id').unsigned().references('id').inTable('categories').onUpdate('CASCADE').onDelete('CASCADE')
            table.integer('country_id').unsigned().references('id').inTable('countries').onUpdate('CASCADE').onDelete('CASCADE')
            table.timestamps(true , true)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}

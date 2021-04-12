import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Comments extends BaseSchema {
    protected tableName = 'comments'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('message').notNullable()
            table.integer('sender_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
            table.integer('receiver_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
            table.integer('likes').unsigned().notNullable()
            table.timestamps(true , true)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}

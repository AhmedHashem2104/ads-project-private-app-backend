import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Countries extends BaseSchema {
    protected tableName = 'countries'

    public async up () {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name').unique().notNullable()
            table.string('iso').unique().notNullable()
            table.string('code').unique().notNullable()
            table.timestamps(true , true)
        })
    }

    public async down () {
        this.schema.dropTable(this.tableName)
    }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 255).unique().notNullable()
      table.string('name', 255).notNullable()
      table.string('password').notNullable()
      table.string('NIK', 255).unique().notNullable()
      table.string('dateOfBirth', 255).notNullable()
      table.string('gender', 30).notNullable()
      table.string('bloodType', 255).notNullable()
      table.dateTime("deleted_at").defaultTo(null);
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

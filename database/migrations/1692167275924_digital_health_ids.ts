import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'digital_health_ids'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('qTag', 10).unique()
      table.string('email', 255).unique().notNullable()
      table.string('name', 30).notNullable()
      table.string('NIK', 255).unique().notNullable()
      table.string('dateOfBirth', 255).notNullable()
      table.string('gender', 255).notNullable()
      table.integer('age', 11).notNullable()
      table.string('bloodType', 255).notNullable()
      table.string('data', 255).notNullable()
      table.string('digitalId', 255).unique().nullable()
      table.string('hospitalName', 255).notNullable()
      table.string('hospitalAddress', 255).notNullable()
      table.string('status', 255).notNullable()
      table.string('walletAddress', 100).unique().nullable()
      table.string('privateKey', 100).unique().nullable()
      table.string('mnemonic', 100).unique().nullable()
      table.dateTime('deleted_at').defaultTo(null)
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

Coda.io Markdown Pack
=====================

Because of the limitations of formulas there's no way to block include a styled markdown document, but what we *can* do is use durable xpath selectors (that describe the rendered html), extract that slice of the page, then rerender it to text. In this way we can include living markdown documents in coda documentation.

Examples
--------

If I wanted to output a slice of markdown I'd need an expath selector for the (inclusive) selector to begin it and the (exclusive) selector that marks the boundary

```javascript
Markdown("https://raw.githubusercontent.com/khrome/perigress/master/README.md","//*[@id='5-generate-migrations']" ,"//*[@id='roadmap']" )
```

will output:

```text
5. GENERATE MIGRATIONS

Finally, because you can compute the difference between schema, you can also generate migrations for sets of changes of your data
definitions.

 * SQL + db-migrate [https://github.com/khrome/perigress/blob/master/docs/sql-db-migrate-migration.md]
 * Sequelize [https://github.com/khrome/perigress/blob/master/docs/sequelize-migration.md]
 * Mongo [https://github.com/khrome/perigress/blob/master/docs/mongo-migration.md]TBD
```

Testing
-------
To run an example case use:

```bash
npm run example
```
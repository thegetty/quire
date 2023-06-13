
## Quire Data Schemas

[JSON Schema](https://json-schema.org)

### Schema Identifiers

Schema Identifiers are a URI that includes the semantic version and the schema name. Schema versions correspond to the semantic version of `quire-11ty` that supports the schema.

```html
https://quire.getty.edu/schemas/v<version>/<schema-name>.json
```

### Schemas

#### config

```html
https://quire.getty.edu/schemas/v1.0.0/config.json
```

#### figures

```html
https://quire.getty.edu/schemas/v1.0.0/figures.json
```

#### objects

```html
https://quire.getty.edu/schemas/v1.0.0/objects.json
```

_Work-in-progress_ to use [json-schema-edtf](https://www.npmjs.com/package/json-schema-edtf)

#### publication

```html
https://quire.getty.edu/schemas/v1.0.0/publication.json
```

#### references

```html
https://quire.getty.edu/schemas/v1.0.0/references.json
```

_Work-in-progress_ to use [Citation Style Language](https://citationstyles.org) to validate publication references.

### Validation

Quire uses the [Ajv JSON schema validator](https://ajv.js.org) library to [compile](https://ajv.js.org/api.html#ajv-compile-schema-object-data-any-boolean-promise-any) and [validate](https://ajv.js.org/api.html#ajv-validate-schemaorref-object-string-data-any-boolean) the Quire project data, see [Quire Docs v1](https://quire.getty.edu/docs-v1/).

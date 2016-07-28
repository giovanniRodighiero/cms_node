# Models Configuration
To build up the models you need to set up the two files *defaultModels.json* and *customModels.json* correctly, those are used to "fake" the inheritance between models and to get the infos about fields and associations useful to build the admin interface correctly.

## defaultModels.json
This file identifies the "default models", models supposed to be the base class of some other models defined in the *customModels.json* file, that means models listed in this file ( defaultModels.json ) are not directly created.
The structure of the file is the following:
```javascript
{
  "defaults":{// 1)
    "_model_name":{// 2)
      "fields":[
        {"name":"_field_name", "params":[ // 3)
          {"parName":"_par_key","value":"_par_key"}, // 4)
          {"parName":"_par_key","value":"_par_key"}
          ]
        }
      ]
    },
    { ... },
    { ... }
  }
}
```
where each value starting with a `_` means that its content is supposed to be decided by the user, every other value needs to be left like in the example.

### Structure detailed description
1. root of the file.
2. entry point for a model, the value should be the model's name, all the chars of the model's name have to be written on lowcase, like `mysuperfancymodel`, or with _underscores_ like `my_super_fancy_model`.
 *NOTE:* it is *wrong* to use uppercase letter, even in the middle of the word, like ~~mySuperFancyModel.~~, that is because of how waterline transforms the model class into a database table: it converts the name on **all** lowcase letters, so to avoid conflict and mismatches of names it's easier to keep the names on lowcase chars.
3. for each field you want to use, you need one of this entry, where `"_field_name"` is the actual name of the field, and `"params":[]` contains the field's infos. It is also possible **to mark it as a file**, writing a simple flag `"isFile":"true"`, that way the in the admin panel the field is going to be shown as a *browse button* to upload a file.
4. map each key - value attributes of a field, refer to [Waterline docs](https://github.com/balderdashy/waterline-docs/blob/master/models/data-types-attributes.md) for infos on which values are allowed.


## customModels.json
This file identifies the actual models you want to use in your app: a model is going to be created only if it is listed in this file and must inherits from another model defined in the *defaultModels.json* file.

The structure of the file is the following:
```javascript
{
  "models":[ // 1)
    {
      "modelName":"_custom_model_name", // 2)
      "inheritsFrom": "_model_to_inherits_from", // 3)
      "fields":[
        {"name":"_field_name", "params":[ // 4)
          {"parName":"_par_key","value":"_par_key"} // 5)
          ]
        }
      ],
      "searchableFields":["email","createdAt","updatedAt"]// 6)
    },
    { ... },
    { ... }
}
```
### Structure detailed description
1. root of the file, should be an array.
2. the name of the model, same constraints listed before about the name convention are valid here as well.
3. the name of the model to inherits from.
4. as for the *defaultModels.json* this object defines a field of the model, it has the same structure of that file.
5. as for the *defaultModels.json* this object defines the attributes of a field, it has the same structure of that file.
6. defines the fields you want to be searchable on gets request, every field not listed in here will be ignored in the actual queries.

### Associations with other models
To express associations with other models, you have to mark the field in a specific way:

```javascript
{"name":"news_id", "isAssociation":{"type":"single", "searchWith":"title"}, "params":[
    {"parName":"model", "value":"news"}
  ]
}
```

in this example we are specifying that "news_id" is a field that refers to the model "news", in a one-to-many association.
* "*isAssociation*" flags the field as an association; "type" specify if it is a one-to-many (**-> single**) or a many-to-many(**-> multiple**); "searchWith" specify the field's name of the associated model (in this example that model is "news") to be used as label while displaying the populated field (in this example that label in "title", so in the admin panel instead of the id of the record, the field "title" will be shown).
* "*attributes*" for *single* type associations (one-to-many), one of the attributes has to be `{"parName":"model", "value":"_model_name"}`, to respect [waterline's convention on association]("https://github.com/balderdashy/waterline-docs/blob/master/models/associations/one-to-many.md"); while for *multiple* type of associations (many-to-many), two of the attributes has to be `{"parName":"collection", "value":"news"},{"parName":"via", "value":"manydummyModels"}`.

Waterline convention for naming join tables is 'firstModelName_fieldName__secondModelName_fieldName'

# Models Configuration
To build up the models you need to set up the two files *defaultModels.json* and *customModels.json* correctly, those are used to "fake" the inheritance between models and to get the infos about fields and associations useful to build the admin interface correctly.

## defaultModels.json
This file identifies the "default models", models supposed to be the base class of some other models defined in the *customModels.json* file.
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
3. for each field you want to use, you need one of this entry, where `"_field_name"` is the actual name of the field, and `"params":[]` contains the field's infos. It is also possible **to mark it as a file**, writing a simple flag `"isFile":"true"`, that way the in the admin panel the field is going to be show as a *browse button* to upload a file.

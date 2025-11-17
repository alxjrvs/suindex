# classes.core

Core character classes in Salvage Union

## Metadata

- **Schema ID**: `classes.core`
- **Schema File**: `schemas/classes.core.schema.json`
- **Data File**: `data/classes.core.json`
- **Total Items**: 6

## Fields

| Field          | Type          | Required | Description                                      |
| -------------- | ------------- | -------- | ------------------------------------------------ |
| `maxAbilities` | integer       | ✅       | Maximum number of abilities this class can have  |
| `advanceable`  | boolean       | ✅       | Whether this class can advance to hybrid classes |
| `coreTrees`    | Array<`tree`> | ✅       | Core ability trees available to this class       |
| `content`      | `content`     | ❌       |                                                  |

## Example

```json
{
  "id": "2b3699e5-399b-4085-ad24-c497c94aa4db",
  "name": "Engineer",
  "source": "Salvage Union Workshop Manual",
  "asset_url": "https://opxrguskxuogghzcnppk.supabase.co/storage/v1/object/public/LP-Assets/classes.core/engineer.jpg",
  "coreTrees": ["Mechanical Knowledge", "Forging", "Mech-Tech"],
  "maxAbilities": 10,
  "advanceable": true,
  "page": 26,
  "content": [
    {
      "type": "paragraph",
      "value": "Engineers form an integral component of the Union, the grease that keeps our Mechs and Crawlers trundling across the great wastelands. They can take apart and put back together a Mech Chassis in the blink of an eye, and keep their salvage crew operational out in the wastes. Choose an Engineer if you want a character with a breadth of engineering and mechanical knowledge; who can repair and support you and your allies' Mechs, mount Mech parts significantly faster, and allow you to craft Mech parts in the field."
    }
  ]
}
```

## Schema Composition

This schema extends the following definitions:

- `shared/objects.schema.json#/definitions/baseEntity`

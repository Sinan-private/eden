Why the complex setup with a Resource here extending a Base class in Resource?

Because I am copying the base class between my different projcets and I want it to stay clean.

# Adding a resource

You should find everything in src/gameRules



## Adding a new resource

### base_resource
This comes without a cost. Meaning it will not have the extension of the trade value.

### processed_resource
This is produced from any other resources, like bread from flour, or land from gold.
This is really broad. Everything that consumes something to be generated falls into this category.

### build_resource
Is easiest understood as buildings. It is also a `processed_resource`, the differentiation is for different purpose

## Adding the initial value
Pretty straight forward. The value with which you start goes into `gameInit.ts`

## Adding the trading value
1 corn and 2 water produce 1 bread.
This is done in `ResourceConversion.ts`

Why in an extra file? Because it feels easier to read while balancing.


# Node server to update resources
With `node server.js` I can start a server that is listening on port 5001.
With this server I can overwrite my files to update initial values and create new resources.

## Save
Currently, the state is written as the new `initialResources.json`. This should have its own state management in Admin mode.
The types are stored in a json format as well as a .ts one. I can make a better version later but for now this makes for an easier reading.
The `resourceTypes.json` stores the data and should be dynamically updated. Afterwards the `resourceKeys.ts` and the `resourceTypes.ts` are overwritten using the `writeTypes.ts` function.


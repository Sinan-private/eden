Why the complex setup with a Resource here extending a Base class in Resource?

Because I am copying the base class between my different projcets and I want it to stay clean.

# Adding a resource
[TL:DR] types.ts, gameInit.ts, icons.ts, ResourceConversion.ts (unless it is a `base_resource`)

You should find everything in src/gameRules



## Adding a new resource
in types.ts you need to add the type of resource.

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
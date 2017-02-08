# Scenario

Product lifecycle database. During product lifecycle some events are generated. Applicaiton will process them build some analytics on top.

# Model

```
{
  "serialNumber": "P0000830",
  "product": "Cheese",
  "productName": "Small Frozen Mouse",
  "productAdjective": "Handcrafted",
  "productMaterial": "Granite",
  "site": "Huaway OEM"
}
```

# Events

`Production` - Produt created on factory.
`Service`, `Warranty`, `Note`, `Theft`, `Incendent` - Other events

# Database

products:
  sn: string: hash
  name: name of the product
  lefecycle:
    type:
    timestamp:
    sn: 
    country: 

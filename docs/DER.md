# Diagrama Entidad-Relacion — Barba Negra Drugstore

## Entidades y Relaciones

```
┌─────────────┐       ┌──────────────────┐       ┌──────────────┐
│    User     │       │      Order       │       │   OrderItem  │
├─────────────┤       ├──────────────────┤       ├──────────────┤
│ id (UUID)   │──┐    │ id (UUID)        │──┐    │ id (UUID)    │
│ name        │  │    │ total            │  │    │ quantity     │
│ email       │  │    │ deliveryType     │  │    │ price        │
│ password    │  │    │ address?         │  │    │ productName? │
│ role        │  │    │ phone?           │  │    │ orderId ─────┤──→ Order
│             │  │    │ notes?           │  │    │ productId? ──┤──→ Product
│             │  │    │ deliveryTime?    │  │    └──────────────┘
│             │  │    │ status           │  │
│             │  │    │ paymentStatus    │  └───→│
│             │  │    │ paymentId?       │       │
│             │  └───→│ userId           │       │
│             │       │ createdAt        │       │
└─────────────┘       └──────────────────┘       │
                                                  │
┌─────────────┐       ┌──────────────────┐        │
│  Category   │       │     Product      │        │
├─────────────┤       ├──────────────────┤        │
│ id (UUID)   │──┐    │ id (UUID)        │←───────┘
│ name        │  │    │ name             │
│             │  │    │ price            │
│             │  └───→│ categoryId       │
│             │       │ stock            │
└─────────────┘       │ unlimitedStock   │
                      │ image?           │
                      │ isCombo          │
                      └──────────────────┘

┌─────────────┐       ┌──────────────────┐
│   Setting   │       │   Promotion      │
├─────────────┤       ├──────────────────┤
│ key (PK)    │       │ id (UUID)        │
│ value       │       │ title            │
└─────────────┘       │ description      │
                      │ image?           │
                      │ price            │
                      │ originalPrice?   │
                      │ active           │
                      │ startDate?       │
                      │ endDate?         │
                      │ createdAt        │
                      └──────────────────┘
```

## Relaciones

| Relacion | Tipo | Descripcion |
|----------|------|-------------|
| User → Order | 1:N | Un usuario tiene muchos pedidos |
| Category → Product | 1:N | Una categoria tiene muchos productos |
| Order → OrderItem | 1:N | Un pedido tiene muchos items |
| Product → OrderItem | 1:N (opcional) | Un producto puede estar en muchos items (nullable para promos) |

## Notas de Diseño

- **OrderItem.productId** es opcional (`String?`) para soportar items de promocion que no referencian un producto real. En ese caso, `productName` guarda el titulo de la promo como snapshot.
- **Order.status**: `PENDING` → `CONFIRMED` → `DELIVERED` o `CANCELLED`
- **Order.paymentStatus**: `PENDING` → `PAID` o `REJECTED`
- **Product.unlimitedStock**: boolean para productos que no requieren control de stock (ej: bolsas de hielo)
- **Setting**: modelo key-value simple para configuracion global (ej: `trackInventory`)
- **Promotion**: entidad independiente sin relacion directa con Product. Se agrega al carrito con prefijo `promo-{id}`.

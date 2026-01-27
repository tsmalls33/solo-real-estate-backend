# TODO

- [x] Authentication & Authorization with RBAC
- [x] Create guard
- [x] Tenant routes
- [ ] Model responses. Normalize and type the responses throughout the entire app
- [x] Add seed users and tenants
- [ ] Add the repository layer?
- [x] Fix all the type errors from the renaming and types package
- [ ] Write spec tests

## DB Models

### `users`

| Field | Type | Description |
| ------------- | -------- | ------------------------------------------- |
| id_user | UUID PK | |
| email | string | |
| passwordHash | string | |
| fullName | string | |
| role | enum | `client`, `employee`, `admin`, `superadmin` |
| id_tenant | UUID FK | Refers to `tenants.id` |
| createdAt | datetime | |
| updatedAt | datetime | |

### `tenants`

| Field | Type | Description |
| ------------- | -------- | --------------------------- |
| id_tenant | UUID PK | Tenant ID |
| name | string | Agency name |
| users | User[] | Refers to `users.tenant_id` |
| customDomain | string | `agency-1.com` |
| id_plan | UUID FK | Refers to `plans.id` |
| createdAt | datetime | |
| updatedAt | datetime | |

### properties

| Field | Type | Description |
| ------------- | -------------- | - |
| id_property | UUID PK | Property id |
| propertyAddress | string | Property address |
| propertyDescription | text | Description of the property |
| id_owner | UUID FK | `id_user` of the owner, nullable |
| salePrice | number | Price if on sale, nullable |
| saleType | ENUM('rent', 'sale') | type of property and price |
| id_tenant | UUID FK | `id_tenant` of the agency who has this property |

### property_stats

| Field | Type | Description |
| - | - | - |
| id_property | UUID FK | References `id` from `properties` table |
| numberOfBedrooms | number | Total bedrooms in the property |
| numberOfBathrooms | number | Total bathrooms (full + half) |
| sizeSquareMeters | number | Living area in square meters |
| propertyType | enum | Type (APARTMENT, HOUSE, VILLA, etc.) |
| location | string | city/neighborhood |
| yearBuilt | number | Construction year |
| floorNumber | number | Floor level in building |
| hasElevator | boolean | Building has elevator |
| hasGarage | boolean | Parking garage availability |
| createdAt | datetime | Record creation timestamp |
| updatedAt | datetime | Last update timestamp |

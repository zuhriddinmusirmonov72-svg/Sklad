# 🚀 API Quick Reference

## Base URL
```
http://localhost:3000/api/v1
```

## Swagger Documentation
```
http://localhost:3000/api/docs
```

---

## 🔐 Authentication

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "superadmin@ecommerce.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "superadmin@ecommerce.com",
    "fullName": "Super Admin",
    "role": "SUPER_ADMIN"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### Get Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer {accessToken}
```

---

## 📦 Products

### List Products
```http
GET /api/v1/products?page=1&limit=10&search=laptop&categoryId=uuid&minPrice=100&maxPrice=1000
```

### Get Product
```http
GET /api/v1/products/{id}
```

### Create Product
```http
POST /api/v1/products
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "description": "High performance gaming laptop",
  "price": 1299.99,
  "discountPrice": 1199.99,
  "sku": "LAPTOP-001",
  "stockQuantity": 50,
  "minStockLevel": 10,
  "categoryId": "category-uuid",
  "isActive": true,
  "isFeatured": true,
  "tags": "gaming,laptop,electronics",
  "unit": "pcs",
  "weight": 2.5
}
```

### Update Product
```http
PATCH /api/v1/products/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "price": 1099.99,
  "stockQuantity": 45
}
```

### Delete Product
```http
DELETE /api/v1/products/{id}
Authorization: Bearer {accessToken}
```

### Get Low Stock Products
```http
GET /api/v1/products/low-stock
Authorization: Bearer {accessToken}
```

---

## 🏷️ Categories

### List Categories
```http
GET /api/v1/categories
```

### Create Category
```http
POST /api/v1/categories
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "isActive": true,
  "sortOrder": 1
}
```

---

## 👥 Customers

### List Customers
```http
GET /api/v1/customers?page=1&limit=10&search=john&city=Tashkent
Authorization: Bearer {accessToken}
```

### Create Customer
```http
POST /api/v1/customers
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+998901234567",
  "email": "john@example.com",
  "address": "123 Main Street",
  "city": "Tashkent",
  "postalCode": "100000",
  "notes": "VIP customer"
}
```

### Get Customer History
```http
GET /api/v1/customers/{id}/history
Authorization: Bearer {accessToken}
```

---

## 🛒 Orders

### List Orders
```http
GET /api/v1/orders?page=1&limit=10&status=PENDING&customerId=uuid
Authorization: Bearer {accessToken}
```

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "customerId": "customer-uuid",
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2,
      "discount": 10
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ],
  "discount": 50,
  "tax": 15,
  "shippingCost": 20,
  "paymentMethod": "CASH",
  "shippingAddress": "123 Main Street",
  "notes": "Deliver before 5 PM"
}
```

### Update Order Status
```http
PATCH /api/v1/orders/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "trackingNumber": "TRACK123456"
}
```

---

## 📊 Dashboard

### Get Statistics
```http
GET /api/v1/dashboard/stats
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "sales": {
    "today": { "amount": 5234.50, "count": 12 },
    "monthly": { "amount": 45670.80, "count": 156 }
  },
  "products": {
    "total": 250,
    "active": 230,
    "lowStock": 5
  },
  "customers": { "total": 89 },
  "orders": {
    "total": 320,
    "pending": 8,
    "today": 12
  }
}
```

### Get Sales Chart
```http
GET /api/v1/dashboard/sales-chart?days=7
Authorization: Bearer {accessToken}
```

### Get Top Products
```http
GET /api/v1/dashboard/top-products?limit=10
Authorization: Bearer {accessToken}
```

### Get Recent Orders
```http
GET /api/v1/dashboard/recent-orders?limit=10
Authorization: Bearer {accessToken}
```

---

## 🔍 Search

### Global Search
```http
GET /api/v1/search/global?q=laptop
Authorization: Bearer {accessToken}
```

### Search Products
```http
GET /api/v1/search/products?q=laptop&limit=10
Authorization: Bearer {accessToken}
```

### Search Customers
```http
GET /api/v1/search/customers?q=john&limit=10
Authorization: Bearer {accessToken}
```

### Search Orders
```http
GET /api/v1/search/orders?q=ORD-&limit=10
Authorization: Bearer {accessToken}
```

### Autocomplete Products
```http
GET /api/v1/search/autocomplete/products?q=lap&limit=5
Authorization: Bearer {accessToken}
```

### Autocomplete Customers
```http
GET /api/v1/search/autocomplete/customers?q=jo&limit=5
Authorization: Bearer {accessToken}
```

---

## 📤 Upload

### Upload Single File
```http
POST /api/v1/upload/single
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

file: (binary)
```

### Upload Multiple Files
```http
POST /api/v1/upload/multiple
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

files: (binary array)
```

### Delete File
```http
DELETE /api/v1/upload/{filename}
Authorization: Bearer {accessToken}
```

---

## 👤 Admin/Users

### List Admins
```http
GET /api/v1/users?page=1&limit=10
Authorization: Bearer {accessToken}
```

### Create Admin
```http
POST /api/v1/users
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "email": "newadmin@ecommerce.com",
  "password": "SecurePass123!",
  "fullName": "New Admin",
  "role": "ADMIN"
}
```

---

## 📋 Common Patterns

### Pagination
All list endpoints support pagination:
```
?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### Search
Most list endpoints support search:
```
?search=keyword
```

### Authorization Header
All protected endpoints require:
```
Authorization: Bearer {your_jwt_token}
```

---

## 🔑 Test Accounts

| Email | Password | Role |
|-------|----------|------|
| superadmin@ecommerce.com | Admin123! | SUPER_ADMIN |
| admin@ecommerce.com | Admin123! | ADMIN |
| manager@ecommerce.com | Admin123! | MANAGER |

---

## ⚠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-07-06T15:00:00.000Z",
  "path": "/api/v1/products",
  "method": "POST",
  "error": "Bad Request",
  "message": "Validation failed"
}
```

---

## ✅ Success Responses

All list endpoints return paginated results:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🎯 Quick Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@ecommerce.com","password":"Admin123!"}'
```

### Get Products
```bash
curl http://localhost:3000/api/v1/products
```

### Create Product (with auth)
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"New Product","price":99.99,"sku":"PROD-001","stockQuantity":100,"categoryId":"category-uuid"}'
```

---

## 🌐 Best Practices

1. **Always use HTTPS** in production
2. **Store JWT tokens securely** (localStorage or httpOnly cookies)
3. **Include Authorization header** for protected endpoints
4. **Handle token expiration** (refresh tokens)
5. **Validate input** on client side before sending
6. **Handle errors gracefully** with proper user feedback
7. **Use pagination** for large datasets
8. **Implement search** for better user experience

---

For full API documentation with request/response schemas, visit:
**http://localhost:3000/api/docs**

# 🛍️ E-Commerce API Documentation

A complete RESTful API for an e-commerce platform built with **Node.js**, **Express**, and **MongoDB**.

---

## 📘 Table of Contents
- [Authentication Endpoints](#-authentication-endpoints)
- [Category Endpoints](#-category-endpoints)
- [Subcategory Endpoints](#-subcategory-endpoints)
- [Brand Endpoints](#-brand-endpoints)
- [Discount Endpoints](#-discount-endpoints)
- [Product Endpoints](#-product-endpoints)
- [Variant Endpoints](#-variant-endpoints)
- [Review Endpoints](#-review-endpoints)
- [Coupon Endpoints](#-coupon-endpoints)
- [Cart Endpoints](#-cart-endpoints)

---

## 🔐 AUTHENTICATION ENDPOINTS

### **POST** `/auth/registration`
Registers a new user.  
**Body (JSON):**
```json
{
  "phone": "01880840849",
  "password": "Sabbir@12"
}


========================================
🔐 AUTHENTICATION ENDPOINTS
========================================

POST /auth/registration
----------------------------------------
Registers a new user.
Body (JSON):
{
  "phone": "01880840849",
  "password": "Sabbir@12"
}


POST /auth/verify-email
----------------------------------------
Verifies a user's phone/email with OTP.
Body (JSON):
{
    "phone": "1880840849",
    "otp": "9409"
}

POST /auth/resend-Otp
----------------------------------------
Resends the verification OTP.
Body (JSON):
{
    "email": "sabbir00921@gmail.com"
}

POST /auth/forget-Password
----------------------------------------
Sends a password reset email.
Body (JSON):
{
    "email": "satisfactory.moth.kzzm@rapidletter.net"
}

POST /auth/reset-password
----------------------------------------
Resets the user's password.
Body (JSON):
{
    "email": "sabbir00921@gmail.com",
    "newPassword": "Sabbir@1",
    "confirmPassword": "Sabbir@1"
}

POST /auth/login
----------------------------------------
Logs in a user with phone and password.
Body (JSON):
{
    "phone": "01880840849",
    "password": "Sabbir@12"
}

POST /auth/logout
----------------------------------------
Logs out a user.
Body (JSON):
{
    "accessToken": "<JWT_ACCESS_TOKEN>"
}


========================================
📂 CATEGORY ENDPOINTS
========================================

POST /category/create-category
----------------------------------------
Creates a new category.
Body (form-data):
name: GURU VAI
image: /C:/Users/user/Pictures/Camera Roll/mqdefault.jpg

GET /category/getall-category
----------------------------------------
Retrieves all categories.

GET /category/getsingle-category/:slug
----------------------------------------
Retrieves a single category by slug.

PUT /category/update-category/:slug
----------------------------------------
Updates a category by slug.
Body (form-data):
name: Friendss
image: /C:/Users/user/Pictures/Camera Roll/277349588_1448574628912032_4698678323125215353_n.jpg

DELETE /category/delete-category/:slug
----------------------------------------
Deletes a category by slug.

DELETE /category/active-category?active=false
----------------------------------------
Sets category active/inactive based on query parameter.


========================================
📁 SUBCATEGORY ENDPOINTS
========================================

POST /subcategory/create-subcategory
----------------------------------------
Creates a subcategory.
Body (JSON):
{
    "name": "Paper",
    "category": "68b75063c438ed353c51e61d"
}

GET /subcategory/getall-subcategory
----------------------------------------
Retrieves all subcategories.

GET /subcategory/getsingle-subcategory/:slug
----------------------------------------
Retrieves a subcategory by slug.

PUT /subcategory/update-subcategory/:slug
----------------------------------------
Updates subcategory details.

DELETE /subcategory/delete-subcategory/:slug
----------------------------------------
Deletes a subcategory.


========================================
🏷️ BRAND ENDPOINTS
========================================

POST /brand/create-brand
----------------------------------------
Creates a new brand.
Body (form-data):
name: books-nu
image: /C:/Users/user/Pictures/Camera Roll/maxresdefault (1).jpg

GET /brand/get-allbrands
----------------------------------------
Retrieves all brands.

GET /brand/get-singlebrands/:slug
----------------------------------------
Retrieves a single brand.

PUT /brand/update-brand/:slug
----------------------------------------
Updates a brand.

DELETE /brand/delete-brand/:slug
----------------------------------------
Deletes a brand.


========================================
💸 DISCOUNT ENDPOINTS
========================================

POST /discount/create-discount
----------------------------------------
Creates a new discount.
Body (JSON):
{
  "discountName": "Marriage Offer",
  "discountValidFrom": "2025-09-05T00:00:00.000Z",
  "discountValidTo": "2025-09-30T23:59:59.000Z",
  "discountType": "taka",
  "discountValueByAmount": 250,
  "discountPlan": "category",
  "category": "68b75063c438ed353c51e61d"
}

GET /discount/all-discount
GET /discount/single-discount/:slug
PUT /discount/update-discount/:slug
DELETE /discount/delete-discount/:slug


========================================
📦 PRODUCT ENDPOINTS
========================================

POST /product/create-product
----------------------------------------
Creates a new product.
Body (form-data):
Includes all product details such as name, description, category, subCategory, brand, price, images, etc.

GET /product/all-products
GET /product/single-products/:slug
PUT /product/update-products-info/:slug
PUT /product/update-product-image/:slug
GET /product/search-product?query=params
DELETE /product/delete-product/:slug


========================================
🧩 VARIANT ENDPOINTS
========================================

POST /variant/create-variant
----------------------------------------
Creates a new product variant.

GET /variant/all-variants
GET /variant/single-variants/:slug
PUT /variant/update-variant/:slug
DELETE /variant/delete-variant/:slug


========================================
⭐ REVIEW ENDPOINTS
========================================

POST /review/create-review
PUT /review/update-review
DELETE /review/delete-review


========================================
🎟️ COUPON ENDPOINTS
========================================

POST /coupon/create-coupon
GET /coupon/all-coupon
GET /coupon/single-coupon/:slug
PUT /coupon/update-coupon/:slug
DELETE /coupon/delete-coupon/:slug


========================================
🛒 CART ENDPOINTS
========================================

POST /cart/addtocart
PUT /cart/decrease-quantity
PUT /cart/increase-quantity
DELETE /cart/delete-item
"""

# Save to .txt file
path = Path("/mnt/data/API_Documentation.txt")
path.write_text(api_doc.strip(), encoding="utf-8")

path

# Hamdi Store - Admin Setup Guide

## Getting Started with Admin Panel

Your Hamdi Store comes with a complete admin dashboard that lets you manage everything without coding.

### Step 1: Create an Account

1. Go to your store website
2. Click on the user icon in the top right
3. Select "Create Account" (Créer un compte)
4. Enter your email and password
5. Sign up

### Step 2: Make Yourself an Admin

After creating your account, you need to add yourself as an admin in the database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run this SQL command (replace `your-email@example.com` with your actual email):

```sql
INSERT INTO admin_users (id, email)
SELECT id, email
FROM auth.users
WHERE email = 'your-email@example.com';
```

### Step 3: Access the Admin Dashboard

Once you're set as an admin:

1. Log in to your store
2. Navigate to `/admin/dashboard` in your browser
3. You'll see the Admin Dashboard with options for:
   - **Site Settings** - Customize colors, layout, logo
   - **Products** - Add/edit/delete products
   - **Categories** - Manage product categories
   - **Orders** - View and manage customer orders

## Admin Features

### Site Settings (`/admin/settings`)

Customize your store appearance:
- **Store Name**: Change your store name
- **Logo URL**: Add your logo (or leave empty to use store name)
- **Primary & Secondary Colors**: Choose your brand colors
- **Header Style**: Modern, Classic, or Minimal
- **Grid Layout**: Set how many products per row on desktop, tablet, and mobile

### Product Management (`/admin/products`)

Add and manage your shoe inventory:
- Upload product images (URLs)
- Add product name and description
- Set price in TND
- Assign to category
- Manage sizes (36-46) with individual stock counts
- Mark products as featured

### Category Management (`/admin/categories`)

Organize your products:
- Create categories (Running Shoes, Casual, Sports, etc.)
- Edit category names
- Delete unused categories

### Order Management (`/admin`)

View and process customer orders:
- See all order details (customer info, products, sizes)
- Update order status (Pending → Confirmed → Shipped → Delivered)
- Track order totals

## Important Notes

- **Admin Access**: Only users in the `admin_users` table can access admin features
- **Security**: The admin panel is protected by Row Level Security (RLS)
- **Multi-Admin**: You can add multiple admins by adding more emails to the `admin_users` table
- **Mobile Friendly**: The admin panel works on all devices

## Need Help?

If you encounter any issues:
1. Make sure you're logged in
2. Verify you're added to the `admin_users` table
3. Clear your browser cache and reload
4. Check the browser console for errors

## Default Settings

Your store comes pre-configured with:
- Store Name: "Hamdi Store"
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns
- Primary Color: Blue (#2563eb)
- Secondary Color: Dark Blue (#1e40af)

All settings can be changed from the Admin Settings page!

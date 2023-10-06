# Digital Cow Hut Backend Authentication Assignment

### Live Link: https://cow-hut-auth-rho.vercel.app/

### Application Routes:

 ### Auth (User)
   - api/v1/auth/login (POST)
   - api/v1/auth/signup (POST)
   - api/v1/auth/refresh-token (POST)

   ### Auth (Admin)
   - api/v1/admins/create-admin (POST)
   - api/v1/admins/login (POST)

#### User
- api/v1/users (GET)
- api/v1/users/648f0bd988b7c95731065442 (Single GET)
- api/v1/users/648f0bd988b7c95731065442 (PATCH)
- api/v1/users/648f0bd988b7c95731065442 (DELETE)

#### Cows

- api/v1/cows (POST)
- api/v1/cows (GET)
- api/v1/cows/648f0d5188b7c9573106548a (Single GET)
- api/v1/cows/648f0d5188b7c9573106548a (PATCH)
- api/v1/cows/648f0d5188b7c9573106548a (DELETE)

### Pagination and Filtering routes of Cows

- api/v1/cows?page=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Chattogram
- api/v1/cows?query=Cha

#### Orders

- api/v1/orders (POST)
- api/v1/orders (GET)

 ## Bonus Part

#### Admin
   - api/v1/admins/create-admin (POST)

#### My Profile
- api/v1/users/my-profile (GET)
- api/v1/users/my-profile (PATCH)

#### Order:
 - api/v1/orders/6177a5b87d32123f08d2f5d4 (GET)
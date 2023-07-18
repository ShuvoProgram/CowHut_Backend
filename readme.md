# Digital Cow Hut Backend Assignment

### Live Link: https://cow-hut-ru16.onrender.com/

### Application Routes:

#### User

- api/v1/auth/signup (POST)
- api/v1/users (GET)
- api/v1/users/648f0bd988b7c95731065442 (Single GET)
- api/v1/users/648f0bd988b7c95731065442 (PATCH)
- api/v1/users/648f0bd988b7c95731065442 (DELETE)

#### Cows

- api/v1/cows/create-cow (POST)
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

- api/v1/orders/create-order (POST)
- api/v1/orders (GET)

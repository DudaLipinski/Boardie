# Boardie Server

To access the api documentation, go to
localhost:3007/api-docs

# Typing structure

- All the types related to the database should be defined inside the `/models` files.
- The `/schemas` files should define all the DTO types trying to base them as much as possible on the `/models` types
- The `/controllers` files should avoid defining any types, and should avoid importing types when possible. The `/schemas` validation methods can define the types of your request's payloads through Type Inference

# Database structure

The source of truth should be the `/database/database.dbml` file. You can import it into (dbdiagram)[https://dbdiagram.io/d] to visualize it

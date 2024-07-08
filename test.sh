#!/bin/bash

# Replace http://localhost:3000 with your actual deployed application URL and <TOKEN> with your JWT token

# Register User
curl -X POST -H "Content-Type: application/json" -d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password",
  "phone": "1234567890"
}' http://localhost:3000/auth/register

# Login User
TOKEN=$(curl -X POST -H "Content-Type: application/json" -d '{
  "email": "john.doe@example.com",
  "password": "password"
}' http://localhost:3000/auth/login | jq -r '.data.accessToken')

echo "JWT Token: $TOKEN"

# Test Organisation Endpoints
# Create Organisation
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{
  "name": "John's New Organisation",
  "description": "New Organisation for testing"
}' http://localhost:3000/api/organisations

# Fetch All Organisations
curl -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/organisations

# Fetch Organisation by ID (replace <orgId> with an actual organisation ID)
curl -X GET -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/organisations/<orgId>

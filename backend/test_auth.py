from app.auth.security import hash_password, verify_password

password = "TestPassword123"

hashed = hash_password(password)

print("HASH CREATED:", hashed)
print("PASSWORD VALID:", verify_password(password, hashed))
print("WRONG PASSWORD:", verify_password("WrongPassword", hashed))
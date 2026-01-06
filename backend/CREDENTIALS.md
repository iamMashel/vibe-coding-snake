# Mock User Credentials

All mock users use the password: **`password123`**

## Available Mock Users

| Username | Email | Password |
|----------|-------|----------|
| SnakeMaster | snake@master.com | password123 |
| RetroGamer | retro@gamer.com | password123 |
| NeonViper | neon@viper.com | password123 |

## Password Security

- Passwords are hashed using **bcrypt** with salt
- Password hashes are stored in `UserInDB` model (internal only)
- Public `User` model never exposes password hashes
- Minimum password length: 6 characters (enforced by frontend validation)

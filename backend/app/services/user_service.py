class UserService:

    @staticmethod
    def register(db, data):

        print(data)

        existing = UserRepository.get_by_email(db, data.email)

        print(existing)

        if existing:
            return None

        user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            phone=data.phone
        )

        print(user)

        return UserRepository.create(db, user)
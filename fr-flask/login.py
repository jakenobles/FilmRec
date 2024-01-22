import bcrypt
from db import DB
from Flask import jsonify

class Login:
    #Hashes password to compare to the stored password
    @staticmethod
    def hash_password(password):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        return hashed_password

    #Logs in the user, contacts database to find if user logs in correctly
    @staticmethod
    def validate_user(username, password):
        if not username or not password:
            return jsonify({"error": "Missing username or password"}), 400

        # Fetch the user by username only
        query_fetch = "SELECT password FROM user_data WHERE username = %s"
        user_data = DB.execute_db_query(query_fetch, (username,))

        if user_data:
            # Compare the hashed passwords
            stored_hash = user_data[0][0].tobytes()
            # Assuming stored_hash is retrieved as binary data from the database
            if isinstance(stored_hash, bytes):
                # Directly use it with bcrypt
                is_password_correct = bcrypt.checkpw(password.encode('utf-8'), stored_hash)
                print(is_password_correct)
            else:
                # If it's a string, ensure it's correctly formatted
                is_password_correct = bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))

            #Checks if the password is correct or incorrect and returns codes accordingly    
            if is_password_correct == True:   
                return True
            else:
                return False
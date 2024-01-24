from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required,  create_access_token, set_access_cookies, unset_jwt_cookies, get_jwt_identity
from flask_cors import CORS
from db import DB
from login import Login
from chat import Chat
import json
import os

#Starting the Flask app
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key
app.config['JWT_COOKIE_SAMESITE'] = 'None'  # Set to 'Lax' or 'Strict' as per your requirement
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
jwt = JWTManager(app)

CORS(app, supports_credentials=True)
        
#Registers the user if doesnt exist.    
@app.route('/api/register', methods=['POST'])
def register_user():
   data = request.json
   username = data.get('username')
   password = data.get('password')

   if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
   
   #Check if user already exists
   query_check = "SELECT * FROM user_data WHERE username = %s"
   existing_user = DB.execute_db_query(query_check, (username,))
   if len(existing_user) > 0:
        return jsonify({"error": "Username already taken"}), 409
   
   #Insert new user
   query_insert = "INSERT INTO user_data (username, password) VALUES (%s, %s)"
   try:
        DB.execute_db_insert(query_insert, (username, Login.hash_password(password)))
        return jsonify({"message": "Registration successful"}), 200
   except Exception as e:
        #Handle specific exceptions as needed
        return jsonify({"error": "An error occurred during registration"}), 500

#Logout User
@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/api/login', methods=['POST'])
def login():
    # Assuming you receive username and password in request
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # Validate user credentials (you'll need to implement this)
    user = Login.validate_user(username, password)
    if user:
        access_token = create_access_token(identity=username)
        response = jsonify(logged_in_as=username)
        set_access_cookies(response, access_token)
        return response

    return jsonify({"msg": "Bad username or password"}), 401


#Checks if session is valid   
@app.route('/check-session', methods=['GET'])
@jwt_required(optional=True)
def check_session():
    current_user = get_jwt_identity()
    if current_user:
        user_dict = {'username' : current_user}
        return jsonify(user_dict), 200
    else:
        return jsonify(logged_in=False), 401
    
#Gets the user's genre profile and stores it
@app.route('/api/store/profile', methods=['POST'])
def store_genre():
    data = request.json

    genre_dict = {
        'action' : 0,
        'adventure' : 0,
        'animation' : 0,
        'biography' : 0,
        'comedy' : 0,
        'crime' : 0,
        'documentary' : 0,
        'drama' : 0,
        'fantasy' : 0,
        'film_noir' : 0,
        'history' : 0,
        'horror' : 0,
        'music' : 0,
        'musical' : 0,
        'mystery' : 0,
        'romance' : 0,
        'sci_fi' : 0,
        'sport' : 0,
        'thriller' : 0,
        'war' : 0,
        'western' : 0,
        'foreign' : 0
    }


    #Changing all values present to 1 (TRUE)
    for word in data['genres']:
        if word in genre_dict:
            # Update the value to 1
            genre_dict[word] = 1

    #Convert genre_dict values to boolean
    genre_values = [value == 1 for value in genre_dict.values()]
    

    #Database queries
    delete_query = "DELETE FROM preferences WHERE username = %s;"
    insert_query = "INSERT INTO preferences (username, action, adventure, animation, biography, comedy, crime, documentary, drama, fantasy, film_noir, history, horror, music, musical, mystery, romance, sci_fi, sport, thriller, war, western, ok_with_foreign) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"

    try:
    #Deletes old profile
        DB.execute_db_insert(delete_query, (data['username'], ))

        #Inserts new profile
        DB.execute_db_insert(insert_query, (str(data['username']), *genre_values))

        return jsonify({'message': 'Profile stored successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/store/watched', methods=['POST'])
def add_watched():
    data = request.json

    insert_query = "INSERT INTO watched_movies (username, movie_id, movie_title, favorite) VALUES (%s, %s, %s, %s);"

    if data['favorite'] == 1:
        is_favorite = True
    else:
        is_favorite = False

    try:
        #Inserts new profile
        DB.execute_db_insert(insert_query, (data['username'], str(data['movie']['id']), data['movie']['original_title'], is_favorite))

        return jsonify({'message': 'Profile stored successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/recommendation', methods=['POST'])
def get_recommendation():
    data = request.json

    genre_query = 'SELECT * FROM preferences WHERE username = %s'

    watched_list_query = 'SELECT * FROM watched_movies WHERE username = %s'

    try:
        user_genres = DB.execute_db_query(genre_query, (data['username'], ))
        watched_list = DB.execute_db_query(watched_list_query, (data['username'], ))
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    print("test! " + str(user_genres))
    
    prompt_genres = Chat.process_genres(user_genres)[0]

    ok_with_foreign = Chat.process_genres(user_genres)[1]
    
    watched_movies = Chat.process_watched(watched_list)

    prompt = f"User Genre Likes: {prompt_genres}. {ok_with_foreign} Watched and Liked Movies: {watched_movies}"

    recommendation = Chat.chat_gpt(prompt)

    response = Chat.process_recommendation(recommendation)

    print(response)

    return response, 200

if __name__ == '__main__':
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True)



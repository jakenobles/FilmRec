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
        
#Registers the user if doesnt exist and administers a login token.    
@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    try:
        query_check = "SELECT * FROM user_data WHERE username = %s"
        existing_user = DB.execute_db_query(query_check, (username,))

        if existing_user:
            return jsonify({"error": "Username already taken"}), 409

        query_insert = "INSERT INTO user_data (username, password) VALUES (%s, %s)"
        DB.execute_db_insert(query_insert, (username, Login.hash_password(password)))

        access_token = create_access_token(identity=username)
        response = jsonify({"message": "Registration successful", "logged_in_as": username})
        set_access_cookies(response, access_token)
        return response, 200
    except Exception as e:
        app.logger.error(f'Error during user registration: {e}')
        return jsonify({"error": "An error occurred during registration"}), 500


#Logout User
@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response

#logs in user based on post from app
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    try:
        user = Login.validate_user(username, password)
        if user:
            access_token = create_access_token(identity=username)
            response = jsonify(logged_in_as=username)
            set_access_cookies(response, access_token)
            return response
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        app.logger.error(f'Error during login: {e}')
        return jsonify({"error": "An error occurred during login"}), 500



#Checks if session is valid   
@app.route('/check-session', methods=['GET'])
@jwt_required(optional=True)
def check_session():
    try:
        current_user = get_jwt_identity()
        if current_user:
            return jsonify({'username': current_user}), 200
        else:
            return jsonify({"error": "No active session"}), 401
    except Exception as e:
        app.logger.error(f'Error during session check: {e}')
        return jsonify({"error": "An error occurred checking the session"}), 500

    
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
        DB.execute_db_insert(delete_query, (data['username'], ))
        DB.execute_db_insert(insert_query, (data['username'], *genre_values))
        return jsonify({'message': 'Profile stored successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error storing user profile: {e}')
        return jsonify({'error': 'An error occurred storing the profile'}), 500

#Stores user's watched list    
@app.route('/api/store/watched', methods=['POST'])
def add_watched():
    data = request.json

    # Input validation
    if 'username' not in data or 'movie' not in data or 'favorite' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    username = data['username']
    movie = data['movie']
    is_favorite = bool(data['favorite'])

    upsert_query = """
        INSERT INTO watched_movies (username, movie_id, movie_title, favorite) 
        VALUES (%s, %s, %s, %s) 
        ON CONFLICT (username, movie_id) DO UPDATE 
        SET movie_title = EXCLUDED.movie_title, favorite = EXCLUDED.favorite;
    """

    try:
        #inserts and updates movie
        DB.execute_db_insert(upsert_query, (username, str(movie['id']), movie['original_title'], is_favorite))
        return jsonify({'message': 'Movie stored successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error storing watched movie: {e}')
        return jsonify({'error': 'Failed to store the movie'}), 500

    
#Adds single watched movie
@app.route('/api/store/singlewatched', methods=['POST'])
def add_single_watched():
    data = request.json

    # Input validation
    if 'movie' not in data or 'favorite' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    movie = data['movie']
    is_favorite = bool(data['favorite'])

    insert_query = "INSERT INTO watched_movies (username, movie_id, movie_title, favorite) VALUES (%s, %s, %s, %s);"

    try:
        DB.execute_db_insert(insert_query, (movie['username'], str(movie['id']), movie['original_title'], is_favorite))
        return jsonify({'message': 'Movie added successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error adding single watched movie: {e}')
        return jsonify({'error': 'Failed to add the movie'}), 500

    
@app.route('/api/recommendation', methods=['POST'])
def get_recommendation():
    data = request.json

    if 'username' not in data:
        return jsonify({'error': 'Missing username'}), 400

    try:
        user_genres = DB.execute_db_query('SELECT * FROM preferences WHERE username = %s', (data['username'], ))
        watched_list = DB.execute_db_query('SELECT * FROM watched_movies WHERE username = %s', (data['username'], ))
        do_not_recommend_list = DB.execute_db_query('SELECT * FROM do_not_recommend WHERE username = %s', (data['username'], ))

        prompt_genres, ok_with_foreign = Chat.process_genres(user_genres)
        watched_movies = Chat.process_watched(watched_list)
        dnr = Chat.process_DNR(do_not_recommend_list)

        prompt = f"User Genre Likes: {prompt_genres}. {ok_with_foreign} Watched and Liked Movies: {watched_movies}. Do not recommend: {dnr}"
        recommendation = Chat.chat_gpt(prompt)
        response = Chat.process_recommendation(recommendation, data['username'])

        return response, 200
    except Exception as e:
        app.logger.error(f'Error generating recommendation: {e}')
        return jsonify({'error': 'Failed to generate recommendation'}), 500


#Returns user's preference profile.
@app.route('/api/fetch/profile', methods=['GET'])
@jwt_required(optional=True)
def get_user_profile():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        response = DB.execute_db_query('SELECT * FROM preferences WHERE username = %s', (current_user, ))
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(f'Error fetching user profile: {e}')
        return jsonify({'error': 'Failed to fetch user profile'}), 500

#Returns user's watch list    
@app.route('/api/fetch/watched', methods=['GET'])
@jwt_required(optional=True)
def get_user_watched():
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        watched_movies = DB.execute_db_query('SELECT * FROM watched_movies WHERE username = %s', (current_user, ))
        movie_data_list = [Chat.get_movie_details(movie[2]) for movie in watched_movies]  # Assume Chat.get_movie_details() handles its own errors
        return jsonify(movie_data_list), 200
    except Exception as e:
        app.logger.error(f'Error fetching watched movies: {e}')
        return jsonify({'error': 'Failed to fetch watched movies'}), 500
    
#Do not recommend list
@app.route('/api/store/dnr', methods=['POST'])
def store_dnr():
    data = request.json

    if not data or 'movie' not in data:
        return jsonify({'error': 'Missing required data'}), 400

    movie = data['movie']
    try:
        DB.execute_db_insert('INSERT INTO do_not_recommend (username, original_title) VALUES (%s, %s);', (movie['username'], movie['title']))
        return jsonify({'message': 'Updated Do Not Recommend list successfully'}), 200
    except Exception as e:
        app.logger.error(f'Error updating Do Not Recommend list: {e}')
        return jsonify({'error': 'Failed to update Do Not Recommend list'}), 500




if __name__ == '__main__':
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True)



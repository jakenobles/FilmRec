from openai import OpenAI
from db import DB

class Chat:
  #Interfaces with ChatGPT, takes the query as an argument
  @staticmethod
  def chat_gpt(prompt):
    client = OpenAI()

    response = client.chat.completions.create(
      model="gpt-4-1106-preview",
      response_format={ "type": "json_object" },
      messages=[
        {"role": "system", "content": "Given a preference profile of liked genres, whether or not the user likes foreign films, and a time period of movies the user likes as well as a list of watched and liked movies, I want you to recommend my users ONE movie. Return the name of the movie (if it has a foreign name, please translate it to English), the year it came out, the movie's TMDB id, and a short description of why the user would like it based on their past liked movies in JSON format (Key value names: title, year, id, reason). It is of the utmost importance that you not recommend a movie that is already in the watched list."},
        {"role": "user", "content": f"{prompt}"}
      ]
    )
    return (response.choices[0].message.content)

# #contacts DB to get the user profile based on user_id
# def get_profile(user_id):
#   query = f"""SELECT * FROM preferences WHERE username = %s"""

#   return DB.execute_db_query(query, (user_id,))

# # Gets the user's watched movies
# def get_watched_movies(user_id):
#   query = f"""SELECT movie_title FROM watched_movies WHERE username = %s"""

#   return DB.execute_db_query(query, (user_id,))

# # Takes the user's preferences profile and finds genres, foreign, and time period preferences
# def process_preferences(user_id):
#   #Get profile
#   raw_profile = get_profile(user_id)

#   #Creates a dictionary with Genres and selected user preferences, then appends the liked genres string with all of the user's preferred genres.
#   genres = [
#     "action", "adventure", "animation", "biography", "comedy", "crime",
#     "documentary", "drama", "fantasy", "film_noir", "history", "horror",
#     "music", "musical", "mystery", "romance", "sci_fi", "sport",
#     "thriller", "war", "western"
#   ]

#   user_genre_prefs = list(raw_profile[0][1:-2])

#   genre_prefs_dict = {genres[i]: user_genre_prefs[i] for i in range(len(genres))}
  
#   liked_genres = [genre for genre, liked in genre_prefs_dict.items() if liked]

#   prompt_genres = ""
  
#   for genre in liked_genres:
#     prompt_genres += f"{genre}, "

#   #Finds if the user answered true or false whether or not the user like foreign films.
#   ok_with_foreign = ""
  
#   if raw_profile[0][-2] == True:
#     ok_with_foreign = "User is ok with foreign films."
#   ok_with_foreign = "User does not like foreign films."

#   #Get time period
#   time_period = get_time_period(raw_profile[0][-1])

#   return [prompt_genres, ok_with_foreign, time_period]

# #Turns the user's watched movies into a string format easily usable in the prompt.
# def process_watched_movies(user_id):
#   #Get watched movies
#   watched_movies_raw = get_watched_movies(user_id)

#   #Appends all watched movies together in a string.
#   watched_movies = ""
#   for movie in watched_movies_raw:
#     watched_movies += f"{movie[3]}, "

#   #Returns the string  
#   return watched_movies

# #Generates the prompt needed to send to GPT and retrieves the response
# def get_recommendations(liked_genres, ok_with_foreign, time_period, watched_movies):
#   prompt = f"User Genre Likes: {liked_genres}. {ok_with_foreign} User likes movies from: {time_period[0][0]} - Current Time. Watched and Liked Movies: {watched_movies}"

#   recommendations = chat_gpt(prompt)

#   return recommendations

# #Sets the whole program in motion
# def main(user_id):
#   return get_recommendations(process_preferences(user_id)[0], process_preferences(user_id)[1], process_preferences(user_id)[2], process_watched_movies(user_id))


# print(main("3"))

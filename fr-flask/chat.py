from openai import OpenAI
from db import DB
import requests
import json

class Chat:
  #Interfaces with ChatGPT, takes the query as an argument
  @staticmethod
  def chat_gpt(prompt):
    client = OpenAI()

    response = client.chat.completions.create(
      model="gpt-4-1106-preview",
      response_format={ "type": "json_object" },
      messages=[
        {"role": "system", "content": "Given a preference profile of liked genres, whether or not the user likes foreign films, and a time period of movies the user likes as well as a list of watched and liked movies, I want you to recommend my users ONE movie. Return the name of the movie (if it has a foreign name, please translate it to English), the year it came out, the movie's TMDB id, and a short description of why the user would like it based on their past liked movies in JSON format (Key value names: title, year, id, reason). Be colloquial with your reasoning, for example if the user likes foreign movies, or other genres, dont just plain say it, that is implied. Take that into account, just dont say it outright. It is of the utmost importance that you not recommend a movie that is already in the watched list."},
        {"role": "user", "content": f"{prompt}"}
      ]
    )
    return (response.choices[0].message.content)
  
  #Finds poster and description for movie.
  @staticmethod
  def get_movie_details(id):
    url = f"https://api.themoviedb.org/3/movie/{id}?language=en-US"

    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZWU5YTVkYWNjODI2ZDMxMzA2ZTRiMmE5MDNkMTgzMyIsInN1YiI6IjY0MTIxM2FjZmU2YzE4MDA3YzM4ZTBjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ItL7YRS1B7FQn7L2v_6z8m2T4j08YQ2GxT2LB_ACSSU"
    }

    response = requests.get(url, headers=headers)

    return response.json()
  
  @staticmethod
  def process_genres(user_genres):
    #Processing the genres
    #Creates a dictionary with Genres and selected user preferences, then appends the liked genres string with all of the user's preferred genres.
    genres = [
    "action", "adventure", "animation", "biography", "comedy", "crime",
    "documentary", "drama", "fantasy", "film_noir", "history", "horror",
    "music", "musical", "mystery", "romance", "sci_fi", "sport",
    "thriller", "war", "western"
    ]

    user_genre_prefs = list(user_genres[0][1:-1])

    print("LOOK HERE!!!!!!!!!!" + str(len(user_genre_prefs)))

    print(str(len(genres)))

    genre_prefs_dict = {genres[i]: user_genre_prefs[i] for i in range(len(genres))}
    
    liked_genres = [genre for genre, liked in genre_prefs_dict.items() if liked]

    prompt_genres = ""
    
    for genre in liked_genres:
        prompt_genres += f"{genre}, "

    if user_genres[0][-1] == True:
        ok_with_foreign = "User is ok with foreign films."
    else:
        ok_with_foreign = "User does not like foreign films."

    return [prompt_genres, ok_with_foreign]
  
  @staticmethod
  def process_watched(watched_list):
     #Process the watched_list
    #Appends all watched movies together in a string.
    watched_movies = ""
    for movie in watched_list:
        watched_movies += f"{movie[3]}, "

    return watched_movies
  
  @staticmethod
  def process_recommendation(recommendation):
    rec_dict = json.loads(recommendation)

    print(rec_dict['id'])

    movie_data = Chat.get_movie_details(rec_dict['id'])

    return_json = {**rec_dict, **movie_data}

    return_json_string = json.dumps(return_json)
    
    return return_json_string
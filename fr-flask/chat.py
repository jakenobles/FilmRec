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
        {"role": "system", "content": """Using the detailed preference profile provided for each user, which includes specific genres they like (e.g., drama, sci-fi, comedy), their openness to foreign films (yes/no), their preferred era of movies (e.g., 80s, 2000s), and a comprehensive list of movies they have already watched and enjoyed, your task is to recommend precisely ONE movie. The output should be formatted in JSON with the following structure and key names:

            'title': This is the name of the movie. If the movie is not originally in English, provide its title translated into English.
            'year': Indicate the year of release of the movie.
            'id': This refers to the movie's The Movie Database (TMDB) identification number. It is crucial that this ID is exact and corresponds to the recommended movie.
            'reason': Provide a succinct yet engaging explanation tailored to the user's preferences, explaining why this particular movie is a suitable recommendation. This should read naturally and conversationally.
            'og_title': If the movie's title is not in english, include that untranslated version here, otherwise value it "null".

        IMPORTANT INSTRUCTIONS:

            Consistency Check: Ensure that the movie title referred to in the 'reason' section is exactly the same as the movie title listed under the 'title' key. They must match word-for-word.
            TMDB ID Verification: The TMDB id provided must be cross-checked to confirm it corresponds directly to the recommended movie. This is to ensure that there are no errors in movie identification. Ensuring you have the correct movie ID is the most important part of the process.
            Avoiding Repetition: Cross-reference the user's watched list to guarantee that the recommended movie is not one the user has already seen.
            Do Not Recommend: Ensure that you do not include any movies that are within the user's Do Not Recommend list.
            Implicit Reasoning: In the 'reason' section, avoid explicitly stating the user's preferences. Instead, weave these preferences into the recommendation in a way that feels natural and unforced. For instance, if recommending a foreign film, do not simply state 'because you like foreign films', but rather highlight specific elements of the film that align with the user's tastes.

        This detailed approach is designed to optimize the relevance and accuracy of the movie recommendation, ensuring that it is both personalized and precise. Carefully follow these guidelines to deliver a recommendation that is perfectly tailored to the user's unique profile."""},

        {"role": "user", "content": f"{prompt}"}
      ],
      temperature=0
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
  def process_recommendation(recommendation, username):
    rec_dict = json.loads(recommendation)

    rec_dict['username'] = username

    query = 'SELECT id FROM tmdb WHERE original_title = %s ORDER BY popularity DESC LIMIT 1'

    if rec_dict['og_title'] != "null" and rec_dict['og_title'] is not None and rec_dict['og_title'] != "None":
        param = rec_dict['og_title']
    else:
        param = rec_dict['title']

    movie_id = DB.execute_db_query(query, (param, ))

    if movie_id != []:
      extract_movie_id = movie_id[0][0]
      movie_data = Chat.get_movie_details(extract_movie_id)
    else:
      movie_data = Chat.get_movie_details(rec_dict['id'])

    return_json = {**rec_dict, **movie_data}

    return_json_string = json.dumps(return_json)
    
    return return_json_string
  
  @staticmethod
  def process_DNR(do_not_recommend_list):
    print(do_not_recommend_list)
    dnr_list_string = ""
    
    for movie in do_not_recommend_list:
      dnr_list_string += f"{movie[1] }"
      
    return dnr_list_string
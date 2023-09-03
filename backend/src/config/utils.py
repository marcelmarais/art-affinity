import pandas as pd
import os
from config.constants import IMAGES_SAVE_PATH, IMAGES_UPLOAD_PATH

def get_image_path(id: str) -> str:
    image_file_name = f'{id}.jpg'
    image_file_path = os.path.join(IMAGES_SAVE_PATH, image_file_name)

    return image_file_path

def setup_dirs():
    if not os.path.exists(IMAGES_UPLOAD_PATH):
        os.makedirs(IMAGES_UPLOAD_PATH)

def csv_to_dict_list(csv_filename):
    """
    Function to convert a CSV file into a list of dictionaries and a list of image URLs using pandas.

    :param filename: str. The name of the CSV file.
    :return: tuple. A tuple containing a list of dictionaries and a list of image paths.
    """
    # read the CSV file
    df = pd.read_csv(csv_filename)
    
    # drop rows with any null value
    df = df.dropna()
    
    # filter rows where ingested is False
    df = df[df['ingested'] == False]
    
    # filter rows where image exists
    df = df[df['ID'].apply(lambda x: os.path.exists(get_image_path(x)))]
    
    artwork_ids = df['ID']
    
    # convert the remaining dataframe to a list of dictionaries
    data = df.to_dict('records')
    image_paths = [get_image_path(artwork_id) for artwork_id in artwork_ids]
    
    return data, image_paths


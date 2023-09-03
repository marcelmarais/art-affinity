import os
import pandas as pd
import requests
from pathlib import Path
from tqdm import tqdm

def download_images(csv_file, output_dir):
    # Create the output directory if it does not exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Read the CSV file
    df = pd.read_csv(csv_file)
    cnt = 0
    for _, row in tqdm(df.iterrows(), total=len(df), desc="Downloading Images"):
        image_url = row['Image URL']
        id = row['ID']
        if pd.notna(image_url):
            # Create the image file path
            image_file_name = id + '.jpg'
            image_file_path = os.path.join(output_dir, image_file_name)
            
            # Check if the image already exists
            if os.path.isfile(image_file_path):
                cnt += 1
                continue
            
            try:
                # Get the image
                response = requests.get(image_url, stream=True)
                response.raise_for_status()

                # Save the image
                with open(image_file_path, 'wb') as file:
                    for chunk in response.iter_content(chunk_size=8192):
                        file.write(chunk)
                                
            except requests.exceptions.RequestException as e:
                print(f'Error downloading {image_url}: {e}')
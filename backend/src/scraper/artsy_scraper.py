from selenium import webdriver
import time
from selenium.webdriver.common.by import By
import pandas as pd
import hashlib
from datetime import datetime

class ArtsyScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.driver = webdriver.Chrome()
    
    def scroll_to_bottom(self):
        SCROLL_PAUSE_TIME = 2
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        
        while True:
            for i in range(1, 10):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight * " + str(i/10) + ");")
                time.sleep(SCROLL_PAUSE_TIME)
                
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
    
    def get_art_details(self, page):
        url = self.base_url + str(page)
        self.driver.get(url)
        time.sleep(3)
        
        self.scroll_to_bottom()
        
        artworks = self.driver.find_elements(By.CSS_SELECTOR, 'div[data-test="artworkGridItem"]')
        art_details = []
        
        for artwork in artworks:
                scrape_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                try:
                    name = artwork.find_element(By.CSS_SELECTOR, 'div[color="black60"]:nth-child(1)').text
                    price = artwork.find_element(By.CSS_SELECTOR, 'div[color="black100"]').text
                    artist = artwork.find_element(By.CSS_SELECTOR, 'span[to^="/artist/"]').text
                    gallery_name = artwork.find_element(By.CSS_SELECTOR, 'span[to^="/partner/"]').text
                    href = artwork.find_element(By.CSS_SELECTOR, 'a[data-testid="metadata-artwork-link"]').get_attribute('href')
                except Exception as e:
                    print(e)
                    continue
                
                try:
                    image_url = artwork.find_element(By.CSS_SELECTOR, 'img').get_attribute('src')
                except Exception as e:
                    print('Image not found')
                    image_url = None
                
                # Compute hash of the scraped details
                hash_id = hashlib.md5((name + price + artist + gallery_name + href).encode()).hexdigest()

                art_details.append({
                    'ID': hash_id,
                    'Name': name,
                    'Price': price,
                    'Artist': artist,
                    'Image URL': image_url,
                    'Gallery Name': gallery_name,
                    'Href': href,
                    'Scrape Date': scrape_date,
                    'Ingested':False
                })

        return art_details

    

    def quit(self):
        self.driver.quit()

        
    def save_to_csv(self, art_details):
        # Convert the list of dictionaries to a pandas DataFrame
        df = pd.DataFrame(art_details)
        
        # Check if the CSV file already exists
        try:
            existing_df = pd.read_csv('data/art_details.csv')
            df = pd.concat([existing_df, df])
        except FileNotFoundError:
            pass
        
        # Drop rows that have the same ID
        df = df.drop_duplicates(subset='ID', keep='last')
        
        # Save the DataFrame to a CSV file
        df.to_csv('data/art_details.csv', index=False)



# gallery_slug = '99-loop-gallery'
# gallery_slug = 'everard-read'
# gallery_slug = 'goodman-gallery'
# gallery_slug = 'worldart'
gallery_slug = 'smac'
artsy_url = 'https://www.artsy.net/partner'
base_url = f'{artsy_url}/{gallery_slug}/works?page='
scraper = ArtsyScraper(base_url)

for page in range(1, 200):
    try:
        art_details = scraper.get_art_details(page)
        if not art_details:
            print('All pages scraped!')
            break
        else:
            scraper.save_to_csv(art_details)
    except Exception as e:
        print(e)
        break

scraper.quit()

from scraper.image_downloader import download_images
from database.chroma_embedding_function import CLIPEmbeddingFunction
import chromadb
from config.constants import SCRAPED_CSV_SAVE_PATH, IMAGES_SAVE_PATH, CHROMA_DB_IP
from config.utils import csv_to_dict_list, convert_images_to_base64
class Ingest:
  def __init__(self):
      self.client = chromadb.HttpClient(host=CHROMA_DB_IP, port=8000)
      self.collection = self.client.get_or_create_collection(name="all_art", embedding_function=CLIPEmbeddingFunction(), metadata={"hnsw:space": "cosine"})

  def start_image_download(self):
      download_images(SCRAPED_CSV_SAVE_PATH, IMAGES_SAVE_PATH)

  def ingest_csv(self, csv_filename: str = SCRAPED_CSV_SAVE_PATH, batch_size: int = 256):
      data, image_paths, artwork_ids = csv_to_dict_list(csv_filename)
      base_64_images = convert_images_to_base64(image_paths)
      total_data = len(data)
      for i in range(0, total_data, batch_size):
          end_index = min(i + batch_size, total_data)
          self.collection.upsert(
              documents=base_64_images[i:end_index],
              metadatas=data[i:end_index],
              ids=artwork_ids[i:end_index]
          )

  def __str__(self) -> str:
      return f'ChromaDB client collection has: {self.collection.count()} items\nPreview: {self.collection.peek()["metadatas"]}'


if __name__ == '__main__':
    ingest = Ingest()
    # ingest.start_image_download()
    ingest.ingest_csv()
    print(ingest)
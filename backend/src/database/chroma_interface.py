from config.constants import DB_SAVE_PATH, SCRAPED_CSV_SAVE_PATH
from config.utils import csv_to_dict_list
from database.chroma_embedding_function import CLIPEmbeddingFunction
import chromadb
    
class ChromaInstance:
  def __init__(self) -> None:
      self.client = chromadb.HttpClient(host='34.105.246.233', port=8000)
      self.collection = self.client.get_or_create_collection(name="all_art", embedding_function=CLIPEmbeddingFunction(), metadata={"hnsw:space": "cosine"})

  def ingest_csv(self, csv_filename: str = SCRAPED_CSV_SAVE_PATH ):
      data, image_paths = csv_to_dict_list(csv_filename)
      self.collection.add(
          documents=image_paths,
          metadatas=data,
          ids = [f'id_{i}' for i in range(0, len(data))]
      )
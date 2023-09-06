from config.constants import SCRAPED_CSV_SAVE_PATH, CHROMA_DB_IP
from config.utils import csv_to_dict_list
from database.chroma_embedding_function import CLIPEmbeddingFunction
import chromadb
    
class ChromaInstance:
  def __init__(self) -> None:
      self.client = chromadb.HttpClient(host=CHROMA_DB_IP, port=8000)
      self.embedding_function = CLIPEmbeddingFunction()
      self.collection = self.client.get_or_create_collection(name="all_art", embedding_function=self.embedding_function, metadata={"hnsw:space": "cosine"})
from config.constants import DB_SAVE_PATH, SCRAPED_CSV_SAVE_PATH
from config.utils import csv_to_dict_list
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from model.open_clip import OpenClipModel
import torch

    
class ChromaInstance:
  def __init__(self) -> None:
      self.client = chromadb.PersistentClient(path=DB_SAVE_PATH)
      self.collection = self.client.get_or_create_collection(name="all_art", embedding_function=CLIPEmbeddingFunction())

  def ingest_csv(self, csv_filename: str = SCRAPED_CSV_SAVE_PATH ):
      data, image_paths = csv_to_dict_list(csv_filename)
      self.collection.add(
          documents=image_paths,
          metadatas=data,
          ids = [f'id_{i}' for i in range(0, len(data))]
      )

class CLIPEmbeddingFunction(EmbeddingFunction):
    def __init__(self) -> None:
        embedding_model = OpenClipModel()
        self.embedding_function = embedding_model.embed_images

    def __call__(self, texts: Documents) -> Embeddings:
        return self.embedding_function(texts)
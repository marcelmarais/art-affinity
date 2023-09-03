
from chromadb import Documents, EmbeddingFunction, Embeddings
from model.open_clip import OpenClipModel

class CLIPEmbeddingFunction(EmbeddingFunction):
    def __init__(self) -> None:
        embedding_model = OpenClipModel()
        self.embedding_function = embedding_model.embed_images

    def __call__(self, texts: Documents) -> Embeddings:
        return self.embedding_function(texts)
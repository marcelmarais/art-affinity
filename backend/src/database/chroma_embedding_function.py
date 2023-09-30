
from chromadb import Documents, EmbeddingFunction, Embeddings
from model.open_clip import OpenClipModel


class CLIPEmbeddingFunction(EmbeddingFunction):
    def __init__(self) -> None:
        self.embedding_model = OpenClipModel()
        self.embedding_function_images = self.embedding_model.embed_images

    def embed_text(self, text: str) -> Embeddings:
        return self.embedding_model.embed_text(text)

    def __call__(self, texts: Documents) -> Embeddings:
        return self.embedding_function_images(texts)

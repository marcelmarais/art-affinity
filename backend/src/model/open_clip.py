import open_clip
import torch
from PIL import Image
from typing import List
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm
import base64
import io


class OpenClipModel:
    """
    A class to interact with the OpenCLIP model for embedding images into vectors.
    """

    def __init__(self, model_name: str = 'ViT-B-32', pretrained: str = 'laion2b_s34b_b79k') -> None:
        """
        Constructor for the OpenClipModel class.

        :param model_name: str, optional. The name of the model. Default is 'ViT-B-32'.
        :param pretrained: str, optional. The name of the pretrained weights. Default is 'laion2b_s34b_b79k'.
        """
        self.device = torch.device(
            'cuda' if torch.cuda.is_available() else 'cpu')
        if self.device.type == 'cpu':
            print("CUDA not found. Using CPU.")
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(
            model_name, pretrained)
        self.model = self.model.to(self.device)
        self.tokenizer = open_clip.get_tokenizer('ViT-B-32')

    def embed_images(self, images_base64: List[str]) -> List[List[float]]:
        """
        Function to embed a list of images (base64 encoded) into a list of embeddings.

        :param images_base64: List of str. A list of base64 encoded images to be embedded.
        :return: List of List of floats. A list of embeddings for the images.
        """
        embeddings = []
        batch_size = 256
        # Preprocess images in parallel and process in batches
        with ThreadPoolExecutor() as executor:
            for i in tqdm(range(0, len(images_base64), batch_size)):
                batch_base64 = images_base64[i:i + batch_size]
                images = list(executor.map(lambda x: self.preprocess(Image.open(
                    io.BytesIO(base64.b64decode(x)))).unsqueeze(0), batch_base64))
                images = torch.cat(images).to(self.device)

                with torch.no_grad():
                    image_features = self.model.encode_image(images)
                    normalized_features = image_features / \
                        image_features.norm(dim=-1, keepdim=True)
                    embeddings.extend(
                        normalized_features.cpu().numpy().tolist())

        return embeddings

    def embed_text(self, text):
        text = self.tokenizer(text)
        with torch.no_grad():
            text_features = self.model.encode_text(text)
            text_features /= text_features.norm(dim=-1, keepdim=True)

        return text_features.cpu().numpy().tolist()

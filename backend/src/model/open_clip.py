import open_clip
import torch
from PIL import Image
from typing import List
from concurrent.futures import ThreadPoolExecutor
from tqdm import tqdm

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
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        if self.device.type == 'cpu':
            print("CUDA not found. Using CPU.")
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(model_name, pretrained)
        self.model = self.model.to(self.device)


    def embed_images(self, image_paths: List[str]) -> List[List[float]]:
        """
        Function to embed a list of images (paths) into a list of embeddings.

        :param image_paths: List of str. A list of paths to the images to be embedded.
        :return: List of List of floats. A list of embeddings for the images.
        """
        embeddings = []
        batch_size = 512
        # Preprocess images in parallel and process in batches
        with ThreadPoolExecutor() as executor:
            for i in tqdm(range(0, len(image_paths), batch_size)):
                batch_paths = image_paths[i:i + batch_size]
                images = list(executor.map(lambda x: self.preprocess(Image.open(x)).unsqueeze(0), batch_paths))
                images = torch.cat(images).to(self.device)
                
                with torch.no_grad():
                    image_features = self.model.encode_image(images)
                    normalized_features = image_features / image_features.norm(dim=-1, keepdim=True)
                    embeddings.extend(normalized_features.cpu().numpy().tolist())
                    
        return embeddings


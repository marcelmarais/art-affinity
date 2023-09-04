from fastapi import FastAPI, Request, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional
from database.chroma_interface import ChromaInstance
from config.constants import DEV, IMAGES_UPLOAD_PATH
from config.utils import setup_dirs, convert_images_to_base64
import shutil
from pathlib import Path
import time
from PIL import Image, UnidentifiedImageError
setup_dirs()  # Create directories for image uploads
app = FastAPI()

if DEV:
    from fastapi.middleware.cors import CORSMiddleware

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows all origins
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods
        allow_headers=["*"],  # Allows all headers
    )

chroma_instance = ChromaInstance()
class Query(BaseModel):
    query_texts: List[str]
    n_results: Optional[int] = 50

class TextQuery(BaseModel):
    query_text: str
    n_results: Optional[int] = 50

# POST route for queries
@app.post("/query")
async def run_query(query: Query):
    query_texts = [str(query_text) for query_text in query.query_texts]
    results = chroma_instance.collection.query(
        query_texts=query_texts,
        n_results=query.n_results,
        include=["metadatas","distances"]
    )
    return results

@app.post("/text-query")
async def run_text_query(query: TextQuery):
    text_embedding = chroma_instance.embedding_function.embed_text(query.query_text)
    results = chroma_instance.collection.query(
        query_embeddings=text_embedding,
        n_results=query.n_results,
        include=["metadatas","distances"]
    )
    return results

# POST route for image uploads
@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    timestamp = int(time.time())
    filename = f"{timestamp}_{image.filename}"

    path_str = f"{IMAGES_UPLOAD_PATH}/{filename}"
    image_path = Path(path_str)
    with image_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    filename = convert_images_to_base64([path_str])[0]
    return {"filename": filename}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

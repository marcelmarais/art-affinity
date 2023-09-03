from fastapi import FastAPI, Request, File, UploadFile
from pydantic import BaseModel
from typing import List, Optional
from database.setup_chroma import ChromaInstance
from config.constants import DEV, IMAGES_UPLOAD_PATH
from config.utils import setup_dirs
import shutil
from pathlib import Path
import time

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

# Pydantic model for request body
class Query(BaseModel):
    query_texts: List[str]
    n_results: Optional[int] = 50

# POST route for queries
@app.post("/query")
async def run_query(query: Query):
    results = chroma_instance.collection.query(
        query_texts=query.query_texts,
        n_results=query.n_results,
    )
    print(results)
    return results

# POST route for image uploads
@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    timestamp = int(time.time())
    filename = f"{timestamp}_{image.filename}"
    image_path = Path(f"{IMAGES_UPLOAD_PATH}/{filename}")
    with image_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    return {"filename": filename}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

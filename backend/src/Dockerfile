# Use the specific Python runtime as a parent image
FROM python:3.10-slim-bullseye

# Set the working directory in the docker image
WORKDIR /app

RUN apt-get update --fix-missing && apt-get install -y --fix-missing build-essential


# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Make port 8000 available to the world outside this container (FastAPI default port)
EXPOSE 8000

# Run main.py when the container launches using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


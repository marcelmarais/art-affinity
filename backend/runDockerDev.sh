cd src
docker run --name backend -p 8000:8000 -d -v $(pwd):/app art-affinity-backend

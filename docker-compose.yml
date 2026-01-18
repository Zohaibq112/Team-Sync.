version: "3.8"

services:
  backend:
    build: ./backend
    container_name: mern-backend
    ports:
      - "9000:9000"
    env_file:
      - ./backend/.env

  frontend:
    build: ./client
    container_name: mern-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

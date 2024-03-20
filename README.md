# User and Policy management

1. This project contains dynamic CRUD operations using node.js as server with stored data in MongoDB
2. For MongoDB connection, using an "SocialFeeds" .env (it will redirect to )

# Creating .env file

- Create a new file named ".env" in the root directory of the project.
- Copy the above MongoDB configuration into the .env file and replace placeholders with your actual MongoDB connection details.

# To start Node.js server follow steps (cmd):

1. npm install (install all dependency)
   - Once install dependencies then start the backend server
2. npm start

# Here's a step-by-step guide to dockerize a Node.js application and a MongoDB database:

Step 1 : Set up a Node.js project with your application code. - Include a package.json file with your project dependencies and scripts.

Step 2 : Create a Dockerfile for the Node.js Application, - Create a file named "Dockerfile" in the root directory of your Node.js project. - Set the working directory "(WORKDIR)" inside the Docker container. - Copy package.json and package-lock.json files and install dependencies using "npm install". - Copy the rest of your application files into the container. - Expose the port your Node.js application listens on "EXPOSE 4000". - Define the command to start your Node.js application "CMD ["node", "app.js"]".

Step 3 : Create a Dockerfile for the MongoDB Database: - Use the official MongoDB Docker image "mongo:latest".

Step 4 : Create a Docker Compose File, - Create a file named docker-compose.yml in the root directory of your project. - Define services for your Node.js application and MongoDB database. - Specify the Dockerfile for each service. - Configure environment variables, volumes, and other settings as needed.

Step 5 : Build Docker Images, - Open a terminal and run command to build Docker images "docker-compose build".

Step 6 : Run Docker Containers, - After building the Docker images, you can run the containers using "docker-compose up". - Starts the containers defined in the docker-compose.yml file. - Once the containers are up and running, your Node.js application should be accessible at the specified port (e.g., http://localhost:3000). - MongoDB will be accessible internally within the Docker network.

Step 7 : To remove the containers and clean up resources, run: "docker-compose down"

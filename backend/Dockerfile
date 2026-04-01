# Use Node.js 20 base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Start the application using tsx watch for development environment
# In a true production environment, we would build to JS and use node, 
# but for this request, we keep it fully functional with the current setup.
CMD ["npm", "run", "dev"]

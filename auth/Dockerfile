# Base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED 1 

# Set work directory
WORKDIR /code

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install --upgrade pip

# Copy project files
COPY . .

# Run makemigrations and migrate commands
COPY start.sh /start.sh
RUN chmod +x /start.sh


# Expose port
EXPOSE 8000

# Start the Django server using the custom script
CMD ["/start.sh"]

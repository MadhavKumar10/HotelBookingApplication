Setting Up the Java Full Stack Booking App
This guide will walk you through the process of setting up the Java Full Stack Booking App on your local machine.

Prerequisites
Before you begin, ensure you have the following installed:

Java JDK 17 or higher
Maven 3.8+
MySQL 8.0 or PostgreSQL 14+

Cloning the Repository
Start by cloning the repository to your local machine:

bash
git clone https://github.com/MadhavKumar10/HotelBookingApplication.git
cd java-booking-app
Backend Configuration (Spring Boot)
1. Database Setup
MySQL/PostgreSQL: Install and create a database named hotel_booking

Update the database credentials in src/main/resources/application.properties

2. Environment Configuration
Navigate to the backend folder and update src/main/resources/application.properties:

properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your_jwt_secret_key_here_min_256_bits
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Stripe Configuration
stripe.secret-key=your_stripe_secret_key
stripe.public-key=your_stripe_public_key

# Frontend URL for CORS
app.frontend-url=http://localhost:3000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Logging
logging.level.com.yourpackage=DEBUG
3. External Services Setup


Cloudinary Setup:

Create an account at Cloudinary
Add these properties to application.properties:

properties
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
Stripe Setup:

Sign up at Stripe

Add your test keys to the Stripe configuration above

Frontend Configuration (React)
1. Environment Setup
Navigate to the frontend folder and create a .env file:

plaintext
VITE_API_BASE_URL=http://localhost:8080/api
VITE_STRIPE_PUB_KEY=your_stripe_publishable_key
Running the Application
Backend (Spring Boot)
Navigate to the backend directory:

bash
cd backend
Run the application:

bash
# Using Maven
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/booking-app-0.0.1-SNAPSHOT.jar
The backend will start on http://localhost:8080

Frontend (React)
Open a new terminal and navigate to frontend:

bash
cd frontend
Install dependencies and start:

bash
npm install
npm run dev
The frontend will start on http://localhost:3000

This Java Full Stack setup provides a robust, scalable foundation for a hotel booking application with modern development practices and comprehensive documentation.

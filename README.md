# GroundBnB

# Table of contents
* [Project Overview](#project-overview)
* [Getting Started](#getting-started)
* [Test Accounts] (#test-accounts)
* [Technologies](#technologies)
* [Database](#database)

<!-- Project Overview -->
# <a name="project-overview"></a>Project Overview

Many memorable events occur in a backyard. Barbecues, parties, cookouts, etc. are all things that happen in a backyard. However, many people very rarely use thier backyard and even more unfortunate, many people, especially in cities, do not have a backyard at all. The goal of GroundBnb is to be a revolutinary game changer that allows people who are looking for backyards to use and rent with people who do not use their own backyard. GroundBnb helps homeowners profit off their own backyards while bringing the opportunity for others to enjoy them.
<br>

Customers who have GroundBnB accounts are able to browse backyards to rent while also being able to rent out their own backyards. Comsters can review and rate the backyards they have rented, and customers who list their backyards can thoroughly describe all the features and amenities they can offer. Finally, customers can search by location on what backyard they would like to rent and GroundBnB will display all nearby results that match their criteria.

# <a name="getting-started"></a> Getting Started

1. Clone repository 
    ```sh
    git clone https://github.com/davidtayloryangg/GroundBnB.git
    ```
2. If not already installed on your machine, install the ImageMagick CLI tools. On Mac you can use the following command through Homebrew:
    `brew install imagemagick`
   Or you can install based on your machine here: [ImageMagick Downloads](https://imagemagick.org/script/download.php)
   
2. Add `.env` files to client and server folders. They should contain the following keys:
    * REACT_APP_FIREBASE_KEY
    * REACT_APP_FIREBASE_DOMAIN
    * REACT_APP_FIREBASE_DATABASE
    * REACT_APP_FIREBASE_PROJECT_ID
    * REACT_APP_FIREBASE_STORAGE_BUCKET
    * REACT_APP_FIREBASE_SENDER_ID
    * REACT_APP_FIREBASE_APP_ID
    * REACT_APP_FIREBASE_MEAS_ID
    * REACT_APP_GOOGLE_MAPS_API_KEY
3. Install server dependencies 
    ```sh
    cd server/
    npm i
    ```
4. Install client dependencies
    ```sh
    cd client
    npm i
5. Start server & client (Locally)
    ```sh
    npm start
    ```
# <a name="test-accounts"></a> Test Accounts
Use the following account to test our application, or simply create a new account!
* Email: test@test.com
* Password: 12345678

# <a name="technologies"></a>Technologies
* [React](https://reactjs.org/docs/getting-started.html)
* [Firebase Authentication](https://firebase.google.com/docs/auth)
* [TypeScript](https://www.typescriptlang.org/)
* [Firebase Firestore Database](https://firebase.google.com/docs/firestore)
* [ImageMagick](https://imagemagick.org/script/index.php)

# <a name="database"></a>Database
We are using various Firebase products to house our application's data, including Authentication, Firestore Database, and Storage. We invited Professor Hill using the phill@stevens.edu email.

Here is this link to our project: [GroundBnB](https://console.firebase.google.com/u/2/project/groundbnb-c4531/overview). 

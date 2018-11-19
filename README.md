# SCA WEB ACCESS COMP

## 1. sca_web_back - folder that contains django-rest backend app. 
**WARNING!!!** before starting the app, you should check if there's a `sca_web_back/secret_config.py` file. It should contain just one variable `TOP_SECRET_KEY = "...some_long_15+string"`
If there isn't, you will have to create this file yourself, otherwice the app won't start. (Or you can specify the key directly in `sca_web_back/settings.py`, SECRET_KEY = ...).
This is made in order not to store the key in repository.  

**WARNING 2!!!** See the authorization and security section of this README.MD

## 2. sca_web_front - folder with React wep client. 


## AUTHENTICATION & SECURITY

**AUTHENTICATION**  

Now SCA WEB ACCESS component uses **'rest_framework.authtoken'** and **'corsheaders'** as authentication and CORS handling middleware.  
Users need login & password to log in and use the SCA WEB ACCESS.   
But Users are symply Django-admin superusers! So you can register a new user via console.


	cd sca_web_back
	python manage.py createsuperuser 
	
_and just follow the instructions_ 


And the username and password you specify in `createsuperuser`, you will later use to log in via your browser.

**CROSS-ORIGIN-REQUESTS**

sca_web_back by default accepts requests only from `http://localhost:3000`. That's the default host that yarn development server runs. If needed, you can add another
host to make django backend work with it. Open `sca_web_back/settings.py` and add your host into list:


	CORS_ORIGIN_WHITELIST = (
   		"localhost:3000",
	)


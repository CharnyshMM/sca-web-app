# HOWTO START SCA_WEB_COMPONENT

## 1. Before you start (SETTINGS SECTION)

1. Start neo4j and check connection data. sca_web_back app takes them from `./sca_web_back/sca_web_back/sca_api_app/neo_config.py`. So check and change them if needed.

2. Check if there is `./sca_web_back/sca_web_back/secret_config.py`. If's a file that contains single string TOP_SECRET_KEY, 15+ chars long. It's used to generate access tokens when authorizing users. If it doesn't exist, symply create it! Example below:

    TOP_SECRET_KEY = "1234567890qwertyui!@#$%^&*("

3. The backend is set to respond to only domains from _CORS__ORIGIN__WHITELIST_. So if you started frontend React app and you can't sign in, check the console (Chrome Developer Tools, F12). And if you see come _CORS error_, probably that's it. The whitelist is written in `./sca_web_back/sca_web_back/settings.py`, somewhere in the end of the file. To make the app work O.K. just add the host on which the Frontend app is running into this tuple. Example below (use the following format):

    CORS_ORIGIN_WHITELIST = (
        "localhost:3000",
    )

4. If frontend starting with `yarn start` shows that some packages are missing, you can try to do install them automatically with `yarn install`.

5. If you have just clonned the repo or you don't remember username/password to log in, you can create a new user with 

    cd ./sca_web_back/
    python manage.py createsuperuser


## 2. Running

### 1) start the back

1. `cd ./sca_web_back/`
   
2. `python manage.py runserver`

### 2) start the front

1. `cd ./sca_web_front`

2. `yarn start`
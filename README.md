P6 - Parcours développeur Web

Pour visualiser le projet :

1. Cloner le repository
2. À partir de P6/frontend faire npm install puis npm run start
3. À partir de P6/backend faire npm install puis node server
4. Se créer un fichier .env dans P6/backend/ et mettre sa clé de base de donnée (syntaxe : MONGO_DB=CLE)
5. Ouvrir le frontend à l'adresse http://localhost:4200/ (Ou celle configurée)

Pour avoir un clé MONGO_DB :
1. Se créer une base de donnée gratuite depuis https://www.mongodb.com/fr-fr (création de compte nécessaire)
2. Se créer un Database User dans Database Access avec les droits "Read and write to any database" (Built-in Role)
3. Autorisé l'accès depuis toutes les IP dans Network Access (add id adress puis allow access from anywhere)
4. Pour récupérer la clé MONGO_DB : Database > Connect > Drivers > "Add your connection string into your application code" et copier ensuite la clé dans le fichier .env (ne pas oublier de mettre son mot de passe utilisateur à la place de "password <> inclus")# P6

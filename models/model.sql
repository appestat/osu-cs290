CREATE TABLE boards (
    board_id INT(10) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    defaultElo FLOAT(5),
    defaultRD FLOAT(5),
    defaultVol FLOAT(5),
    tau FLOAT(5),
    games INT(10)
);

CREATE TABLE users (
    user_id INT(10) PRIMARY KEY AUTO_INCREMENT,
    elo FLOAT(5),
    RD float(5),
    VOL float(5),
    board INT(10) REFERENCES boards(board_id),
    user_profile INT(10) REFERENCES uprofile(profile_id)
    );
CREATE TABLE game (
    match_id INT(10) PRIMARY KEY AUTO_INCREMENT,
    create_time DATETIME,
    info varchar(300)
    );
CREATE TABLE users_game (
    user_id INT(10) REFERENCES users(user_id),
    game_id INT(10) REFERENCES game(match_id)
    );
CREATE TABLE PROFILE (
    name VARCHAR(20)
    );

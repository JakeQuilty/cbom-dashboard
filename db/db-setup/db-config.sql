CREATE TABLE user
(
    user_id INT(8) NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(16) NOT NULL,
    user_password VARCHAR(32) NOT NULL,
    first_name VARCHAR(16),
    last_name VARCHAR(16),
    account_priv INT NOT NULL,

    PRIMARY KEY (user_id)
);

CREATE TABLE organization
(
    org_id INT(8) NOT NULL AUTO_INCREMENT,
    gh_id INT NOT NULL,
    org_name VARCHAR(255) NOT NULL,
    -- need to  figure out encryption type for this
    auth_token JSON NOT NULL,
    user_id INT(8) NOT NULL,

    PRIMARY KEY (org_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE repository
(
    repo_id INT(16) NOT NULL AUTO_INCREMENT,
    repo_name VARCHAR(255) NOT NULL,
    default_branch VARCHAR(32) NOT NULL,
    org_id INT(8) NOT NULL,

    PRIMARY KEY (repo_id),
    FOREIGN KEY (org_id) REFERENCES organization (org_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE file_type
(
    type_id INT(8) NOT NULL AUTO_INCREMENT,
    language_name VARCHAR(255) NOT NULL,

    PRIMARY KEY (type_id)
);

CREATE TABLE dependency_file
(
    depfile_id INT(32) NOT NULL AUTO_INCREMENT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    repo_id INT(16) NOT NULL,
    type_id INT(8) NOT NULL,

    PRIMARY KEY (depfile_id),
    FOREIGN KEY (repo_id) REFERENCES repository (repo_id) ON DELETE CASCADE ON UPDATE CASCADE,
    -- do not cascade delete
    FOREIGN KEY (type_id) REFERENCES file_type (type_id)
);

CREATE TABLE dependency
(
    dep_id INT(64) NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(255) NOT NULL,
    dep_version VARCHAR(16) NOT NULL,
    scan_date DATE NOT NULL,
    depfile_id INT(32) NOT NULL,

    PRIMARY KEY (dep_id),
    FOREIGN KEY (depfile_id) REFERENCES dependency_file (depfile_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX idx_user_name ON user(user_name);
CREATE UNIQUE INDEX idx_user_org ON organization(org_name, user_id);
CREATE UNIQUE INDEX idx_org_repo ON repository(repo_name, org_id);
CREATE UNIQUE INDEX idx_repo_depfile ON dependency_file(file_path, repo_id);


INSERT INTO file_type (language_name) VALUES ('python');
INSERT INTO file_type (language_name) VALUES ('ruby');
INSERT INTO file_type (language_name) VALUES ('javascript');
-- root default password is changeme
INSERT INTO user (user_name, user_password, account_priv) VALUES ('root', '4cb9c8a8048fd02294477fcb1a41191a', '0');
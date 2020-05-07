
-- Inserted a set of records into departments
INSERT INTO departments
    (name)
VALUES
    ("Management"),
    ("Engineering"),
    ("Operations");

-- Inserted a set of records into roles
INSERT INTO roles
    (title, salary, department_id)
VALUES
    ("Head honcho", "5000000", "1"),
    ("Vice-president", "1000000", "1"),
    ("Middle manager", "200000", "2"),
    ("Code monkey", "100000", "2"),
    ("Intern", "50000", "3");

-- Inserted a set of records into employees
INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Steve", "McQueen", "1", null),
    ("Richard", "Attenborough", "2", "1"),
    ("James", "Garner", "3", "1"),
    ("Charles", "Bronson", "4", "1"),
    ("Donald", "Pleasence", "5", "2"),
    ("James", "Coburn", "5", "2"),
    ("David", "McCallum", "4", "2"),
    ("Gordon", "Jackson", "5", "3");



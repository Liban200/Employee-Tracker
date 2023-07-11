INSERT INTO departments(department_name)
VALUES
('Sales'),
('Finance'),
('Legal'),
('Enginerring'),
('Service');

INSERT INTO roles(role_title, salary, department_id)
VALUES
('Sales Manager', 130000, 1),
('Salesperson', 70000, 1),
('Accountant', 100000, 2),
('Accounts Director', 175000, 2),
('Paralegal',60000, 3),
('Lawyer', 140000, 3),
('Software Engineer',110000 , 4),
('Junior Software Engineer', 80000,4),
('IT Service', 85000, 5),
('Customer Service', 70000, 5);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Jennifer','McDonald', 1 ,null),
('Caterina','Ricci', 2 ,1),
('Saeed','Al-Owairan', 3 ,null),
('Eiður','Guðjohnsen', 4 ,3),
('Mike','Jones', 5 ,null),
('Christopher','Wallace', 6 ,5),
('Taylor','Swift', 7 ,null),
('Eddie','Cheung', 8 ,7),
('Keisha','Flenory', 9 ,null),
('Abdi','Abdi', 10 ,9);





-- Query to fetch manager details for each employee
SELECT 
    a.manager_id, 
    CONCAT(b.first_name, ' ', b.last_name) AS Manager 
FROM 
    employee AS a, 
    employee AS b, 
    role AS c, 
    department AS d 
WHERE 
    a.manager_id = b.id;

-- Query to fetch detailed employee information along with their manager details
SELECT 
    a.id, 
    a.first_name, 
    a.last_name, 
    c.title, 
    d.name AS department_name, 
    c.salary, 
    CONCAT(b.first_name, ' ', b.last_name) AS Manager 
FROM 
    employee AS a 
    JOIN employee AS b ON a.manager_id = b.id 
    JOIN role AS c ON a.role_id = c.id 
    JOIN department AS d ON c.department = d.id;

-- Query to fetch detailed employee information along with their manager details using LEFT JOIN
SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department_name, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM 
    employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department = department.id 
    LEFT JOIN employee AS manager ON manager.id = employee.manager_id;
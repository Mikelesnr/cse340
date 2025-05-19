--insert record tony stark
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--edit Tony Stark account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
--delete Tony Stark account
DELETE FROM account
WHERE account_id = 1;
--update part of the inventory description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- inner join
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
--update inv_image and inv_thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
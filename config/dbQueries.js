module.exports = {
    LOGIN_QUERY: 'SELECT id, full_name, email, mobile FROM users WHERE email = "{email}" AND password = "{password}" AND status = "ACTIVE"',
    REGISTER_QUERY: 'INSERT INTO users (email, password, registration_date) values ("{email}", "{password}", DATE(NOW()))',
    USER_EXISTS: "SELECT count(*) AS count from users WHERE email = '{email}' ",
    CHANGE_PASSWORD: "UPDATE users SET password = '{password}' WHERE email = '{email}' AND status = 'ACTIVE' ",
    SUBSCRIBE_USER: "INSERT INTO subscribers (email) values ('{email}')",
    COMPANY_EVENTS_QUERY: "SELECT id, title, description, event_date, image FROM company_events ORDER BY event_date LIMIT 100",
    SUBSCRIBE_USER_EXISTS: "SELECT USERS+SUBSCRIBERS AS count FROM (SELECT (SELECT count(*) AS count from users WHERE email = '{email}') AS users, (SELECT count(*) AS count from subscribers WHERE email = '{email}') AS SUBSCRIBERS ) FINAL",
    CATEGORY_FETCH: "SELECT id, name, parent_category_id, description, category_images FROM categories where status = 'ENABLE' order by parent_category_id",
    PRODUCT_DETAILS: "SELECT p.id, p.images, name, p.description, features, security_deposit, AVG(rating) as rating, brand, rent, count(DISTINCT product_reviews.id) as num_of_reviews FROM products p LEFT JOIN product_reviews ON p.id = product_reviews.product_id WHERE p.id = {product}",
    TOP_BANNER_DATA: "SELECT category_image, category_name, category_id FROM banners b LEFT JOIN top_banner t on b.id = t.banner_id where t.ID IS NOT NULL AND status = 'ENABLE' LIMIT 5",
    THREE_IMAGE_DATA: "SELECT category_image, category_title, category_id FROM banners b LEFT JOIN three_image_banner t on b.id = t.banner_id where t.ID IS NOT NULL AND status = 'ENABLE' group by category_id, category_title LIMIT 3",
    SAME_CATEGORY_PRODUCTS: "SELECT p.id, p.name, p.description, p.images, brand, number_of_views FROM products p WHERE p.category_id IN ( SELECT category_id FROM products WHERE id = {product} ) AND p.id != {product}",
    WIDE_BANNER_DATA: "SELECT heading, description, category_id FROM banners b LEFT JOIN wide_banner t on b.id = t.banner_id where t.ID IS NOT NULL AND status = 'ENABLE' LIMIT 3",
	GET_PRODUCT_REVIEWS: "SELECT product_id, rating, title, description, review_date, CASE WHEN is_anonymous = 'NO' THEN full_name ELSE '(Anonymous)' END as reviewer from product_reviews LEFT JOIN users on users.id = product_reviews.user_id where product_id = {product}",
    CATEGORY_LIST: "SELECT banner_id, banner_title, category_text, c.category_id as link from banners b left JOIN category_list_banner c on b.id = c.banner_id where banner_type = 'CATEGORY_LIST_BANNER' AND status = 'ENABLE'",
    CATEGORY_TABS: "SELECT tab_text, category_id from banners b left JOIN banner_tabs bt on bt.banner_id = b.id where b.id = {{id}}",
    GET_PRODUCTS: "SELECT p.id, p.name, images, brand, number_of_views, AVG(rating) as rating, rent FROM categories c1 LEFT JOIN categories c2 ON (c1.parent_category_id = c2.id) LEFT JOIN categories c3 ON (c2.parent_category_id = c3.id) LEFT JOIN products p ON (c1.id = p.category_id OR c2.id = p.category_id OR c3.id = p.category_id) LEFT JOIN product_reviews on product_reviews.product_id = p.id WHERE (c1.id = {category} or c2.id = {category} or c3.id = {category}) AND p.id IS NOT NULL",
    EIGHT_IMAGE_DATA: "SELECT category_image, category_title, category_id FROM banners b LEFT JOIN eight_image_banner t on b.id = t.banner_id where t.ID IS NOT NULL AND status = 'ENABLE' group by category_id, category_title LIMIT 8",
    GET_CATEGORY_PIVOT: "SELECT c1.ID as categoryId, c1.name as categoryName, c2.ID as p1_categoryId, c2.name  as p1_categoryName, c3.ID as p2_categoryId, c3.name as p2_categoryName from categories c1 LEFT JOIN categories c2 ON c1.parent_category_id = c2.id LEFT JOIN categories c3 ON c2.parent_category_id = c3.id where c1.ID = {category}",
    GET_PRODUCT_PIVOT: "SELECT c1.ID as categoryId, c1.name as categoryName, c2.ID as p1_categoryId, c2.name  as p1_categoryName, c3.ID as p2_categoryId, c3.name as p2_categoryName,p.name as productName from categories c1 LEFT JOIN categories c2 ON c1.parent_category_id = c2.id LEFT JOIN categories c3 ON c2.parent_category_id = c3.id LEFT JOIN products p ON p.category_id = c1.id where p.id = {product}",
        
    DETAILED_BANNER: "SELECT banner_id, banner_title, category_image, category_id from banners b left JOIN detailed_banner d on b.id = d.banner_id where banner_type = 'DETAIL_BANNER' AND status = 'ENABLE'",
    DETAILED_CATEGORY_LIST: "SELECT category_text, c.category_id as link from banners b left JOIN category_list_banner c on b.id = c.banner_id where banner_type = 'DETAIL_BANNER' AND status = 'ENABLE'",
    EIGHT_IMAGE_CATEGORY_LIST: "SELECT category_text, c.category_id as link from banners b left JOIN category_list_banner c on b.id = c.banner_id where banner_type = 'EIGHT_IMAGE_BANNER' AND status = 'ENABLE'",
    
    GET_RENT_RANGE: "SELECT MIN(rent) as minRange, MAX(rent) as maxRange FROM (SELECT rent, p.id FROM categories c1 LEFT JOIN categories c2 ON c2.parent_category_id = c1.id LEFT JOIN categories c3 ON c3.parent_category_id = c2.id LEFT JOIN products p ON (p.category_id = c1.id OR p.category_id = c2.id OR p.category_id = c3.id) WHERE c1.id = {category} OR c2.id = {category} OR c3.id = {category} group By p.id) a",
    
    GET_BRAND_RANGE: "SELECT distinct brand as filterKey from categories c1 LEFT JOIN categories c2 ON c2.parent_category_id = c1.id LEFT JOIN categories c3 ON c3.parent_category_id = c2.id LEFT JOIN products p on (p.category_id = c1.id OR p.category_id = c2.id OR p.category_id = c3.id) WHERE (c1.id = {category} OR c2.id = {category} OR c3.id = {category}) AND BRAND IS NOT NULL",
    UPDATE_VIEWS_QUERY: "UPDATE products SET number_of_views = number_of_views + 1 WHERE id = {product}",
    INSERT_REVIEWS_QUERY: "INSERT INTO user_reviews(user_id, rating, title, description, reviewer, review_date, is_anonymous) values ({userId}, {rating}, '{title}', '{description}', {reviewer}, DATE(NOW()), {isAnonymous})",
    SELECT_REVIEWS_QUERY: "SELECT ur.rating, ur.title, ur.description, " +
    "CASE WHEN ur.is_anonymous = 0 THEN u.full_name ELSE '(Anonymous)' END as reviewer, ur.review_date FROM user_reviews ur LEFT JOIN users u ON ur.reviewer = u.id WHERE ur.id = {id}",
    GET_QUICK_LINKS: "SELECT c1.id, c1.name FROM categories c LEFT JOIN categories p1 ON p1.id = c.parent_category_id LEFT JOIN categories c1 ON c1.parent_category_id = p1.id WHERE c.id = {category} AND c1.id !=c.id",
    SEARCH_PRODUCT: "select p.id, p.name, p.brand from products p where p.name LIKE '%{searchParam}%' or p.category_id IN (SELECT c.id from categories c WHERE c.name LIKE '%{searchParam}%' AND status = 'ENABLE') ORDER BY p.number_of_views DESC LIMIT 3" ,
    SEARCH_CATEGORY: "select c.id, c.name, c.description from categories c where name LIKE '%{searchParam}%' AND status = 'ENABLE'  LIMIT 5",
    FAQ_QUERY: "SELECT c.id, name, question, answer, image from faq_categories c LEFT JOIN faq_questions ON c.id = faq_questions.faq_category_id",
    GET_CHILD_CATEGORIES: "SELECT c.name as parent, c1.id, c1.name from categories c LEFT JOIN categories c1 on c.id = c1.parent_category_id where c.id = {category}",
    SAVE_USER_DETAILS: "UPDATE users SET full_name='{full_name}', email='{email}', mobile='{mobile}', profile_pic='{profile_pic}', address='{address}', city='{city}', state='{state}', alternate_number='{alternate_number}' WHERE id = {id}",
    GET_USER_DETAILS: "SELECT id, full_name, email, mobile, address, city, state from users where email='{email}' AND status='ACTIVE'",
    PLACE_ORDER: "INSERT INTO orders(renter_id, order_time, delivery_address, status) VALUES ('{renterId}', now(), '{address}', 'PENDING')",
    CANCEL_ORDER: "UPDATE orders SET status = 'CANCELLED_BY_USER' WHERE orders.id = {orderId} AND renter_id = {renter_id}",
    GET_RATING_STATS: "select rating, count(*) from product_reviews where product_id = {product} group by rating",
    GET_PRODUCTS_BY_LIST: "SELECT id, name, images, brand, number_of_views, rent, security_deposit FROM products where id IN ({productList})",
    GET_ORDER_DETAILS: "SELECT o.id as orderId, o.status, o.delivery_address as deliveryAddress, o.order_time as orderTime, p.id as productId, p.name, p.description, p.brand, oi.rent FROM orders o LEFT JOIN users u on u.id = o.renter_id LEFT JOIN order_item_mapping oi on o.id = oi.order_id LEFT JOIN products p ON oi.product_id = p.id where o.id = {orderId} AND u.email = '{userEmail}'",
    INSERT_ITEM_MAPPING: "insert into order_item_mapping (order_id, product_id, rented_for_months, rent) values ",
    GET_ORDERS_BY_USER: "SELECT o.id as order_id, renter_id, order_time, delivery_address as address, o.status, p.name as productName, oi.product_id, count(oi.product_id) as product_count, brand, oi.rent as rent FROM orders o LEFT JOIN order_item_mapping oi ON o.id = oi.order_id LEFT JOIN products p ON oi.product_id = p.id WHERE renter_id = {renter_id} group by oi.product_id",
    GET_SAVED_ADDRESSES: "SELECT id, name, pincode, address, mobile, landmark, city, address_type, is_default from user_addresses where user_id = {userId} order by last_updated DESC",
    DELETE_SAVED_ADDRESSES: "DELETE FROM user_addresses where user_id = {userId} AND id = {addressId}",
    EDIT_ADDRESS: "UPDATE user_addresses set name = '{name}', pincode = {pincode}, address = '{address}', mobile = '{mobile}', landmark = '{landmark}', city = '{city}', address_type = '{addressType}', is_default = {isDefault} where ID = {addressId} AND user_id={userId}"
};
-- Vue Project Tables Initialization

-- Table: equipment
CREATE TABLE IF NOT EXISTS equipment (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    sport_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    image_url TEXT
);
INSERT INTO equipment VALUES
(1, 'FootBall Ball', 5.00, 1, '2024-12-12 07:49:52', '2024-12-12 11:12:37', 'https://i0.wp.com/www.ballesdesport.com/wp-content/uploads/2024/08/IS7438_1_HARDWARE_Photography_Fr.jpg?fit=300%2C300&ssl=1'),
(2, 'VolleyBall Ballon', 20.00, 5, '2024-12-12 08:02:09', '2024-12-12 11:13:57', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWtiWO3OM4lNwnoHQxsgZx1VLvB96CDPgPiQ&s'),
(3, 'Tenis Racquet', 10.00, 3, '2024-12-16 07:08:14', '2024-12-16 07:08:14', 'https://target.scene7.com/is/image/Target/GUEST_a9307de1-8b92-4b68-a2c3-1affc025b94d?wid=488&hei=488&fmt=pjpeg'),
(4, 'Basket Ball', 5.00, 2, '2024-12-16 07:14:52', '2024-12-16 07:14:52', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Ryk00uE0IG0lZiwyKw3l35sViFi2x__GpQ&s'),
(5, 'Badminton Racquet', 10.00, 4, '2024-12-16 07:18:35', '2024-12-16 07:18:35', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIw5o3e0r0a-UiS5N4Psf_6dHW5VsAI6NXKw&s'),
(6, 'Ping Pong Racquet', 10.00, 6, '2024-12-16 07:20:11', '2024-12-16 07:20:11', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-wyG9OYbHbHJVBtppSW_SAxtO7BWg5NkZ5g&s'),
(7, 'Boxe Gants', 10.00, 7, '2024-12-16 07:22:31', '2024-12-16 07:22:31', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdsz_t7ezBDX5AXHN6wK67xDP5Poz5k9veFw&s');

-- Table: fields
CREATE TABLE IF NOT EXISTS fields (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    sport_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    image_url TEXT
);
INSERT INTO fields VALUES
(1, 'Basketball Field 1', 10.00, 2, '2024-12-12 10:46:03', '2024-12-16 07:16:19', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCkyTY5CG0SndAEU6wytsnF13ZdRVfxH8bNA&s'),
(2, 'Tenis Field 1', 15.00, 3, '2024-12-16 07:08:52', '2024-12-16 07:09:11', 'https://res.cloudinary.com/anybuddy/image/upload/w_280,h_140,c_fill/c_scale,w_auto/dpr_auto/f_auto,q_auto:eco/v1684860648/la-fontaine-tc-somenull-some25728159-544a-4ce1-89fb-125b6397664c-202305231650475620000.jpg'),
(3, 'Football Field 1', 10.00, 1, '2024-12-16 07:15:49', '2024-12-16 07:15:49', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLDhZsIw3vj9DKzi26jtCuca7Dslybjv4lyw&s'),
(4, 'Badminton Field 1', 10.00, 4, '2024-12-16 07:17:47', '2024-12-16 07:17:47', 'https://media.istockphoto.com/id/1040174716/fr/photo/ligne-verte-de-badminton.jpg?s=612x612&w=0&k=20&c=oXjde8aJ7tqwaNGg7_Y9Q46W_2Mn_mDqEzSw6SV3gNI='),
(5, 'Volleyball Field', 20.00, 5, '2024-12-16 07:19:31', '2024-12-16 07:19:31', 'https://media.istockphoto.com/id/1442249452/fr/photo/terrain-de-volley-ball-avec-filet-dans-le-gymnase-de-la-vieille-%C3%A9cole-vue-de-dessus-espace-de.jpg?s=612x612&w=0&k=20&c=h0llTcsTyEsIX7QZ8e86RQmRjLcHythUAr1ZuiYnKWw='),
(6, 'Ping Pong Table', 15.00, 6, '2024-12-16 07:20:59', '2024-12-16 07:20:59', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4aV2RS5JwMkUym_NqSEY-4pUSgzuw3zAPWA&s'),
(7, 'Box Ring 1', 15.00, 7, '2024-12-16 07:22:01', '2024-12-16 07:22:01', 'https://img.peerspace.com/image/upload/ar_1.5,c_fill,g_auto,f_auto,q_auto,dpr_auto,w_3840/n55htsedhcjffz2f3fnm');

-- Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
    id INT PRIMARY KEY,
    type VARCHAR(255),
    item_id INT,
    reservation_date DATE,
    user_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    status INT
);
INSERT INTO reservations VALUES
(8, 'equipment', 1, '2024-12-18', 4, '2024-12-16 06:34:51', '2024-12-16 06:54:18', 1),
(11, 'field', 6, '2024-12-18', 4, '2024-12-16 10:52:30', '2024-12-16 10:52:30', 0);

-- Table: sports
CREATE TABLE IF NOT EXISTS sports (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    image_url TEXT
);
INSERT INTO sports VALUES
(1, 'Football', '2024-12-12 14:42:44', '2024-12-12 14:42:44', 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'),
(2, 'Basketball', '2024-12-12 14:42:44', '2024-12-12 14:42:44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfjBmryXwSiJRvsyRtYV3eh247Ax4Xun3ZCg&s'),
(3, 'Tennis', '2024-12-12 14:42:44', '2024-12-12 14:42:44', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXEAPZUuFTHsdMLaz777VLcveAswNJ7LsHA&s'),
(4, 'Badminton', '2024-12-12 14:42:44', '2024-12-12 14:42:44', 'https://st2.depositphotos.com/1046535/7980/i/450/depositphotos_79804048-stock-photo-badminton-sport-in-gym-hand.jpg'),
(5, 'Volleyball', '2024-12-12 14:42:44', '2024-12-12 14:42:44', 'https://st2.depositphotos.com/4431055/11855/i/450/depositphotos_118552636-stock-photo-volleyball-object-on-background.jpg'),
(6, 'Ping Pong', '2024-12-12 07:49:02', '2024-12-12 07:49:02', 'https://media.istockphoto.com/id/502189498/fr/photo/balle-et-batte-de-tennis-de-table.jpg?s=612x612&w=0&k=20&c=ixhR2ZOZq2qX3ObflOLbkatMTNxlEzMVIWhuDC4doMY='),
(7, 'Boxe', '2024-12-12 07:51:03', '2024-12-12 07:51:03', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHAFYizBYvFHwpsulARVeRvKsKvPPAGvsD0Q&s');

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    status INT
);
INSERT INTO users VALUES
(1, 'dems', 'dems@dems.fr', '$2a$10$aHE3s7QCJj89JrsP0nb1huyiCa04GRlfd/2S21VkzBrBuMdisW2ky', '2024-12-12 06:31:36', '2024-12-12 06:31:36', 0),
(4, 'admin', 'admin@admin.fr', '$2a$10$mWU.s0.Yc.VpO4bMceIQDeiy3IgNJv1Pg1U9RklOipcFsEymNp8bi', '2024-12-12 07:45:12', '2024-12-12 07:45:12', 1),
(5, 'admin2', 'admin2@admin.fr', '$2a$10$7yugsnSsNJ/4ODkdZIIc8.IlWMGFa16wn7SJeszvl8G1MnhgqNZDC', '2024-12-12 09:51:57', '2024-12-12 09:51:57', 1);

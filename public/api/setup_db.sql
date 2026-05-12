-- Skolux Multi-Tenant ERP Database Setup

CREATE TABLE IF NOT EXISTS `school_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` varchar(50) NOT NULL,
  `data_type` varchar(50) NOT NULL,
  `session_id` varchar(20) NOT NULL,
  `content` longtext NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `school_tenant_key` (`school_id`, `data_type`, `session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Note: The UNIQUE KEY ensures that for each school, 
-- there is only one entry per data type (e.g. students) per academic session.

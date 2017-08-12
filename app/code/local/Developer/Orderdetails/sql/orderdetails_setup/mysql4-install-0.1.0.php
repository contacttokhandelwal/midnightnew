<?php
$installer = $this;
$installer->startSetup();
$sql=<<<SQLTEXT

CREATE TABLE IF NOT EXISTS `order_details` (
`id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `increment_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_email` varchar(32) NOT NULL,
  `order_date` varchar(32) NOT NULL,
  `delivery_date` varchar(64) NOT NULL,
  `delivery_time` int(64) NOT NULL,
  `message` text NOT NULL,
  `special_request` text NOT NULL,
  `other_contact_number` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `order_details`
 ADD PRIMARY KEY (`id`), ADD KEY `id` (`id`);

ALTER TABLE `order_details`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
SQLTEXT;

$installer->run($sql);

$installer->endSetup();
	 
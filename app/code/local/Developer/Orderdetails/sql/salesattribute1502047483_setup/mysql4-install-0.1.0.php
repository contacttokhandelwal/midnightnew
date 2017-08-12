<?php
$installer = $this;
$installer->startSetup();

$installer->addAttribute("order_address", "delivery_date", array("type"=>"varchar"));
$installer->endSetup();
	 
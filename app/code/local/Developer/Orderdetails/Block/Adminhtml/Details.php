<?php


class Developer_Orderdetails_Block_Adminhtml_Details extends Mage_Adminhtml_Block_Widget_Grid_Container{

	public function __construct()
	{

	$this->_controller = "adminhtml_details";
	$this->_blockGroup = "orderdetails";
	$this->_headerText = Mage::helper("orderdetails")->__("Details Manager");
	$this->_addButtonLabel = Mage::helper("orderdetails")->__("Add New Item");
	parent::__construct();
	
	}

}
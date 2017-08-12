<?php
class Developer_Orderdetails_Block_Adminhtml_Details_Edit_Tabs extends Mage_Adminhtml_Block_Widget_Tabs
{
		public function __construct()
		{
				parent::__construct();
				$this->setId("details_tabs");
				$this->setDestElementId("edit_form");
				$this->setTitle(Mage::helper("orderdetails")->__("Item Information"));
		}
		protected function _beforeToHtml()
		{
				$this->addTab("form_section", array(
				"label" => Mage::helper("orderdetails")->__("Item Information"),
				"title" => Mage::helper("orderdetails")->__("Item Information"),
				"content" => $this->getLayout()->createBlock("orderdetails/adminhtml_details_edit_tab_form")->toHtml(),
				));
				return parent::_beforeToHtml();
		}

}

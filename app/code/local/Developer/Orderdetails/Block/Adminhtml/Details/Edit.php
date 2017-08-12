<?php
	
class Developer_Orderdetails_Block_Adminhtml_Details_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
		public function __construct()
		{

				parent::__construct();
				$this->_objectId = "id";
				$this->_blockGroup = "orderdetails";
				$this->_controller = "adminhtml_details";
				$this->_updateButton("save", "label", Mage::helper("orderdetails")->__("Save Item"));
				$this->_updateButton("delete", "label", Mage::helper("orderdetails")->__("Delete Item"));

				$this->_addButton("saveandcontinue", array(
					"label"     => Mage::helper("orderdetails")->__("Save And Continue Edit"),
					"onclick"   => "saveAndContinueEdit()",
					"class"     => "save",
				), -100);



				$this->_formScripts[] = "

							function saveAndContinueEdit(){
								editForm.submit($('edit_form').action+'back/edit/');
							}
						";
		}

		public function getHeaderText()
		{
				if( Mage::registry("details_data") && Mage::registry("details_data")->getId() ){

				    return Mage::helper("orderdetails")->__("Edit Item '%s'", $this->htmlEscape(Mage::registry("details_data")->getId()));

				} 
				else{

				     return Mage::helper("orderdetails")->__("Add Item");

				}
		}
}
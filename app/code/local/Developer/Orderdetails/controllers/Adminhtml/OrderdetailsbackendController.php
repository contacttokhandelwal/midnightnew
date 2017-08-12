<?php
class Developer_Orderdetails_Adminhtml_OrderdetailsbackendController extends Mage_Adminhtml_Controller_Action
{

	protected function _isAllowed()
	{
		//return Mage::getSingleton('admin/session')->isAllowed('orderdetails/orderdetailsbackend');
		return true;
	}

	public function indexAction()
    {
       $this->loadLayout();
	   $this->_title($this->__("Backend Page Title"));
	   $this->renderLayout();
    }
}
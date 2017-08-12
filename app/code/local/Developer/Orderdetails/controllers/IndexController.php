<?php

class Developer_Orderdetails_IndexController extends Mage_Core_Controller_Front_Action {

    public function IndexAction() {

        $this->loadLayout();
        $this->getLayout()->getBlock("head")->setTitle($this->__("Titlename"));
        $breadcrumbs = $this->getLayout()->getBlock("breadcrumbs");
        $breadcrumbs->addCrumb("home", array(
            "label" => $this->__("Home Page"),
            "title" => $this->__("Home Page"),
            "link" => Mage::getBaseUrl()
        ));

        $breadcrumbs->addCrumb("titlename", array(
            "label" => $this->__("Titlename"),
            "title" => $this->__("Titlename")
        ));

        $this->renderLayout();
    }

    public function saveOrderDataAction() {
        $p = $this->getRequest()->getPost();
        $orderDetails = Mage::getModel('orderdetails/details')->addData($p);
        $orderDetails->save();
        Mage::getSingleton('checkout/session')->addSuccess($this->__('Your information has been saved successfully.'));
        $this->_redirect('/');
    }

}

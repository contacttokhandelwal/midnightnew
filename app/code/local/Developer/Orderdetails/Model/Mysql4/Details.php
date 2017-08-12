<?php
class Developer_Orderdetails_Model_Mysql4_Details extends Mage_Core_Model_Mysql4_Abstract
{
    protected function _construct()
    {
        $this->_init("orderdetails/details", "id");
    }
}